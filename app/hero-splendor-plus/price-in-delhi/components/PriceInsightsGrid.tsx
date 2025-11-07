import { PriceBreakdown } from "@/lib/services/heroPriceService";
import {
  formatCurrency,
  getAverageInsurance,
  getHighestOnRoadPrice,
  getLowestOnRoadPrice,
} from "@/lib/utils/pricing";

type PriceInsightsGridProps = {
  priceDetails: PriceBreakdown[];
  currency: string;
};

export function PriceInsightsGrid({ priceDetails, currency }: PriceInsightsGridProps) {
  return (
    <section className="mb-16">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">Price Insights</h2>
        <p className="text-slate-400">Key statistics to help you make an informed decision</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="group overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent p-6 backdrop-blur-sm transition-all hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/20">
            <svg className="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="mb-2 text-sm text-blue-400">Lowest On-Road Price</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(getLowestOnRoadPrice(priceDetails), currency)}</p>
          <p className="mt-2 text-xs text-slate-400">Most affordable variant to get on the road</p>
        </div>

        <div className="group overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent p-6 backdrop-blur-sm transition-all hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20">
            <svg className="h-7 w-7 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <p className="mb-2 text-sm text-purple-400">Highest On-Road Price</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(getHighestOnRoadPrice(priceDetails), currency)}</p>
          <p className="mt-2 text-xs text-slate-400">Premium variant with advanced features</p>
        </div>

        <div className="group overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 to-transparent p-6 backdrop-blur-sm transition-all hover:border-indigo-400/50 hover:shadow-lg hover:shadow-indigo-500/20">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20">
            <svg className="h-7 w-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="mb-2 text-sm text-indigo-400">Average Insurance Cost</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(getAverageInsurance(priceDetails), currency)}</p>
          <p className="mt-2 text-xs text-slate-400">Typical first-year insurance premium</p>
        </div>
      </div>
    </section>
  );
}
