import { Suspense } from 'react';
import HomePageClient from './HomePageClient';

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; oobCode?: string }>;
}) {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Redirecionando...</div>}>
      <HomePageClient searchParams={searchParams} />
    </Suspense>
  );
}