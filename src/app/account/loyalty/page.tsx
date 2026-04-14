import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Star, TrendingUp, Gift } from 'lucide-react';

export const metadata: Metadata = { title: 'Loyalty Points' };

export default async function LoyaltyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');

  const [{ data: points }, { data: transactions }] = await Promise.all([
    supabase.from('loyalty_points').select('*').eq('user_id', user.id).single(),
    supabase.from('loyalty_transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
  ]);

  const balance = points?.points ?? 0;
  const totalEarned = points?.total_earned ?? 0;
  const totalRedeemed = points?.total_redeemed ?? 0;
  const rupeeValue = Math.floor(balance / 100) * 100; // 100 points = Rs. 100

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Loyalty Points</p>

      {/* Balance card */}
      <div className="bg-[#0a0a0a] rounded-[20px] p-6 text-white mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your Balance</p>
        </div>
        <p className="text-4xl font-black tracking-tight">{balance} <span className="text-xl text-gray-400">pts</span></p>
        {rupeeValue > 0 && (
          <p className="text-sm text-gray-400 mt-1">Worth <span className="text-white font-bold">Rs. {rupeeValue}</span> off your next order</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#f7f7f7] rounded-[20px] p-4">
          <TrendingUp className="w-4 h-4 text-green-600 mb-2" aria-hidden="true" />
          <p className="text-lg font-bold text-gray-950">{totalEarned}</p>
          <p className="text-xs text-gray-500">Total Earned</p>
        </div>
        <div className="bg-[#f7f7f7] rounded-[20px] p-4">
          <Gift className="w-4 h-4 text-purple-600 mb-2" aria-hidden="true" />
          <p className="text-lg font-bold text-gray-950">{totalRedeemed}</p>
          <p className="text-xs text-gray-500">Total Redeemed</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-4 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">How it works</p>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>• Earn <strong>1 point</strong> for every Rs. 100 spent</li>
          <li>• <strong>100 points = Rs. 100</strong> discount on your next order</li>
          <li>• Points are awarded after order delivery</li>
        </ul>
      </div>

      {/* Transaction history */}
      {transactions && transactions.length > 0 ? (
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">History</p>
          <div className="space-y-2">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between bg-[#f7f7f7] rounded-2xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.description}</p>
                  <p className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString('en-PK')}</p>
                </div>
                <span className={`text-sm font-bold ${t.type === 'earned' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'earned' ? '+' : '−'}{Math.abs(t.points)} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-8">No transactions yet. Place an order to start earning points!</p>
      )}
    </div>
  );
}
