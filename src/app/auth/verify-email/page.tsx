import { Suspense } from 'react';
import VerifyEmailForm from './VerifyEmailForm';

export default function VerifyEmailPage({
    searchParams,
}: {
    searchParams: Promise<{ oobCode?: string }>;
}) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Verificação de E-mail</h1>

                <Suspense fallback={<div className="py-4">Verificando...</div>}>
                    <VerifyEmailForm searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}