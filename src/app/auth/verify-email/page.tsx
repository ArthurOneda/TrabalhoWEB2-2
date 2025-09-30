'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function VerifyEmailPage() {
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        const oobCode = searchParams.get('oobCode');
        if (!oobCode) {
            setStatus('error');
            toast.error('Link de verificação inválido.');
            return;
        }

        setStatus('verifying');
        const auth = getAuth();

        applyActionCode(auth, oobCode)
            .then(() => {
                setStatus('success');
                toast.success('E-mail verificado com sucesso! Agora você pode fazer login.');
            })
            .catch((error) => {
                console.error('Erro ao verificar e-mail:', error);
                setStatus('error');
                toast.error('Link expirado ou inválido.');
            });
    }, [searchParams]);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Verificação de E-mail</h1>

                {status === 'verifying' && (
                    <div>
                        <p className="text-gray-600 mb-4">Verificando seu e-mail...</p>
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                )}

                {status === 'success' && (
                    <div>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 text-2xl">✓</span>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Seu e-mail foi verificado com sucesso!
                        </p>
                        <Link
                            href="/auth/login"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg inline-block transition-colors"
                        >
                            Ir para o Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-red-600 text-2xl">✕</span>
                        </div>
                        <p className="text-gray-700 mb-6">
                            Não foi possível verificar seu e-mail. O link pode ter expirado.
                        </p>
                        <Link
                            href="/auth/signup"
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg inline-block transition-colors"
                        >
                            Criar Nova Conta
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}