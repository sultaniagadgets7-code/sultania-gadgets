import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { StockTable } from './StockTable';

export const metadata: Metadata = { title: 'Low Stock' };

export default async function AdminStockPage() {
  let products: any[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('products')
      .select('id, title, sku, stock_quantity, category:categories(name)')
      .eq('is_active', true)
      .lte('stock_quantity', 5)
      .order('stock_quantity', { ascending: true });
    products = (data ?? []).map((p: any) => ({
      ...p,
      category: Array.isArray(p.category) ? p.category[0] : p.category,
    }));
  } catch (err) {
    console.error('AdminStockPage error:', err);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Low Stock Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">
          {products.length} active product{products.length !== 1 ? 's' : ''} with 5 or fewer units
        </p>
      </div>
      <StockTable products={products} />
    </div>
  );
}
