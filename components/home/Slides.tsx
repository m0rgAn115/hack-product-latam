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
  TouchableOpacity,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface Slide {
  title: string;
  description: string;
  icon: React.ReactNode;
  url?: string;
}

interface AutoSliderProps {
  customSlides?: Slide[];
  intervalTime?: number;
}

interface ApiResponse {
  response: {
    descripcion_recomendacion: string;
    titulo_recomendacion: string;
    url_imagen: string;
    url_recomendacion: string;
  };
}

const Slides: React.FC<AutoSliderProps> = ({
  customSlides,
  intervalTime = 5000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Slide>>(null);
  const { width } = Dimensions.get("window");

  type RootStackParamList = {
    Home: undefined;
    Summary: undefined;
    CategoryDetail: {
      category: string;
      transactions: Array<{
        name: string;
        amount: number;
        date: string;
        logo_url?: string;
        merchant_name?: string;
      }>;
    };
    subscriptions: undefined;
  };

  const navigation = useNavigation();

  const [recommendationData, setRecommendationData] = useState<
    ApiResponse["response"] | null
  >(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch("http://127.0.0.1:5001/recommend", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         accessToken: "access-sandbox-afd1b0a9-36eb-4a0b-8173-acdcbb1b0c0a",
    //       }),
    //     });
    //     const result: ApiResponse = await response.json();
    //     console.log(result);
    //     setRecommendationData(result.response);
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    // fetchData();
  }, []);

  const defaultSlides: Slide[] = [
    {
      title: "Talk to your money",
      description:
        "Do you have questions? Use our custom chat to get guidance and make the most of your finances.",
      icon: (
        <Icon
          name="chat"
          size={80}
          color="#4AC0F2"
        />
      ),
      url: "chat",
    },
    {
      title:
        recommendationData?.titulo_recomendacion || "Everything in one place",
      description:
        recommendationData?.descripcion_recomendacion ||
        "Connect your bank accounts and credit cards to get a complete view of your finances.",
      icon:
        recommendationData == null ? (
          <Icon
            name="rocket-launch"
            size={80}
            color="#2196F3"
          />
        ) : (
          <Image
            source={{ uri: recommendationData?.url_imagen }}
            style={{ width: 80, height: 80 }}
          />
        ),
      url: "chat",
    },
    {
      title: "Achieve your goals",
      description: "Set financial goals and track your progress in real time.",
      icon: (
        <Icon
          name="trending-up"
          size={80}
          color="#2196F3"
        />
      ),
      url: "goals",
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
      <TouchableOpacity
        style={[styles.slide, { width }]}
        onPress={() => navigation.navigate("chat")}>
        {item.icon && <View style={styles.iconContainer}>{item.icon}</View>}
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </TouchableOpacity>
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
    paddingHorizontal: 20,
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
