import type { Metadata } from "next";
import Link from "next/link";

import { getHeroSplendorPlusPriceInDelhi } from "@/lib/services/heroPriceService";
import { HeroIntro } from "./components/HeroIntro";
import { PriceSummaryCard } from "./components/PriceSummaryCard";
import { VariantPricingTable } from "./components/VariantPricingTable";
import { PriceInsightsGrid } from "./components/PriceInsightsGrid";
import { PricingCta } from "./components/PricingCta";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Hero Splendor Plus Price in Delhi | On-Road Cost & Variants";
  const description = "Explore the latest Hero Splendor Plus on-road price in Delhi with variant-wise breakdown, taxes, insurance, and additional cost insights.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://hero-price-check.vercel.app/hero-splendor-plus/price-in-delhi",
      type: "article",
      locale: "en_IN",
    },
    alternates: {
      canonical: "/hero-splendor-plus/price-in-delhi",
    },
  };
}

export default async function HeroSplendorPlusPricePage() {
  try {
    const priceData = await getHeroSplendorPlusPriceInDelhi();

    if (!priceData) {
      return (
        <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Price data unavailable</h1>
          <p className="mt-4 text-base text-slate-500">
            We could not locate the Hero Splendor Plus price information for Delhi right now. Please check back later or contact support.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Go back home
          </Link>
        </main>
      );
    }

    const { city, modelName, priceDetails, currency, lastUpdatedAt, sourceUrl } = priceData;

    if (!priceDetails?.length) {
      return (
        <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-semibold sm:text-4xl">Pricing data incomplete</h1>
          <p className="mt-4 text-base text-slate-500">
            We are updating the variant-level pricing details for the Hero Splendor Plus in Delhi. Please check back shortly.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Go back home
          </Link>
        </main>
      );
    }

    const primaryVariant = priceDetails[0];

    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        {/* Animated background elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] animate-pulse rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -right-1/4 top-1/3 h-[500px] w-[500px] animate-pulse rounded-full bg-blue-600/20 blur-3xl [animation-delay:2s]" />
          <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] animate-pulse rounded-full bg-purple-600/20 blur-3xl [animation-delay:4s]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
          <HeroIntro city={city} modelName={modelName} lastUpdatedAt={lastUpdatedAt} />
          <PriceSummaryCard primaryVariant={primaryVariant} currency={currency} sourceUrl={sourceUrl} />
          <VariantPricingTable priceDetails={priceDetails} currency={currency} />
          <PriceInsightsGrid priceDetails={priceDetails} currency={currency} />
          <PricingCta />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to load price data", error);

    return (
      <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-3xl font-semibold sm:text-4xl">Something went wrong</h1>
        <p className="mt-4 text-base text-slate-500">
          We are unable to load the pricing information right now. Please try again in a few minutes.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Go back home
        </Link>
      </main>
    );
  }
}
