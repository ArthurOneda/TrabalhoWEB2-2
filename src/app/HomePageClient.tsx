'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePageClient({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; oobCode?: string }>;
}) {
  const params = use(searchParams);
  const router = useRouter();

  if (params.mode && params.oobCode) {
    if (params.mode === 'verifyEmail') {
      router.replace(`/auth/verify-email?oobCode=${encodeURIComponent(params.oobCode)}`);
    } else if (params.mode === 'resetPassword') {
      router.replace(`/auth/reset-password?oobCode=${encodeURIComponent(params.oobCode)}`);
    }
  } else {
    router.replace('/auth/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-gray-600">Redirecionando...</p>
    </div>
  );
}