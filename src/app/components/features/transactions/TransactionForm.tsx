'use client';

import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TransactionFormData, transactionSchema, expenseCategories, incomeCategories } from '@/lib/validations/transactionSchema';
import { useTransactions } from '@/lib/firebase/transaction';

interface TransactionFormProps {
    transaction?: {
        id: string;
        type: 'income' | 'expense';
        description: string;
        value: number;
        date: Date;
        category: string;
        status?: 'paid' | 'pending';
    };
    onSuccess?: () => void;
}

export function TransactionForm({ transaction, onSuccess }: TransactionFormProps) {
    const { addTransaction, updateTransaction } = useTransactions();
    const [type, setType] = useState<'income' | 'expense'>(transaction?.type || 'expense');

    const form = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: transaction?.type || 'expense',
            description: transaction?.description || '',
            value: transaction?.value || 0,
            date: transaction?.date || new Date(),
            category: transaction?.category || '',
            status: transaction?.status || 'pending',
        },
    });

    const { handleSubmit, register, setValue, watch, formState: { errors } } = form;

    useEffect(() => {
        setValue('type', type);
        if (!transaction) {
            setValue('category', '');
        }
    }, [type, setValue, transaction]);

    const currentType = watch('type');
    const categories = currentType === 'expense' ? expenseCategories : incomeCategories;

    const onSubmit = async (data: TransactionFormData) => {
        try {
            if (transaction) {
                await updateTransaction(transaction.id, data);
                toast.success('Transação atualizada com sucesso!');
            } else {
                await addTransaction(data);
                toast.success('Transação adicionada com sucesso!');
            }
            onSuccess?.();
        } catch (error) {
            toast.error('Erro ao salvar transação');
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`py-3 px-4 rounded-lg border transition-colors ${type === 'income'
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Receita
                </button>
                <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`py-3 px-4 rounded-lg border transition-colors ${type === 'expense'
                            ? 'bg-red-100 border-red-500 text-red-700'
                            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Despesa
                </button>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <input
                    {...register('description')}
                    placeholder="Ex: Salário, Aluguel, Supermercado"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Valor (R$)</label>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register('value', { valueAsNumber: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
                <input
                    type="date"
                    {...register('date', {
                        setValueAs: (value) => value ? new Date(value) : new Date(),
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria
                </label>
                <select
                    {...register('category')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                >
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
            </div>

            {type === 'expense' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                        {...register('status')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    >
                        <option value="pending">Pendente</option>
                        <option value="paid">Pago</option>
                    </select>
                </div>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
                {transaction ? 'Atualizar' : 'Adicionar'}
            </button>
        </form>
    );
}