'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Transaction } from '@/types';
import { useTransactions } from '@/lib/firebase/transaction';
import { TransactionFilters } from '@/app/components/features/transactions/TransactionFilters';
import { TransactionList } from '@/app/components/features/transactions/TransactionList';

export default function TransactionsPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const { getTransactions } = useTransactions();

    const handleFilterChange = useCallback((filters: {
        type?: 'income' | 'expense';
        category?: string;
        startDate?: Date;
        endDate?: Date;
    }) => {
        let result = [...transactions];

        if (filters.type) {
            result = result.filter(t => t.type === filters.type);
        }

        if (filters.category) {
            result = result.filter(t => t.category === filters.category);
        }

        if (filters.startDate) {
            result = result.filter(t => t.date >= filters.startDate!);
        }

        if (filters.endDate) {
            result = result.filter(t => t.date <= filters.endDate!);
        }

        setFilteredTransactions(result);
    }, [transactions]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const data = await getTransactions();
                setTransactions(data);
                setFilteredTransactions(data);
            } catch (error) {
                toast.error('Erro ao carregar transações');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Minhas Transações</h1>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Minhas Transações</h1>
                <button
                    onClick={() => router.push('/main/transactions/new')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                    + Nova Transação
                </button>
            </div>

            <TransactionFilters onFilterChange={handleFilterChange} />
            <TransactionList transactions={filteredTransactions} />
        </div>
    );
}