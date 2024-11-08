import moment from 'moment';
import { mainCategories } from './categoriesConfig';
import { MainCategories } from './categoriesConfig';
import plaidTransactions from './PlaidTransactions';

interface PlaidTransaction {
    date: string;
    amount: number;
    logo_url?: string;
    merchant_name?: string;
    name: string;
    category: string[];
    mainCategory?: keyof typeof mainCategories | "Others";
}

export const filterTransactions = (transactions: PlaidTransaction[]): PlaidTransaction[] => {
    return transactions
        .filter(transaction => {
            const mainCategory = (Object.keys(mainCategories) as (keyof MainCategories)[]).find(mainCat =>
                transaction.category.some(cat => mainCategories[mainCat].includes(cat))
            );
            if (mainCategory) {
                transaction.mainCategory = mainCategory;
            }
            return true;
        })
        .map(transaction => ({
            ...transaction,
            mainCategory: transaction.mainCategory || "Others",
        }));
}

export const filteredTransactions = filterTransactions(plaidTransactions);
