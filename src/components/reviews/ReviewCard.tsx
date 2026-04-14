import { ShieldCheck } from 'lucide-react';
import { StarDisplay } from './StarRating';
import type { Review } from '@/types';

export function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="bg-white border border-gray-100 rounded-[20px] p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 bg-[#0a0a0a] rounded-full flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold uppercase">
              {review.author_name[0]}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-gray-950">{review.author_name}</p>
              {review.is_verified && (
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <StarDisplay rating={review.rating} size="sm" />
      </div>

      {/* Content */}
      {review.title && (
        <p className="text-sm font-semibold text-gray-900">{review.title}</p>
      )}
      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
    </div>
  );
}
