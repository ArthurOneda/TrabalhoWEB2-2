'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLogin } from '@/lib/firebase/hooks';
import { toast } from 'react-hot-toast';

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { checkPasswordResetCode, confirmPasswordReset } = useLogin();
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        if (!oobCode) {
            setError('Link inválido.');
            toast.error('Link de redefinição inválido.');
            return;
        }

        const verifyCode = async () => {
            try {
                const userEmail = await checkPasswordResetCode(oobCode);
                setEmail(userEmail);
            } catch (err) {
                setError('Link inválido ou expirado.');
            }
        };

        verifyCode();
    }, [oobCode, checkPasswordResetCode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oobCode) {
            toast.error('Link inválido.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setLoading(true);
        try {
            await confirmPasswordReset(oobCode, newPassword);
            router.push('/auth/login');
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-red-600 text-2xl">✕</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Link Inválido</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        href="/auth/forgot-password"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Solicitar novo link
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Redefinir Senha</h1>
                    {email && (
                        <p className="text-gray-600">
                            Redefinindo senha para: <span className="font-medium">{email}</span>
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nova Senha
                        </label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Senha"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar Nova Senha
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirme sua senha"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
                    >
                        {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/auth/login" className="text-blue-600 hover:underline">
                        ← Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
}