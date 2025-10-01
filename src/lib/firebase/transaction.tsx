import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './index';
import { auth } from './index';
import { Transaction } from '@/types';

export type TransactionType = 'income' | 'expense';
export type ExpenseStatus = 'paid' | 'pending';

export const useTransactions = () => {
    const getCurrentUserId = () => {
        const user = auth.currentUser;
        if (!user) throw new Error('Usuário não autenticado');
        return user.uid;
    };

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        const userId = getCurrentUserId();
        const transactionRef = collection(db, 'users', userId, 'transactions');
        const docRef = await addDoc(transactionRef, {
            ...transaction,
            date: transaction.date,
            createdAt: new Date(),
        });
        return { id: docRef.id, ...transaction };
    };

    const getTransactions = async () => {
        const userId = getCurrentUserId();
        const q = query(collection(db, 'users', userId, 'transactions'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date.toDate(),
        })) as Transaction[];
    };

    const deleteTransaction = async (id: string) => {
        const userId = getCurrentUserId();
        await deleteDoc(doc(db, 'users', userId, 'transactions', id));
    };

    const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
        const userId = getCurrentUserId();
        await updateDoc(doc(db, 'users', userId, 'transactions', id), transaction);
    };

    const getTransactionById = async (id: string) => {
        const userId = getCurrentUserId();
        const docRef = doc(db, 'users', userId, 'transactions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
                date: docSnap.data().date.toDate(),
            } as Transaction;
        }
        throw new Error('Transação não encontrada');
    };

    return {
        addTransaction,
        getTransactions,
        deleteTransaction,
        updateTransaction,
        getTransactionById,
    };
};