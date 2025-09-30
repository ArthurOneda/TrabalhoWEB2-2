'use client';

import { useRouter } from 'next/navigation';
import { TransactionForm } from '@/app/components/features/transactions/TransactionForm';

export default function NewTransactionPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/main/transactions');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Adicionar Nova Transação
      </h1>
      <TransactionForm onSuccess={handleSuccess} />
    </div>
  );
}