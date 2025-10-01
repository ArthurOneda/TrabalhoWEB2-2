import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams: Promise<{ oobCode?: string }>;
}) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Redefinir Senha</h1>
                    <p className="text-gray-600">Informe sua nova senha abaixo.</p>
                </div>

                {/* ✅ Wrap o componente client-only com Suspense */}
                <Suspense fallback={<div className="text-center py-4">Carregando...</div>}>
                    <ResetPasswordForm searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    );
}