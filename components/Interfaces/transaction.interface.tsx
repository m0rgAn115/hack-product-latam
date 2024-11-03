import { Icons } from '../Expenses/iconsConfig';


export type IconsKeys = keyof typeof Icons;

export type Transaction = {
    titulo: string;
    monto: number;
    categoria: string;
    fecha: string;
}

export type Category = {
    name: string;
    icon: IconsKeys;
}

export type Category_Transactions = {
    category: Category;
    transacciones: Transaction[];
  };