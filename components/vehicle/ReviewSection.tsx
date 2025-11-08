import { Review } from "@/lib/services/vehiclePricingService";

function formatReviewDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

type ReviewSectionProps = {
  reviews: Review[];
};

export function ReviewSection({ reviews }: ReviewSectionProps) {
  if (!reviews?.length) {
    return null;
  }

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold text-slate-900">Rider reviews</h2>
        <p className="text-sm text-slate-500">Honest ownership feedback sourced from community forums and dealership surveys.</p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {reviews.map((review) => (
          <article key={`${review.author}-${review.createdAt.toISOString()}`} className="flex h-full flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900">{review.author}</p>
                <p className="text-xs uppercase tracking-wide text-slate-500">{formatReviewDate(review.createdAt)}</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1A73E8]/10 px-3 py-1 text-sm font-semibold text-[#1A73E8]">
                {review.rating.toFixed(1)}
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
            {review.title ? <h3 className="text-lg font-semibold text-slate-900">{review.title}</h3> : null}
            <p className="text-sm leading-relaxed text-slate-600">{review.comment}</p>
            {review.source ? (
              <p className="text-xs text-slate-500">Source: {review.source}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
