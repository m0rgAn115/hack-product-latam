
import { Transaction } from '@/components/Interfaces/transaction.interface';
import { create } from 'zustand'
import { set } from 'date-fns';
import { PlaidTransaction } from '@/components/home/expensess';

type TransactionsStore = {
  transacciones: PlaidTransaction[];
  setTransacciones: (transacciones:PlaidTransaction[]) => void;
  clearUser: () => void;
}

export const useTransactionsStore = create<TransactionsStore>()((set) => ({
  transacciones: [],
  setTransacciones: (transacciones:PlaidTransaction[]) => set({ transacciones: transacciones }),
  clearUser: () => set({transacciones: []}),
}));
