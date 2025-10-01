'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { applyActionCode, getAuth } from 'firebase/auth';
import { toast } from 'react-hot-toast';

export default function VerifyEmailForm({
    searchParams,
}: {
    searchParams: Promise<{ oobCode?: string }>;
}) {
    const params = use(searchParams);
    const oobCode = params.oobCode;
    const [status, setStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');
    const router = useRouter();

    useEffect(() => {
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
                toast.success('E-mail verificado com sucesso!');
            })
            .catch((error) => {
                console.error('Erro ao verificar e-mail:', error);
                setStatus('error');
                toast.error('Link expirado ou inválido.');
            });
    }, [oobCode]);

    if (status === 'verifying') {
        return (
            <div>
                <p className="text-gray-600 mb-4">Verificando seu e-mail...</p>
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl">✓</span>
                </div>
                <p className="text-gray-700 mb-6">Seu e-mail foi verificado com sucesso!</p>
                <button
                    onClick={() => router.push('/auth/login')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                    Ir para o Login
                </button>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-600 text-2xl">✕</span>
                </div>
                <p className="text-gray-700 mb-6">Não foi possível verificar seu e-mail.</p>
                <button
                    onClick={() => router.push('/auth/signup')}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                    Criar Nova Conta
                </button>
            </div>
        );
    }

    return null;
}