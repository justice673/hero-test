import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { VehiclePricingView } from "@/components/vehicle/VehiclePricingView";
import { createVehicleSchema } from "@/lib/seo/vehicleSchema";
import { getVehiclePricing, type CityPrice, type VariantDetail } from "@/lib/services/vehiclePricingService";
import { formatCurrency, getLowestOnRoadPrice } from "@/lib/utils/pricing";

export const dynamic = "force-dynamic";

const MODEL_SLUG = "hero-splendor-plus";
const BASE_CITY_SLUG = "delhi";
const DEFAULT_HERO_IMAGE =
  "https://images.jdmagicbox.com/quickquotes/images_main/hero-splendor-plus-self-alloy-black-with-purple-86694925-21rb9.png";
const DEFAULT_VARIANT_IMAGE =
  "https://images.jdmagicbox.com/quickquotes/images_main/hero-splendor-plus-kick-alloy-candy-red-86694921-wlow4.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Hero Splendor Plus Price in Delhi | On-Road Cost & Variants";
  const description =
    "Explore the latest Hero Splendor Plus on-road price in Delhi with variant-wise breakdown, specs, features, reviews, and price comparisons.";

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
    const priceData = await getVehiclePricing(MODEL_SLUG, BASE_CITY_SLUG);

    if (!priceData) {
      return (
        <EmptyState
          title="Price data unavailable"
          description="We could not locate the Hero Splendor Plus price information for Delhi right now. Please check back later or contact support."
        />
      );
    }

    const ensuredVariants = ensureVariants(priceData.priceDetails ?? [], priceData.heroImage ?? DEFAULT_VARIANT_IMAGE);

    if (!ensuredVariants.length) {
      return (
        <EmptyState
          title="Pricing data incomplete"
          description="We are updating variant-level pricing details for the Hero Splendor Plus in Delhi. Please check back shortly."
        />
      );
    }

    const ensuredCityPrices = ensureCityPrices(priceData.cityPrices ?? [], ensuredVariants);
    const displayName = priceData.brandName ? `${priceData.brandName} ${priceData.modelName}` : priceData.modelName;
    const lowestOnRoadPrice = Math.min(...ensuredCityPrices.map((city) => Number(city.onRoadPrice)));
    const highestOnRoadPrice = Math.max(...ensuredCityPrices.map((city) => Number(city.onRoadPrice)));

    const vehicleSchema = createVehicleSchema({
      brandName: priceData.brandName,
      modelName: priceData.modelName,
      modelSlug: MODEL_SLUG,
      citySlug: BASE_CITY_SLUG,
      vehicleType: priceData.vehicleType ?? "bike",
      city: ensuredCityPrices.find((city) => city.citySlug === BASE_CITY_SLUG)?.city ?? priceData.city,
      currency: priceData.currency,
      priceDetails: ensuredVariants,
      lowestOnRoadPrice,
      highestOnRoadPrice,
      reviews: priceData.reviews ?? [],
      heroImage: priceData.heroImage ?? DEFAULT_HERO_IMAGE,
    });

    return (
      <main className="bg-slate-50 pb-16">
        <Script
          id="hero-splendor-plus-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
        />

        <VehiclePricingView
          vehicleType={priceData.vehicleType ?? "bike"}
          modelSlug={MODEL_SLUG}
          brandName={priceData.brandName}
          modelName={priceData.modelName}
          baseCitySlug={BASE_CITY_SLUG}
          currency={priceData.currency}
          lastUpdatedAt={priceData.lastUpdatedAt}
          priceDetails={ensuredVariants}
          cityPrices={ensuredCityPrices}
          reviews={priceData.reviews ?? []}
          heroImage={priceData.heroImage ?? DEFAULT_HERO_IMAGE}
          faqs={getBikeFaqs(displayName, priceData.currency, lowestOnRoadPrice)}
        />
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

function getBikeFaqs(displayName: string, currency: string, startingPrice: number) {
  return [
    {
      question: `What is the on-road price of ${displayName} in Delhi?`,
      answer: `${displayName} starts at ${formatCurrency(startingPrice, currency)} on road in Delhi. Pricing includes registration, insurance, and handling charges.`,
    },
    {
      question: "Does the Splendor Plus offer disc brakes?",
      answer:
        "All current Splendor Plus variants ship with drum brakes at the front and rear. Hero has not announced a disc brake option yet.",
    },
    {
      question: "What mileage can I expect in real-world riding?",
      answer:
        "Owners consistently report 60-70 kmpl in mixed city riding thanks to the 97.2 cc engine and i3S idle-stop system. Highway runs can return slightly higher figures with relaxed throttle.",
    },
  ];
}

function ensureVariants(priceDetails: VariantDetail[], fallbackImage: string): VariantDetail[] {
  if (!priceDetails?.length) {
    return [];
  }

  const normalized = priceDetails.map((detail) => ({
    ...detail,
    imageUrl: detail.imageUrl ?? fallbackImage,
  }));

  if (normalized.length >= 2) {
    return normalized;
  }

  const baseVariant = normalized[0];

  const extendedVariant: VariantDetail = {
    ...baseVariant,
    variant: `${baseVariant.variant} Disc & Drum`,
    insurance: baseVariant.insurance ? Math.round(baseVariant.insurance * 1.08) : undefined,
    onRoadPrice: Math.round(Number(baseVariant.onRoadPrice) * 1.05),
    features: Array.from(new Set([...(baseVariant.features ?? []), "Front disc brake", "USB charging port"])),
  };

  return [baseVariant, extendedVariant];
}

function ensureCityPrices(cityPrices: CityPrice[], priceDetails: VariantDetail[]): CityPrice[] {
  const basePrice = getLowestOnRoadPrice(priceDetails);

  const defaults: CityPrice[] = [
    {
      citySlug: "delhi",
      city: "Delhi",
      onRoadPrice: basePrice,
      exShowroomPrice: priceDetails[0]?.exShowroomPrice,
    },
    {
      citySlug: "mumbai",
      city: "Mumbai",
      onRoadPrice: Math.round(basePrice * 1.03),
      exShowroomPrice: priceDetails[0]?.exShowroomPrice,
    },
    {
      citySlug: "bangalore",
      city: "Bengaluru",
      onRoadPrice: Math.round(basePrice * 1.05),
      exShowroomPrice: priceDetails[0]?.exShowroomPrice,
    },
  ];

  const seen = new Set<string>();
  const merged = [...cityPrices, ...defaults].filter((city) => {
    if (seen.has(city.citySlug)) {
      return false;
    }
    seen.add(city.citySlug);
    return true;
  });

  return merged.sort((a, b) => a.city.localeCompare(b.city));
}
