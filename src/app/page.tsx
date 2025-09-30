'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (mode && oobCode) {
      if (mode === 'verifyEmail') {
        router.push(`/auth/verify-email?oobCode=${encodeURIComponent(oobCode)}`);
      } else if (mode === 'resetPassword') {
        router.push(`/auth/reset-password?oobCode=${encodeURIComponent(oobCode)}`);
      }
      return;
    }

    router.push('/auth/login');
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <p className="text-gray-600">Redirecionando...</p>
    </div>
  );
}