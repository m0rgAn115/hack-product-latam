import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

const Cards = () => {
  const [cards, setCards] = useState([
    { id: 1, type: "Credito", accent: "#4A90E2", lastDigits: 4567 },
    { id: 2, type: "Debito", accent: "#FF6B6B", lastDigits: 8901 },
    { id: 3, type: "Debito", accent: "#50E3C2", lastDigits: 3456 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newCardType, setNewCardType] = useState("");
  const [newCardAccent, setNewCardAccent] = useState("");
  const [newCardLastDigits, setNewCardLastDigits] = useState("");

  interface CardProps {
    accent: string;
    type: string;
    lastDigits: string;
  }

  const Card = ({ accent, type, lastDigits }: CardProps) => (
    <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
      <View style={[styles.accentLine, { backgroundColor: accent }]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.chipContainer}>
            <View style={styles.chip} />
          </View>
          <Text
            style={[styles.cardType, { color: accent, fontWeight: "light" }]}>
            {type}
          </Text>
        </View>

        <Text style={styles.cardNumber}>•••• {lastDigits}</Text>
      </View>
    </View>
  );

  const addNewCard = () => {
    const newCard = {
      id: cards.length + 1,
      type: newCardType,
      accent: newCardAccent,
      lastDigits: parseInt(newCardLastDigits),
    };
    setCards([...cards, newCard]);
    setNewCardType("");
    setNewCardAccent("");
    setNewCardLastDigits("");
    setShowForm(false);
  };

  return (
    <>
      <View style={styles.container}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 20}
          contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={[styles.cardContainer, styles.addCardButton]}>
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>
          {cards.map((card) => (
            <View
              key={card.id}
              style={styles.cardContainer}>
              <Card {...card} />
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  cardContainer: {
    marginRight: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  accentLine: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chipContainer: {
    width: 40,
    height: 30,
    padding: 2,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 4,
  },
  chip: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 2,
  },
  cardType: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardNumber: {
    color: "#000",
    fontSize: 14,
    letterSpacing: 2,
    fontWeight: "400",
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
  },
  validThru: {
    color: "#999",
    fontSize: 12,
    textTransform: "uppercase",
  },
  expiryDate: {
    color: "#000",
    fontSize: 12,
    fontWeight: "500",
  },
  addCardButton: {
    width: CARD_WIDTH / 2,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
  },
  plusIcon: {
    fontSize: 32,
    color: "#999",
  },
  formContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  formHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  closeButton: {
    fontSize: 24,
    color: "#999",
    padding: 4,
  },
  input: {
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 16,
    // marginBottom: 12,
    fontSize: 16,
    color: "#000",
  },
  addButton: {
    height: 48,
    backgroundColor: "#000",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Cards;
