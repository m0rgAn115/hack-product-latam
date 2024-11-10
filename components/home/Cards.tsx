import { useUserStore } from "@/app/store/useUserStore";
import useFetch from "@/hooks/useFetch";
import useGetTokens from "@/hooks/useGetTokens";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
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

type Card = {
  id: string,
  balance: number,
  name: string,
  type: string,
  accent: string,
};

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.4;
const CARD_HEIGHT = CARD_WIDTH * 1.1;

const Cards = () => {
  const {  setUser, correo } = useUserStore();
  const [cards, setCards] = useState<Card[]>([]);


  useEffect(() => {
    const suma = cards.reduce((total, card) => total + card.balance, 0);
    setUser({ ...useUserStore.getState(), saldo: suma });
    
  }, [cards])

  useEffect(() => {
    if (correo) {
      const fetchCardsForTokens = async () => {
        await useFetch(
          'https://zttizctjsl.execute-api.us-east-1.amazonaws.com/backend/account/cards/email',
          { correo },
          'POST'
        ).then((data) => {
          const newCards = data.cuentas.map((card: any) => ({
            id: card.account_id,
            balance: card.balances.current,
            name: card.name,
            type: card.type,
            accent: card.accent,
          }));
          setCards(newCards);
        });
      };
      fetchCardsForTokens();
    }
  }, [correo]);
  

  const CardComponent = (card: Card) => {
    let accent = "#ffffff";

    switch (card.type) {
      case "credit":
        card.type = "Crédito";
        accent = "#9cd198";
        break;
      case "depository":
        card.type = "Débito";
        accent = "#0683dd";
        break;
      case "prepaid":
        card.type = "Prepagada";
        accent = "#D3D3D3";
        break;
    }

    return (
      <View style={[styles.card, { width: CARD_WIDTH, height: CARD_HEIGHT }]}>
        <View style={[styles.accentLine, { backgroundColor: accent }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.chipContainer}>
              <View style={styles.chip} />
            </View>
            <Text style={[styles.cardType, { fontWeight: "light" }]}>
              {card.type}
            </Text>
          </View>
          <Text style={[styles.cardNumber, { fontWeight: '600' }]}> {card.name}</Text>
          <Text style={[styles.cardNumber, { fontSize: 14, color: '#D4AF37', fontWeight: '600'}]}>... {card.id.slice(0,4)}</Text>
        </View>
      </View>
    );
  };

  const addNewCard = () => {
    // Lógica para añadir una nueva tarjeta (si es necesario)
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
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity
            onPress={() => router.navigate('/webview')}
            style={[styles.cardContainer, styles.addCardButton]}
          >
            <Text style={styles.plusIcon}>+</Text>
          </TouchableOpacity>

          {cards ? cards.map((card) => (
            <View key={card.id} style={styles.cardContainer}>
              <CardComponent {...card} />
            </View>
          ))
          : 
            <Text style={{ color: 'black' }} >Cargando tarjetas...</Text>
        }
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
    fontSize: 12,
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
