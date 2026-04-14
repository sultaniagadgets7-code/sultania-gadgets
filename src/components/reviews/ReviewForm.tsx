'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { StarRating } from './StarRating';
import { submitReview } from '@/lib/actions';

interface ReviewFormProps {
  productId: string;
  defaultName?: string;
  isLoggedIn?: boolean;
}

export function ReviewForm({ productId, defaultName = '', isLoggedIn = false }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState(defaultName);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const inp = 'w-full bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] transition';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { setMsg('Please select a rating.'); setState('error'); return; }
    if (!body.trim()) { setMsg('Please write a review.'); setState('error'); return; }
    if (!isLoggedIn && !name.trim()) { setMsg('Please enter your name.'); setState('error'); return; }

    setState('loading');
    const result = await submitReview({
      product_id: productId,
      author_name: name.trim() || 'Anonymous',
      rating,
      title: title.trim() || undefined,
      body: body.trim(),
    });

    if (result.success) {
      setState('success');
      setMsg('Review submitted! Thank you.');
      setRating(0); setTitle(''); setBody('');
      router.refresh();
    } else {
      setState('error');
      setMsg(result.error || 'Failed to submit review.');
    }
  }

  if (state === 'success') return (
    <div className="flex items-center gap-3 bg-green-50 rounded-2xl p-4 text-sm text-green-700">
      <CheckCircle className="w-5 h-5 shrink-0" />
      <span className="font-semibold">{msg}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Rating picker */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Your Rating *</p>
        <StarRating value={rating} onChange={setRating} size="lg" />
      </div>

      {/* Name — only if not logged in */}
      {!isLoggedIn && (
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="Your name *" className={inp} autoComplete="name" />
      )}

      <input value={title} onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title (optional)" className={inp} />

      <textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)}
        placeholder="Share your experience with this product *"
        className={`${inp} resize-none`} required />

      {state === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {msg}
        </div>
      )}

      <button type="submit" disabled={state === 'loading'}
        className="bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition-colors disabled:opacity-50 flex items-center gap-2">
        {state === 'loading' && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {state === 'loading' ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
