import { formatCurrency, formatRelativeDate } from "@/lib/utils/pricing";

type HeroIntroProps = {
  brandName?: string;
  modelName: string;
  city: string;
  currency: string;
  lastUpdatedAt: Date;
  lowestOnRoadPrice: number;
  highestOnRoadPrice: number;
  variantCount: number;
};

export function HeroIntro({
  brandName,
  modelName,
  city,
  currency,
  lastUpdatedAt,
  lowestOnRoadPrice,
  highestOnRoadPrice,
  variantCount,
}: HeroIntroProps) {
  const displayName = brandName ? `${brandName} ${modelName}` : modelName;

  return (
    <section className="overflow-hidden rounded-3xl bg-[#1A73E8] text-white shadow-lg">
      <div className="relative isolate px-6 py-12 sm:px-10 sm:py-16">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-white/10 blur-3xl sm:block" aria-hidden="true" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Updated {formatRelativeDate(lastUpdatedAt)}
            </span>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {displayName} price in {city}
            </h1>
            <p className="text-base text-blue-100">
              Compare on-road pricing, key specifications, and standout features for every {modelName} variant sold in {city}.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-blue-900/40 px-6 py-5 text-sm sm:text-base">
            <div className="flex flex-col">
              <span className="text-blue-100">Variants</span>
              <strong className="text-lg font-semibold sm:text-2xl">{variantCount}</strong>
            </div>
            <div className="flex flex-col">
              <span className="text-blue-100">Price range</span>
              <strong className="text-lg font-semibold sm:text-2xl">
                {formatCurrency(lowestOnRoadPrice, currency)} – {formatCurrency(highestOnRoadPrice, currency)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
