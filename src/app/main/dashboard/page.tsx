'use client';

import { useEffect, useState } from 'react';
import { useTransactions} from '@/lib/firebase/transaction';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { format, isWithinInterval, addDays, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Transaction } from '@/types';

const EXPENSE_CATEGORIES = ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros'];
const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC926'];

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dolar, setDolar] = useState<string | null>(null);
  const [ibovespa, setIbovespa] = useState<string | null>(null);

  const { getTransactions } = useTransactions();

  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.value;
      if (t.type === 'expense') acc.expense += t.value;
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals.income - totals.expense;

  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.value;
      return acc;
    }, {});

  const totalExpense = Object.values(expenseByCategory).reduce((sum, val) => sum + val, 0);

  interface PieChartData {
    name: string;
    value: number;
    percent: number;
  }

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
    percent: totalExpense > 0 ? value / totalExpense : 0,
  }));

  const today = startOfDay(new Date());
  const nextWeek = addDays(today, 7);
  const pendingExpenses = transactions
    .filter(t =>
      t.type === 'expense' &&
      t.status === 'pending' &&
      isWithinInterval(t.date, { start: today, end: nextWeek })
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        toast.error('Erro ao carregar transações');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [getTransactions]);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // ✅ URLs sem espaços
        const dolarRes = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const dolarData = await dolarRes.json();
        setDolar(dolarData.USDBRL.bid);

        const ibovRes = await fetch('https://api-cotacao-b3.labdo.it/api/cotacao/ibovespa');
        const ibovData = await ibovRes.json();
        setIbovespa(ibovData.ultima_cotacao);
      } catch (error) {
        console.warn('Erro ao buscar cotações:', error);
      }
    };
    fetchQuotes();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Financeiro</h1>
        <p className="text-gray-600">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Financeiro</h1>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-medium text-blue-800">Receitas</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {totals.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-medium text-red-800">Despesas</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">
            {totals.expense.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>

        {/* ✅ Classes corrigidas */}
        <div className={`${balance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} rounded-xl p-6`}>
          <h3 className={`text-lg font-medium ${balance >= 0 ? 'text-green-800' : 'text-red-800'}`}>Saldo</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'} mt-2`}>
            {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Categorias */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Despesas por Categoria</h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => {
                    const { name, percent } = entry as unknown as PieChartData;
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 'Valor']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-10">Nenhuma despesa registrada.</p>
          )}
        </div>

        {/* Cotações + Alertas */}
        <div className="space-y-6">
          {/* Cotações */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cotações</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Dólar (USD)</span>
                <span className="font-bold text-green-600">
                  {dolar ? `R$ ${parseFloat(dolar).toFixed(2)}` : 'Carregando...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Ibovespa</span>
                <span className="font-bold text-blue-600">
                  {ibovespa || 'Carregando...'}
                </span>
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Próximos Vencimentos</h2>
            {pendingExpenses.length > 0 ? (
              <div className="space-y-3">
                {pendingExpenses.map((expense) => (
                  <div key={expense.id} className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <p className="font-medium text-red-800">{expense.description}</p>
                    <p className="text-sm text-red-600">
                      Vence em {format(expense.date, 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhum vencimento nos próximos 7 dias.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}