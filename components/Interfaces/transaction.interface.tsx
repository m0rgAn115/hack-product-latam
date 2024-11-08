import { Icons } from '../Expenses/iconsConfig';


export type IconsKeys = keyof typeof Icons;

export type Transaction = {
    date: string,
    amount: number
    logo_url: string|null,
    merchant_name: string|null,
    name: string,
    category: string[]
}

export type Category = {
    name: string;
    icon: IconsKeys;
}

export type Category_Transactions = {
    category: Category;
    transacciones: Transaction[];
  };