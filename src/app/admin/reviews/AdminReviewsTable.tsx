'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, Trash2, ExternalLink } from 'lucide-react';
import { deleteReview } from '@/lib/actions';

interface ReviewRow {
  id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  product: { title: string; slug: string } | null;
}

export function AdminReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return;
    setDeletingId(id);
    await deleteReview(id);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="bg-white border border-gray-200 rounded overflow-hidden">
      {reviews.length === 0 ? (
        <div className="p-8 text-center text-gray-500 text-sm">No reviews yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Reviewer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Rating</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase hidden md:table-cell">Review</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{r.author_name}</p>
                    {r.is_verified && (
                      <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Verified</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {r.product ? (
                      <Link href={`/product/${r.product.slug}`} target="_blank"
                        className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                        {r.product.title.slice(0, 30)}…
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell max-w-xs">
                    {r.title && <p className="font-semibold text-gray-800 text-xs mb-0.5">{r.title}</p>}
                    <p className="text-gray-500 text-xs line-clamp-2">{r.body}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString('en-PK')}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(r.id)} disabled={deletingId === r.id}
                      className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                      aria-label="Delete review">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
