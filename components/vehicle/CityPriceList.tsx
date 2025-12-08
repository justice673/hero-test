import { CityPrice } from "@/lib/services/vehiclePricingService";
import { formatCurrency } from "@/lib/utils/pricing";

type CityPriceListProps = {
  cityPrices: CityPrice[];
  currency: string;
  activeCitySlug?: string;
  onCityChange?: (citySlug: string) => void;
};

export function CityPriceList({ cityPrices, currency, activeCitySlug, onCityChange }: CityPriceListProps) {
  if (!cityPrices?.length) {
    return null;
  }

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">City-wise on-road prices</h2>
          <span className="text-sm text-slate-500">Updated daily with dealership quotes</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-100">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Ex-showroom</th>
                <th className="px-5 py-3">On-road</th>
              </tr>
            </thead>
            <tbody>
              {cityPrices.map((cityPrice) => {
                const isActive = cityPrice.citySlug === activeCitySlug;
                return (
                  <tr
                    key={cityPrice.citySlug}
                    className={`border-t border-slate-100 transition ${
                      isActive ? "bg-[#1A73E8]/5" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      <button
                        type="button"
                        onClick={() => onCityChange?.(cityPrice.citySlug)}
                        className="w-full text-left"
                      >
                        {cityPrice.city}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {cityPrice.exShowroomPrice !== undefined
                        ? formatCurrency(cityPrice.exShowroomPrice, currency)
                        : "-"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#1A73E8]">
                      {formatCurrency(cityPrice.onRoadPrice, currency)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
