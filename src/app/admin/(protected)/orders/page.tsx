import type { Metadata } from 'next';
import { getAdminOrders } from '@/lib/queries';
import { OrdersTable } from './OrdersTable';

export const metadata: Metadata = { title: 'Orders' };

interface OrdersPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const orders = await getAdminOrders(params.status);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        <span className="text-sm text-gray-500">{orders.length} total</span>
      </div>
      <OrdersTable orders={orders} initialStatus={params.status || 'all'} />
    </div>
  );
}
