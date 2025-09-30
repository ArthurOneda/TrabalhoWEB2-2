import {
    AuthError,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail as firebaseSendPasswordResetEmail,
    confirmPasswordReset as firebaseConfirmPasswordReset,
    verifyPasswordResetCode,
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
        console.error(error);
        return cleanCPF.length === 11 && /^\d+$/.test(cleanCPF);
    }
};

function isAuthError(error: unknown): error is AuthError {
    return typeof error === 'object' && error !== null && 'code' in error;
}

export const useLogin = () => {
    const loginWithEmail = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (!user.emailVerified) {
                await signOut(auth);
                toast.error('Por favor, verifique seu e-mail antes de fazer login.');
                throw new Error('email-not-verified');
            }

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
            } else if ((error as Error).message !== 'email-not-verified') {
                toast.error('Erro inesperado. Tente novamente.');
                console.error('Erro desconhecido no login:', error);
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
                return null;
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

    const sendPasswordResetEmail = async (email: string) => {
        try {
            await firebaseSendPasswordResetEmail(auth, email);
            toast.success('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
        } catch (error) {
            if (isAuthError(error)) {
                let message = 'Erro ao enviar e-mail.';
                if (error.code === 'auth/user-not-found') {
                    message = 'Nenhum usuário encontrado com este e-mail.';
                } else if (error.code === 'auth/invalid-email') {
                    message = 'E-mail inválido.';
                }
                toast.error(message);
            } else {
                toast.error('Erro inesperado. Tente novamente.');
                console.error('Erro ao enviar e-mail de redefinição:', error);
            }
            throw error;
        }
    };

    const checkPasswordResetCode = async (oobCode: string) => {
        try {
            const email = await verifyPasswordResetCode(auth, oobCode);
            return email;
        } catch (error) {
            if (isAuthError(error)) {
                if (error.code === 'auth/expired-action-code') {
                    toast.error('Link expirado. Solicite um novo e-mail.');
                } else if (error.code === 'auth/invalid-action-code') {
                    toast.error('Link inválido.');
                }
            } else {
                toast.error('Erro ao verificar link.');
            }
            throw error;
        }
    };

    const confirmPasswordReset = async (oobCode: string, newPassword: string) => {
        try {
            await firebaseConfirmPasswordReset(auth, oobCode, newPassword);
            toast.success('Senha redefinida com sucesso! Faça login com sua nova senha.');
        } catch (error) {
            if (isAuthError(error)) {
                let message = 'Erro ao redefinir senha.';
                if (error.code === 'auth/expired-action-code') {
                    message = 'Link expirado. Solicite um novo e-mail.';
                } else if (error.code === 'auth/invalid-action-code') {
                    message = 'Link inválido.';
                } else if (error.code === 'auth/weak-password') {
                    message = 'Senha fraca. Use pelo menos 6 caracteres.';
                }
                toast.error(message);
            } else {
                toast.error('Erro inesperado. Tente novamente.');
                console.error('Erro ao redefinir senha:', error);
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

    return {
        loginWithEmail, loginWithGoogle, loginWithGithub, signup, sendPasswordResetEmail,
        checkPasswordResetCode, confirmPasswordReset, logout
    };
};