import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { StockTable } from './StockTable';

export const metadata: Metadata = { title: 'Low Stock' };

export default async function AdminStockPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('id, title, sku, stock_quantity, category:categories(name)')
    .eq('is_active', true)
    .lte('stock_quantity', 5)
    .order('stock_quantity', { ascending: true });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Low Stock Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">
          {(data ?? []).length} active product{(data ?? []).length !== 1 ? 's' : ''} with 5 or fewer units
        </p>
      </div>
      <StockTable products={data ?? []} />
    </div>
  );
}
