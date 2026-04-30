import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminDebugPage() {
  // Test 1: Auth
  let userEmail = 'Not logged in';
  let userId = '';
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    userEmail = user?.email ?? 'No email';
    userId = user?.id ?? '';
  } catch (e: unknown) {
    userEmail = 'Auth error: ' + (e instanceof Error ? e.message : String(e));
  }

  // Test 2: Env vars
  const envVars = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? (process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith('eyJ')
        ? '✅ Valid JWT'
        : `❌ Wrong format: starts with "${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 15)}..."`)
      : '❌ Missing',
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? '❌ Missing',
  };

  // Test 3: Admin client
  let adminClientStatus = '';
  let ordersCount = '';
  try {
    const supabase = createAdminClient();
    adminClientStatus = '✅ Created successfully';
    const { data, error } = await supabase.from('orders').select('id').limit(1);
    if (error) {
      ordersCount = '❌ Query error: ' + error.message;
    } else {
      ordersCount = `✅ Can query orders (got ${data?.length ?? 0} rows)`;
    }
  } catch (e: unknown) {
    adminClientStatus = '❌ Error: ' + (e instanceof Error ? e.message : String(e));
    ordersCount = 'N/A';
  }

  // Test 4: Products count
  let productsCount = '';
  try {
    const supabase = createAdminClient();
    const { count, error } = await supabase.from('products').select('id', { count: 'exact', head: true });
    if (error) productsCount = '❌ ' + error.message;
    else productsCount = `✅ ${count} products`;
  } catch (e: unknown) {
    productsCount = '❌ ' + (e instanceof Error ? e.message : String(e));
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold mb-6">Admin Debug Info</h1>

      <section className="mb-6">
        <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-3">Auth Status</h2>
        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm font-mono">
          <p>Email: <span className="font-bold">{userEmail}</span></p>
          <p>User ID: <span className="font-bold">{userId || 'N/A'}</span></p>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-3">Environment Variables</h2>
        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm font-mono">
          {Object.entries(envVars).map(([key, val]) => (
            <p key={key}>{key}: <span className="font-bold">{val}</span></p>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-3">Database Access</h2>
        <div className="bg-gray-50 rounded-xl p-4 space-y-1 text-sm font-mono">
          <p>Admin Client: <span className="font-bold">{adminClientStatus}</span></p>
          <p>Orders Query: <span className="font-bold">{ordersCount}</span></p>
          <p>Products Query: <span className="font-bold">{productsCount}</span></p>
        </div>
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
        <p className="font-bold text-blue-800 mb-1">Next Steps:</p>
        <p className="text-blue-700">
          If SERVICE_KEY shows wrong format, go to:<br />
          <a href="https://supabase.com/dashboard/project/tblvxsfmcqbltifoqrnx/settings/api"
            className="underline" target="_blank">
            Supabase → Project Settings → API
          </a><br />
          Copy the <strong>service_role</strong> key (starts with eyJ...) and add it to Vercel env vars.
        </p>
      </div>
    </div>
  );
}
