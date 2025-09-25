import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from './index';
import { toast } from 'react-hot-toast';

const validateCPF = async (cpf: string): Promise<boolean> => {
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  try {
    const response = await fetch(`https://api.nfse.io/validar-cpf?cpf=${cleanCPF}`);
    const data = await response.json();
    return data.valido === true;
  } catch (error) {
    console.error('Erro na validação do CPF. Continuando sem verificação externa.');
    return cleanCPF.length === 11 && /^\d+$/.test(cleanCPF);
  }
};

export const useLogin = () => {
    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login realizado com sucesso!');
        } catch (error: any) {
            let message = 'Erro ao fazer login.';
            if (error.code === 'auth/invalid-credential') {
                message = 'E-mail ou senha inválidos.';
            } else if (error.code === 'auth/user-not-found') {
                message = 'Usuário não encontrado.';
            }
            toast.error(message);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success('Login com Google realizado!');
        } catch (error: any) {
            toast.error('Erro ao fazer login com Google.');
            throw error;
        }
    };

    const loginWithGithub = async () => {
        try {
            await signInWithPopup(auth, githubProvider);
            toast.success('Login com GitHub realizado!');
        } catch (error: any) {
            let message = 'Erro ao fazer login com GitHub.';
            if (error.code === 'auth/popup-closed-by-user') {
                message = 'Login cancelado.';
            }
            toast.error(message);
            throw error;
        }
    };

    const signup = async (
        name: string,
        email: string,
        password: string,
        cpf: string
    ) => {
        try {
            const isCPFValid = await validateCPF(cpf);
            if (!isCPFValid) {
                toast.error('CPF inválido ou não existe.');
                throw new Error('CPF inválido');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            toast.success('Conta criada! Verifique seu e-mail para ativar.');

            return user;
        } catch (error: any) {
            let message = 'Erro ao criar conta.';
            if (error.code === 'auth/email-already-in-use') {
                message = 'Este e-mail já está cadastrado.';
            } else if (error.code === 'auth/invalid-email') {
                message = 'E-mail inválido.';
            } else if (error.code === 'auth/weak-password') {
                message = 'Senha fraca. Use pelo menos 6 caracteres.';
            }
            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Você saiu da sua conta.');
        } catch (error) {
            toast.error('Erro ao sair.');
        }
    };

    return { loginWithEmail, loginWithGoogle, loginWithGithub, signup, logout };
};