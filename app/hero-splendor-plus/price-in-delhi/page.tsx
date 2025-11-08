import type { Metadata } from "next";
import Link from "next/link";

import { getHeroSplendorPlusPriceInDelhi } from "@/lib/services/heroPriceService";
import { getHighestOnRoadPrice, getLowestOnRoadPrice } from "@/lib/utils/pricing";
import { HeroIntro } from "./components/HeroIntro";
import { VariantCard } from "./components/VariantCard";
import { CompareSection } from "./components/CompareSection";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Hero Splendor Plus Price in Delhi | On-Road Cost & Variants";
  const description = "Explore the latest Hero Splendor Plus on-road price in Delhi with variant-wise breakdown, specs, features, and price comparisons.";

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
        <EmptyState
          title="Price data unavailable"
          description="We could not locate the Hero Splendor Plus price information for Delhi right now. Please check back later or contact support."
        />
      );
    }

    const { brandName, city, modelName, priceDetails, currency, lastUpdatedAt } = priceData;

    if (!priceDetails?.length) {
      return (
        <EmptyState
          title="Pricing data incomplete"
          description="We are updating the variant-level pricing details for the Hero Splendor Plus in Delhi. Please check back shortly."
        />
      );
    }

    const lowestOnRoadPrice = getLowestOnRoadPrice(priceDetails);
    const highestOnRoadPrice = getHighestOnRoadPrice(priceDetails);

    return (
      <main className="bg-slate-50 pb-16">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
          <HeroIntro
            brandName={brandName}
            modelName={modelName}
            city={city}
            currency={currency}
            lastUpdatedAt={lastUpdatedAt}
            lowestOnRoadPrice={lowestOnRoadPrice}
            highestOnRoadPrice={highestOnRoadPrice}
            variantCount={priceDetails.length}
          />

          <section className="mt-12 space-y-8">
            {priceDetails.map((detail) => (
              <VariantCard
                key={detail.variant}
                brandName={brandName}
                modelName={modelName}
                currency={currency}
                detail={detail}
              />
            ))}
          </section>

          <CompareSection />
        </div>
      </main>
    );
  } catch (error) {
    console.error("Failed to load price data", error);

    return (
      <EmptyState
        title="Something went wrong"
        description="We are unable to load the pricing information right now. Please try again in a few minutes."
      />
    );
  }
}

type EmptyStateProps = {
  title: string;
  description: string;
};

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base text-slate-500">{description}</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-full bg-[#1A73E8] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#155cc0]"
      >
        Go back home
      </Link>
    </main>
  );
}
