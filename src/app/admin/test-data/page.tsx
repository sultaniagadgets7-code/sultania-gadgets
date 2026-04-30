import { createAdminClient } from '@/lib/supabase/admin';

export default async function TestDataPage() {
  const admin = createAdminClient();
  
  // Test 1: Fetch orders
  const { data: orders, error: ordersError } = await admin
    .from('orders')
    .select('id, customer_name, status, created_at')
    .limit(5);

  // Test 2: Fetch order_items
  const { data: orderItems, error: itemsError } = await admin
    .from('order_items')
    .select('id, order_id, product_title_snapshot, quantity')
    .limit(5);

  // Test 3: Fetch products
  const { data: products, error: productsError } = await admin
    .from('products')
    .select('id, title, price, is_active')
    .limit(5);

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Admin Data Test</h1>

      {/* Orders Test */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-bold mb-2">Orders Test</h2>
        {ordersError ? (
          <div className="text-red-600">
            <p className="font-semibold">Error:</p>
            <pre className="text-xs">{JSON.stringify(ordersError, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p className="text-green-600 font-semibold">✓ Success - {orders?.length || 0} orders found</p>
            <pre className="text-xs mt-2 bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(orders, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Order Items Test */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-bold mb-2">Order Items Test</h2>
        {itemsError ? (
          <div className="text-red-600">
            <p className="font-semibold">Error:</p>
            <pre className="text-xs">{JSON.stringify(itemsError, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p className="text-green-600 font-semibold">✓ Success - {orderItems?.length || 0} items found</p>
            <pre className="text-xs mt-2 bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(orderItems, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Products Test */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-bold mb-2">Products Test</h2>
        {productsError ? (
          <div className="text-red-600">
            <p className="font-semibold">Error:</p>
            <pre className="text-xs">{JSON.stringify(productsError, null, 2)}</pre>
          </div>
        ) : (
          <div>
            <p className="text-green-600 font-semibold">✓ Success - {products?.length || 0} products found</p>
            <pre className="text-xs mt-2 bg-gray-50 p-2 rounded overflow-auto">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Environment Check */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-bold mb-2">Environment Variables</h2>
        <div className="text-xs space-y-1">
          <p>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
          <p>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</p>
          <p>SUPABASE_SERVICE_ROLE_KEY: {process.env.SUPABASE_SERVICE_ROLE_KEY ? '✓ Set' : '✗ Missing'}</p>
        </div>
      </div>
    </div>
  );
}
