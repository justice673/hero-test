import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { CityPriceList } from "@/components/vehicle/CityPriceList";
import { CompareSection } from "@/components/vehicle/CompareSection";
import { FaqAccordion } from "@/components/vehicle/FaqAccordion";
import { HeroIntro } from "@/components/vehicle/HeroIntro";
import { ReviewSection } from "@/components/vehicle/ReviewSection";
import { VariantCard } from "@/components/vehicle/VariantCard";
import { getVehiclePricing } from "@/lib/services/vehiclePricingService";
import { createVehicleSchema } from "@/lib/seo/vehicleSchema";
import { formatCurrency, getHighestOnRoadPrice, getLowestOnRoadPrice } from "@/lib/utils/pricing";

export const dynamic = "force-dynamic";

const MODEL_SLUG = "maruti-alto-k10";
const CITY_SLUG = "delhi";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Maruti Alto K10 Price in Delhi | On-Road Cost, Variants & Features";
  const description =
    "Check Maruti Alto K10 on-road price in Delhi with variant-wise cost breakup, specs, reviews, and city-wise comparison.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://hero-price-check.vercel.app/maruti-alto-k10/price-in-delhi",
      type: "article",
      locale: "en_IN",
    },
    alternates: {
      canonical: "/maruti-alto-k10/price-in-delhi",
    },
  };
}

export default async function MarutiAltoK10PricePage() {
  try {
    const priceData = await getVehiclePricing(MODEL_SLUG, CITY_SLUG);

    if (!priceData) {
      return (
        <EmptyState
          title="Price data unavailable"
          description="We could not locate the Maruti Alto K10 price information for Delhi right now. Please check back later or contact support."
        />
      );
    }

    const {
      brandName,
      modelName,
      vehicleType = "car",
      city,
      currency,
      priceDetails,
      cityPrices,
      reviews,
      lastUpdatedAt,
      heroImage,
    } = priceData;

    if (!priceDetails?.length) {
      return (
        <EmptyState
          title="Pricing data incomplete"
          description="We are updating variant-level pricing details for the Maruti Alto K10 in Delhi. Please check back shortly."
        />
      );
    }

    const lowestOnRoadPrice = getLowestOnRoadPrice(priceDetails);
    const highestOnRoadPrice = getHighestOnRoadPrice(priceDetails);
    const displayName = brandName ? `${brandName} ${modelName}` : modelName;

    const vehicleSchema = createVehicleSchema({
      brandName,
      modelName,
      modelSlug: MODEL_SLUG,
      citySlug: CITY_SLUG,
      vehicleType,
      city,
      currency,
      priceDetails,
      lowestOnRoadPrice,
      highestOnRoadPrice,
      reviews,
      heroImage,
    });

    return (
      <main className="bg-slate-50 pb-16">
        <Script
          id="maruti-alto-k10-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
        />
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

          <CityPriceList cityPrices={cityPrices ?? []} currency={currency} />
          <ReviewSection reviews={reviews ?? []} />
          <CompareSection vehicleType={vehicleType} modelSlug={MODEL_SLUG} displayName={displayName} />
          <FaqAccordion faqs={getCarFaqs(displayName, currency, lowestOnRoadPrice)} />
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

function getCarFaqs(displayName: string, currency: string, startingPrice: number) {
  return [
    {
      question: `What is the on-road price of ${displayName} in Delhi?`,
      answer: `${displayName} starts at ${formatCurrency(startingPrice, currency)} on road in Delhi. The price includes RTO fees, insurance, and standard handling charges.`,
    },
    {
      question: "Is the Alto K10 available with factory CNG?",
      answer:
        "Yes, Maruti offers the Alto K10 with the S-CNG kit paired to the VXi Plus AMT trim, delivering 33.85 km/kg while retaining the AMT convenience.",
    },
    {
      question: "Which safety features are standard?",
      answer:
        "Dual airbags, ABS with EBD, rear parking sensors, speed-sensing door locks, and a high-speed alert system are standard across the Alto K10 range.",
    },
  ];
}
