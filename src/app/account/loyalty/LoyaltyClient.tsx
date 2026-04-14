'use client';
import { useState } from 'react';
import { Star, Gift, TrendingUp, Info } from 'lucide-react';

interface LoyaltyPoints {
  points: number;
  total_earned: number;
  total_redeemed: number;
}

interface LoyaltyTransaction {
  id: string;
  order_id: string | null;
  points: number;
  type: 'earned' | 'redeemed' | 'bonus';
  description: string | null;
  created_at: string;
}

const TYPE_COLORS = {
  earned: 'text-green-600 bg-green-50',
  redeemed: 'text-red-600 bg-red-50',
  bonus: 'text-blue-600 bg-blue-50',
};

export function LoyaltyClient({
  points,
  transactions,
}: {
  points: LoyaltyPoints | null;
  transactions: LoyaltyTransaction[];
}) {
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const currentPoints = points?.points ?? 0;
  const totalEarned = points?.total_earned ?? 0;
  const totalRedeemed = points?.total_redeemed ?? 0;
  const discountValue = Math.floor(currentPoints / 100) * 100; // Rs. 100 per 100 points

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <Star className="w-6 h-6 text-[#e01e1e]" />
        Loyalty Points
      </h1>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-[#e01e1e] to-red-700 rounded-3xl p-6 text-white">
        <p className="text-sm font-medium opacity-80 mb-1">Current Balance</p>
        <p className="text-5xl font-black mb-1">{currentPoints}</p>
        <p className="text-sm opacity-80">points</p>
        {currentPoints >= 100 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm">Worth <span className="font-bold">Rs. {discountValue}</span> discount</p>
            <button
              onClick={() => setShowRedeemModal(true)}
              className="bg-white text-[#e01e1e] text-xs font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              Redeem
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Earned</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalEarned}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-4 h-4 text-purple-500" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Redeemed</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalRedeemed}</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-blue-900 text-sm">How It Works</h2>
        </div>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            Earn <strong>1 point</strong> for every Rs. 100 spent
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            <strong>100 points = Rs. 100</strong> discount on your next order
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            Points are awarded after order delivery
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-0.5">•</span>
            Contact us on WhatsApp to apply points to your order
          </li>
        </ul>
      </div>

      {/* Transaction history */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Points History</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="p-6 text-center text-gray-400 text-sm">No transactions yet. Place an order to start earning!</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description || tx.type}</p>
                  <p className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleDateString('en-PK')}</p>
                </div>
                <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[tx.type]}`}>
                  {tx.type === 'redeemed' ? '-' : '+'}{tx.points} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Redeem modal */}
      {showRedeemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Redeem Points</h3>
            <p className="text-sm text-gray-600">
              You have <strong>{currentPoints} points</strong> worth <strong>Rs. {discountValue}</strong> discount.
            </p>
            <p className="text-sm text-gray-500">
              To apply your points to an order, contact us on WhatsApp and mention your points balance.
            </p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567'}?text=${encodeURIComponent(`Assalamualaikum! I want to redeem my ${currentPoints} loyalty points (worth Rs. ${discountValue}) on my next order.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-500 hover:bg-green-600 text-white text-center font-bold py-3 rounded-full transition-colors text-sm"
            >
              Contact on WhatsApp
            </a>
            <button
              onClick={() => setShowRedeemModal(false)}
              className="block w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
