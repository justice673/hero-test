import { PriceBreakdown } from "@/lib/services/heroPriceService";
import { formatCurrency } from "@/lib/utils/pricing";

type PriceSummaryCardProps = {
  primaryVariant: PriceBreakdown;
  currency: string;
  sourceUrl?: string;
};

export function PriceSummaryCard({ primaryVariant, currency, sourceUrl }: PriceSummaryCardProps) {
  return (
    <section className="mb-16">
      <div className="group relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-blue-500/10 p-1 backdrop-blur-xl transition-all duration-500 hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/25">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-4px)] bg-slate-900/90 p-8 md:p-12">
          <div className="absolute right-0 top-0 h-72 w-72 bg-gradient-to-br from-indigo-500/30 to-transparent blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 font-accent text-2xl text-indigo-200 tracking-wide">Starting Price</p>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
                  {formatCurrency(primaryVariant.onRoadPrice, currency)}
                </span>
                <span className="text-2xl text-slate-400">onwards</span>
              </div>
              <p className="mb-6 text-slate-400">{primaryVariant.variant}</p>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs text-slate-400">Ex-Showroom</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(primaryVariant.exShowroomPrice, currency)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs text-slate-400">Insurance</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(primaryVariant.insurance, currency)}
                  </p>
                </div>
                <div className="rounded-xl bg-white/5 px-4 py-3 backdrop-blur-sm">
                  <p className="text-xs text-slate-400">RTO Tax</p>
                  <p className="text-lg font-semibold text-white">
                    {formatCurrency(primaryVariant.roadTax, currency)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                    <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-accent text-xl text-emerald-300">Best Price Guaranteed</p>
                    <p className="text-xs text-slate-400">Verified dealership rates</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300">
                  Price includes registration, road tax, insurance (1 year), and standard accessories. Extended warranty available.
                </p>
              </div>

              {sourceUrl ? (
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <span className="text-sm font-medium text-white">View Official Source</span>
                  <svg className="h-5 w-5 text-slate-400 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
