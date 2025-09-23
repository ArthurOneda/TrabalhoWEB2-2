import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string()
    .min(8, "Senha deve ter pelo menos 8 caracteres")
    .regex(/[A-Z]/, "Deve conter uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter um número")
    .regex(/[^A-Za-z0-9]/, "Deve conter um caractere especial"),
  cpf: z.string().length(14, "CPF deve estar no formato 000.000.000-00"),
});

export type SignupFormData = z.infer<typeof signupSchema>;