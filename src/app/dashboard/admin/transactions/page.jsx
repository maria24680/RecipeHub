import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import TransactionsClient from './TransactionsClient';

export default async function AdminTransactionsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user || session.user.role !== 'admin') {
    return <div className="p-6 text-center text-red-500">Access denied. Admins only.</div>;
  }

  return <TransactionsClient user={session.user} />;
}