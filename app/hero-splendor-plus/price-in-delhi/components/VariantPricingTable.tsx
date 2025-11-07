import { PriceBreakdown } from "@/lib/services/heroPriceService";
import { formatCurrency } from "@/lib/utils/pricing";

type VariantPricingTableProps = {
  priceDetails: PriceBreakdown[];
  currency: string;
};

export function VariantPricingTable({ priceDetails, currency }: VariantPricingTableProps) {
  return (
    <section className="mb-16">
      <div className="mb-8 text-center">
        <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">All Variants</h2>
        <p className="text-slate-400">Choose the perfect variant for your needs</p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-indigo-400">Variant</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-indigo-400">Ex-Showroom</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-indigo-400">Insurance</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-indigo-400">RTO Tax</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-indigo-400">On-Road Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {priceDetails.map((detail, index) => (
                <tr key={detail.variant} className="group transition-all hover:bg-white/5">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-sm font-bold text-indigo-400">
                        {index + 1}
                      </div>
                      <span className="font-medium text-white">{detail.variant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right text-slate-300">
                    {formatCurrency(detail.exShowroomPrice, currency)}
                  </td>
                  <td className="px-6 py-5 text-right text-slate-300">
                    {formatCurrency(detail.insurance, currency)}
                  </td>
                  <td className="px-6 py-5 text-right text-slate-300">
                    {formatCurrency(detail.roadTax, currency)}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-4 py-2 font-semibold text-white">
                      {formatCurrency(detail.onRoadPrice, currency)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
