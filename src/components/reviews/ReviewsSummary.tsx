import { StarDisplay } from './StarRating';
import type { ReviewStats } from '@/types';

export function ReviewsSummary({ stats }: { stats: ReviewStats }) {
  if (stats.total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-6 bg-[#f7f7f7] rounded-[20px] p-5">
      {/* Big number */}
      <div className="flex flex-col items-center justify-center sm:border-r border-gray-200 sm:pr-6 shrink-0">
        <p className="text-5xl font-black text-gray-950 tracking-tight">{stats.average}</p>
        <StarDisplay rating={stats.average} size="md" />
        <p className="text-xs text-gray-400 mt-1">{stats.total} review{stats.total !== 1 ? 's' : ''}</p>
      </div>

      {/* Breakdown bars */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = stats.breakdown[star] || 0;
          const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 w-4 shrink-0">{star}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <span className="text-xs text-gray-400 w-6 text-right shrink-0">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
