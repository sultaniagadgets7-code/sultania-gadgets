import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getProductReviews, getReviewStats, canUserReviewProduct } from '@/lib/queries';
import { ReviewCard } from './ReviewCard';
import { ReviewsSummary } from './ReviewsSummary';
import { ReviewForm } from './ReviewForm';
import { ShieldCheck, ShoppingBag, LogIn } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
  productSlug: string;
}

export async function ProductReviews({ productId }: ProductReviewsProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [reviews, stats, eligibility] = await Promise.all([
    getProductReviews(productId),
    getReviewStats(productId),
    canUserReviewProduct(productId),
  ]);

  // Get user's name from profile
  let defaultName = '';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    defaultName = profile?.full_name || user.email?.split('@')[0] || '';
  }

  return (
    <section id="reviews" className="scroll-mt-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="heading-lg">
          Customer Reviews
          {stats.total > 0 && (
            <span className="text-gray-400 font-normal text-base ml-2">({stats.total})</span>
          )}
        </h2>
      </div>

      {/* Summary */}
      {stats.total > 0 && (
        <div className="mb-6">
          <ReviewsSummary stats={stats} />
        </div>
      )}

      {/* Reviews list */}
      {reviews.length > 0 ? (
        <div className="space-y-4 mb-10">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-[#f7f7f7] rounded-[20px] p-8 text-center mb-8">
          <p className="text-gray-500 font-semibold">No reviews yet</p>
          <p className="text-sm text-gray-400 mt-1">Be the first to review this product.</p>
        </div>
      )}

      {/* Write a review section */}
      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-base font-bold text-gray-950 mb-5">Write a Review</h3>

        {/* Not logged in */}
        {eligibility.reason === 'not_logged_in' && (
          <div className="bg-[#f7f7f7] rounded-[20px] p-6 flex items-start gap-4">
            <LogIn className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Sign in to leave a review</p>
              <p className="text-sm text-gray-500 mt-1">
                You need to be signed in and have purchased this product to write a review.
              </p>
            </div>
          </div>
        )}

        {/* Logged in but hasn't ordered */}
        {eligibility.reason === 'not_purchased' && (
          <div className="bg-[#f7f7f7] rounded-[20px] p-6 flex items-start gap-4">
            <ShoppingBag className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-gray-900 text-sm">Purchase required</p>
              <p className="text-sm text-gray-500 mt-1">
                Only customers who have purchased and received this product can leave a review.
              </p>
              <Link href="/shop"
                className="inline-block mt-3 text-xs font-bold uppercase tracking-widest text-[#0a0a0a] underline underline-offset-4 hover:text-[#e01e1e] transition-colors">
                Browse Products
              </Link>
            </div>
          </div>
        )}

        {/* Already reviewed */}
        {eligibility.reason === 'already_reviewed' && (
          <div className="bg-green-50 rounded-[20px] p-6 flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-green-800 text-sm">You&apos;ve already reviewed this product</p>
              <p className="text-sm text-green-700 mt-1">Thank you for your feedback!</p>
            </div>
          </div>
        )}

        {/* Eligible — show form */}
        {eligibility.reason === 'eligible' && (
          <ReviewForm
            productId={productId}
            defaultName={defaultName}
            isLoggedIn={true}
          />
        )}
      </div>
    </section>
  );
}
