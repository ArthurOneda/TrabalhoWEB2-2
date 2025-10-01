import { useState, useEffect } from 'react';
import { expenseCategories, incomeCategories } from '@/lib/validations/transactionSchema';

interface TransactionFiltersProps {
    onFilterChange: (filters: {
        type?: 'income' | 'expense';
        category?: string;
        startDate?: Date;
        endDate?: Date;
    }) => void;
}

export function TransactionFilters({ onFilterChange }: TransactionFiltersProps) {
    const [type, setType] = useState<'all' | 'income' | 'expense'>('all');
    const [category, setCategory] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        onFilterChange({
            type: type === 'all' ? undefined : type,
            category: category || undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
        });
    }, [type, category, startDate, endDate, onFilterChange]);

    const handleTypeChange = (value: string) => {
        if (value === 'all' || value === 'income' || value === 'expense') {
            setType(value);
        }
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value);
    };

    const handleEndDateChange = (value: string) => {
        setEndDate(value);
    };

    const categories = type === 'all'
        ? [...expenseCategories, ...incomeCategories]
        : type === 'expense'
            ? expenseCategories
            : incomeCategories;

    useEffect(() => {
        const categoriesAsStrings = categories.map(cat => cat as string);
        if (category && !categoriesAsStrings.includes(category)) {
            setCategory('');
        }
    }, [categories, category]);

    return (
        <div className="bg-white p-4 rounded-xl shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                    <select
                        value={type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="all">Todos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">Todas</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Inicial</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Data Final</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}