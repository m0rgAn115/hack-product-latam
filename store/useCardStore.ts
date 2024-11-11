
import { Transaction } from '@/components/Interfaces/transaction.interface';
import { create } from 'zustand'
import { set } from 'date-fns';
import { PlaidTransaction } from '@/components/home/expensess';
import { Card } from '@/components/home/Cards';

type CardsStore = {
  cards: Card[];
  setCards: (cards:Card[]) => void;
  clearUser: () => void;
}

export const useCardsStore = create<CardsStore>()((set) => ({
  cards: [],
  setCards: (cards:Card[]) => set({ cards }),
  clearUser: () => set({cards: []}),
}));
