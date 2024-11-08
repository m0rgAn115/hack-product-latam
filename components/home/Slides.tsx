import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  FlatList,
  ViewToken,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface Slide {
  title: string;
  description: string;
  image?: any;
  icon?: React.ReactNode;
}

interface AutoSliderProps {
  customSlides?: Slide[];
  intervalTime?: number;
}

const Slides: React.FC<AutoSliderProps> = ({
  customSlides,
  intervalTime = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Slide>>(null);
  const { width } = Dimensions.get("window");

  const defaultSlides: Slide[] = [
    {
      title: "Habla con tu dinero.",
      description:
        "¿Tienes preguntas? Usa nuestro chat personalizado para recibir orientación y aprovechar mejor tus finanzas.",
      icon: (
        <Icon
          name="chat"
          size={80}
          color="#4AC0F2"
        />
      ),
    },
    {
      title: "Cumple tus metas",
      description:
        "Establece metas financieras y haz un seguimiento de tu progreso en tiempo real.",
      icon: (
        <Icon
          name="dashboard"
          size={80}
          color="#4CAF50"
        />
      ),
    },
    {
      title: "Todo en un solo lugar",
      description:
        "Conecta tus cuentas bancarias y tarjetas de crédito para tener una vista completa de tus finanzas.",
      icon: (
        <Icon
          name="rocket-launch"
          size={80}
          color="#2196F3"
        />
      ),
    },
  ];

  const slides = customSlides || defaultSlides;

  const goToNextSlide = () => {
    if (!flatListRef.current) return;

    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToOffset({
        offset: (currentIndex + 1) * width,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      flatListRef.current.scrollToOffset({
        offset: 0,
        animated: true,
      });
      setCurrentIndex(0);
    }
  };

  // Timer para el cambio automático
  useEffect(() => {
    const timer = setInterval(goToNextSlide, intervalTime);
    return () => clearInterval(timer);
  }, [currentIndex, intervalTime]);

  // Renderizar cada slide
  const renderItem = ({ item }: { item: Slide }) => {
    return (
      <View style={[styles.slide, { width }]}>
        {item.image && (
          <Image
            source={
              typeof item.image === "string" ? { uri: item.image } : item.image
            }
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {item.icon && <View style={styles.iconContainer}>{item.icon}</View>}

        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]) {
        setCurrentIndex(viewableItems[0].index || 0);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        keyExtractor={(_, index) => index.toString()}
      />

      {/* Indicadores */}
      <View style={styles.pagination}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: currentIndex === index ? "#000" : "#ccc",
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default Slides;
