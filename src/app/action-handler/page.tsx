'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ActionHandlerPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get('oobCode');

    useEffect(() => {
        const mode = searchParams.get('mode');
        const oobCode = searchParams.get('oobCode');

        if (!mode || !oobCode) {
            toast.error('Link inválido.');
            router.push('/auth/login');
            return;
        }

        if (mode === 'verifyEmail') {
            router.push(`/auth/verify-email?oobCode=${oobCode}`);
        } else if (mode === 'resetPassword') {
            router.push(`/auth/reset-password?oobCode=${oobCode}`);
        } else {
            toast.error('Ação não suportada.');
            router.push('/auth/login');
        }
    }, [router, searchParams]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <p className="text-gray-600">Processando...</p>
        </div>
    );
}