
import { create } from 'zustand'

type UserStore = {
  correo: string;
  nombre: string;
  img_url: string;
  accessToken: string[];
  saldo: number;
  setUser: (user: { correo: string; nombre: string; img_url: string; accessToken: string[], saldo: number }) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>()((set) => ({
  correo: '',
  nombre: '',
  img_url: '',
  saldo: 0,
  accessToken: [],
  setUser: (user) => set({ ...user }),
  clearUser: () => set({ correo: '', nombre: '', img_url: '', accessToken: [] }),
}));
