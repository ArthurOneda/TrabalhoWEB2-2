import {
    AuthError,
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

function isAuthError(error: unknown): error is AuthError {
    return typeof error === 'object' && error !== null && 'code' in error;
}

export const useLogin = () => {
    const loginWithEmail = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success('Login realizado com sucesso!');
        } catch (error) {
            if (isAuthError(error)) {
                let message = 'Erro ao fazer login.';
                switch (error.code) {
                    case 'auth/invalid-credential':
                        message = 'E-mail ou senha inválidos.';
                        break;
                    case 'auth/user-not-found':
                        message = 'Usuário não encontrado.';
                        break;
                    case 'auth/wrong-password':
                        message = 'Senha incorreta.';
                        break;
                    case 'auth/too-many-requests':
                        message = 'Muitas tentativas. Tente novamente mais tarde.';
                        break;
                    default:
                        message = 'Erro ao fazer login. Tente novamente.';
                }
                toast.error(message);
            } else {
                toast.error('Erro inesperado. Tente novamente.');
                console.error('Erro desconhecido:', error);
            }
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            toast.success('Login com Google realizado!');
        } catch (error) {
            if (isAuthError(error)) {
                let message = 'Erro ao fazer login com Google.';
                if (error.code === 'auth/popup-closed-by-user') {
                    message = 'Login com Google cancelado.';
                }
                toast.error(message);
            } else {
                toast.error('Erro inesperado com Google.');
                console.error('Erro desconhecido no Google login:', error);
            }
            throw error;
        }
    };

    const loginWithGithub = async () => {
        try {
            await signInWithPopup(auth, githubProvider);
            toast.success('Login com GitHub realizado!');
        } catch (error) {
            if (isAuthError(error)) {
                let message = 'Erro ao fazer login com GitHub.';
                if (error.code === 'auth/popup-closed-by-user') {
                    message = 'Login com GitHub cancelado.';
                }
                toast.error(message);
            } else {
                toast.error('Erro inesperado com GitHub.');
                console.error('Erro desconhecido no GitHub login:', error);
            }
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
        } catch (error) {
            if (isAuthError(error)) {
                let message = 'Erro ao criar conta.';
                if (error.code === 'auth/email-already-in-use') {
                    message = 'Este e-mail já está cadastrado.';
                } else if (error.code === 'auth/invalid-email') {
                    message = 'E-mail inválido.';
                } else if (error.code === 'auth/weak-password') {
                    message = 'Senha fraca. Use pelo menos 6 caracteres.';
                } else if (error.code === 'auth/operation-not-allowed') {
                    message = 'Operação de cadastro desativada.';
                }
                toast.error(message);
            } else {
                toast.error('Erro inesperado ao criar conta.');
                console.error('Erro desconhecido no signup:', error);
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Você saiu da sua conta.');
        } catch (error) {
            if (isAuthError(error)) {
                toast.error('Erro ao sair da conta.');
            } else {
                toast.error('Erro inesperado ao sair.');
                console.error('Erro no logout:', error);
            }
        }
    };

    return { loginWithEmail, loginWithGoogle, loginWithGithub, signup, logout };
};