import Link from "next/link";

import { getVehiclePricing } from "@/lib/services/vehiclePricingService";
import { formatCurrency } from "@/lib/utils/pricing";

const LEFT_MODEL = { modelSlug: "hero-splendor-plus", citySlug: "delhi" };
const RIGHT_MODEL = { modelSlug: "maruti-alto-k10", citySlug: "delhi" };

export const dynamic = "force-dynamic";

export default async function CompareHeroSplendorVsAltoK10Page() {
  const [left, right] = await Promise.all([
    getVehiclePricing(LEFT_MODEL.modelSlug, LEFT_MODEL.citySlug),
    getVehiclePricing(RIGHT_MODEL.modelSlug, RIGHT_MODEL.citySlug),
  ]);

  if (!left || !right) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">Comparison unavailable</h1>
        <p className="mt-4 text-base text-slate-500">
          We need pricing data for both models to run this comparison. Please check back soon.
        </p>
      </main>
    );
  }

  const leftDisplay = getDisplayName(left);
  const rightDisplay = getDisplayName(right);

  const leftPrimary = left.priceDetails[0];
  const rightPrimary = right.priceDetails[0];

  return (
    <main className="bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
        <header className="flex flex-col gap-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            {leftDisplay} vs {rightDisplay}
          </h1>
          <p className="text-base text-slate-500">
            Quick comparison of pricing, specs, and ownership highlights to help you choose between a commuter bike and a budget-friendly car.
          </p>
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <CompareCard
            title={leftDisplay}
            vehicleType={left.vehicleType ?? "bike"}
            city={left.city}
            currency={left.currency}
            lowestPrice={getLowestOnRoadPriceSafe(left)}
            highestPrice={getHighestOnRoadPriceSafe(left)}
            primaryVariant={leftPrimary?.variant}
            directLink={`/${LEFT_MODEL.modelSlug}/price-in-${LEFT_MODEL.citySlug}`}
          />
          <CompareCard
            title={rightDisplay}
            vehicleType={right.vehicleType ?? "car"}
            city={right.city}
            currency={right.currency}
            lowestPrice={getLowestOnRoadPriceSafe(right)}
            highestPrice={getHighestOnRoadPriceSafe(right)}
            primaryVariant={rightPrimary?.variant}
            directLink={`/${RIGHT_MODEL.modelSlug}/price-in-${RIGHT_MODEL.citySlug}`}
          />
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Spec comparison</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <SpecGrid title={leftDisplay} variant={leftPrimary} />
            <SpecGrid title={rightDisplay} variant={rightPrimary} />
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">City on-road prices</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <CityPriceTable title={leftDisplay} currency={left.currency} cityPrices={left.cityPrices ?? []} />
            <CityPriceTable title={rightDisplay} currency={right.currency} cityPrices={right.cityPrices ?? []} />
          </div>
        </section>
      </div>
    </main>
  );
}

type CompareCardProps = {
  title: string;
  vehicleType: "bike" | "car";
  city: string;
  currency: string;
  lowestPrice: number;
  highestPrice: number;
  primaryVariant?: string;
  directLink: string;
};

function CompareCard({ title, vehicleType, city, currency, lowestPrice, highestPrice, primaryVariant, directLink }: CompareCardProps) {
  return (
    <article className="flex h-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8]/10 px-3 py-1 text-sm font-medium text-[#1A73E8]">
          {vehicleType === "car" ? "Car" : "Bike"}
        </span>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500">On-road prices for {city}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">Price range</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">
          {formatCurrency(lowestPrice, currency)} – {formatCurrency(highestPrice, currency)}
        </p>
      </div>
      {primaryVariant ? (
        <p className="text-sm text-slate-500">Popular variant: {primaryVariant}</p>
      ) : null}
      <Link
        href={directLink}
        className="mt-auto inline-flex items-center justify-center rounded-full bg-[#1A73E8] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#155cc0]"
      >
        View detailed pricing
      </Link>
    </article>
  );
}

type SpecGridProps = {
  title: string;
  variant?: { power?: string; torque?: string; mileage?: string; fuelType?: string; transmission?: string };
};

function SpecGrid({ title, variant }: SpecGridProps) {
  const rows = [
    { label: "Power", value: variant?.power },
    { label: "Torque", value: variant?.torque },
    { label: "Mileage", value: variant?.mileage },
    { label: "Fuel type", value: variant?.fuelType },
    { label: "Transmission", value: variant?.transmission },
  ].filter((row) => row.value);

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50">
      <div className="border-b border-slate-100 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <dl className="divide-y divide-slate-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-6 py-3 text-sm">
            <dt className="text-slate-500">{row.label}</dt>
            <dd className="font-medium text-slate-900">{row.value}</dd>
          </div>
        ))}
        {rows.length === 0 ? (
          <div className="px-6 py-4 text-sm text-slate-500">Specifications coming soon.</div>
        ) : null}
      </dl>
    </div>
  );
}

type CityPriceTableProps = {
  title: string;
  currency: string;
  cityPrices: { citySlug: string; city: string; onRoadPrice: number; exShowroomPrice?: number }[];
};

function CityPriceTable({ title, currency, cityPrices }: CityPriceTableProps) {
  if (!cityPrices.length) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 px-6 py-5 text-sm text-slate-500">
        City price data is being added soon.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      </div>
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-3">City</th>
            <th className="px-5 py-3">On-road price</th>
          </tr>
        </thead>
        <tbody>
          {cityPrices.slice(0, 3).map((cityPrice) => (
            <tr key={cityPrice.citySlug} className="border-t border-slate-100">
              <td className="px-5 py-3 font-medium text-slate-900">{cityPrice.city}</td>
              <td className="px-5 py-3 font-semibold text-[#1A73E8]">
                {formatCurrency(cityPrice.onRoadPrice, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getDisplayName(vehicle: NonNullable<Awaited<ReturnType<typeof getVehiclePricing>>>) {
  return vehicle.brandName ? `${vehicle.brandName} ${vehicle.modelName}` : vehicle.modelName;
}

function getLowestOnRoadPriceSafe(vehicle: NonNullable<Awaited<ReturnType<typeof getVehiclePricing>>>) {
  return Math.min(...vehicle.priceDetails.map((detail) => Number(detail.onRoadPrice)));
}

function getHighestOnRoadPriceSafe(vehicle: NonNullable<Awaited<ReturnType<typeof getVehiclePricing>>>) {
  return Math.max(...vehicle.priceDetails.map((detail) => Number(detail.onRoadPrice)));
}
