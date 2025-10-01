import { connection } from 'next/server';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  return [];
}

export default async function ActionHandlerPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; oobCode?: string }>;
}) {
  await connection();

  const params = await searchParams;
  const { mode, oobCode } = params;

  if (!mode || !oobCode) {
    return redirect('/auth/login');
  }

  if (mode === 'verifyEmail') {
    return redirect(`/auth/verify-email?oobCode=${encodeURIComponent(oobCode)}`);
  } else if (mode === 'resetPassword') {
    return redirect(`/auth/reset-password?oobCode=${encodeURIComponent(oobCode)}`);
  }

  return redirect('/auth/login');
}