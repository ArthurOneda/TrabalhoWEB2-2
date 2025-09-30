import { z } from 'zod';

export const expenseCategories = ['Moradia', 'Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros'] as const;
export const incomeCategories = ['Salário', 'Freelance', 'Investimentos', 'Outros'] as const;

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.number().positive('Valor deve ser positivo'),
  date: z.date(),
  category: z.string().min(1, 'Categoria é obrigatória'),
  status: z.enum(['paid', 'pending']).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;