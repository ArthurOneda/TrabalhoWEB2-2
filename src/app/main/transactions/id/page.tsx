'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { TransactionForm } from '@/app/components/features/transactions/TransactionForm';
import { useTransactions } from '@/lib/firebase/transaction';

export default function EditTransactionPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { getTransactionById } = useTransactions();

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const data = await getTransactionById(id);
                setTransaction(data);
            } catch (error) {
                toast.error('Transação não encontrada');
                router.push('/main/transactions');
            } finally {
                setLoading(false);
            }
        };
        fetchTransaction();
    }, [id, router, getTransactionById]);

    const handleSuccess = () => {
        router.push('/main/transactions');
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <p>Carregando...</p>
            </div>
        );
    }

    if (!transaction) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Editar Transação
            </h1>
            <TransactionForm transaction={transaction} onSuccess={handleSuccess} />
        </div>
    );
}