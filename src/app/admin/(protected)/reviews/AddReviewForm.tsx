'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  products: { id: string; title: string }[];
}

export function AddReviewForm({ products }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [rating, setRating] = useState(5);
  const [hovered, setHovered] = useState(0);

  const [form, setForm] = useState({
    product_id: '',
    author_name: '',
    title: '',
    body: '',
  });

  const inp = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.product_id || !form.author_name || !form.body) {
      setMsg({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }
    setLoading(true);
    setMsg(null);

    const supabase = createClient();
    const { error } = await supabase.from('reviews').insert({
      product_id: form.product_id,
      author_name: form.author_name,
      title: form.title || null,
      body: form.body,
      rating,
      user_id: null, // admin fake review — no user attached
      is_verified: false,
      is_approved: true,
    });

    if (error) {
      setMsg({ type: 'error', text: error.message });
    } else {
      setMsg({ type: 'success', text: 'Review added.' });
      setForm({ product_id: '', author_name: '', title: '', body: '' });
      setRating(5);
      router.refresh();
      setTimeout(() => { setOpen(false); setMsg(null); }, 1500);
    }
    setLoading(false);
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)}
        className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors">
        + Add Review
      </button>

      {open && (
        <div className="mt-4 bg-white border border-gray-200 rounded-[20px] p-5 max-w-lg">
          <p className="font-bold text-sm text-gray-900 mb-4">Add Review (Admin)</p>

          {msg && (
            <div className={`flex items-center gap-2 text-sm rounded-xl p-3 mb-4 ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {msg.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })}
              className={inp} required>
              <option value="">Select product *</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>

            <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })}
              placeholder="Customer name *" className={inp} required />

            {/* Star picker */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">Rating *</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHovered(s)}
                    onMouseLeave={() => setHovered(0)}
                    aria-label={`${s} stars`}>
                    <Star className={`w-6 h-6 transition-colors ${s <= (hovered || rating) ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                  </button>
                ))}
              </div>
            </div>

            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Review title (optional)" className={inp} />

            <textarea rows={3} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Review text *" className={`${inp} resize-none`} required />

            <div className="flex gap-2">
              <button type="submit" disabled={loading}
                className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Review'}
              </button>
              <button type="button" onClick={() => setOpen(false)}
                className="text-xs font-semibold text-gray-400 hover:text-gray-700 px-3 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
