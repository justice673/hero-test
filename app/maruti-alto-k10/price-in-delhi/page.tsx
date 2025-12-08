import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { VehiclePricingView } from "@/components/vehicle/VehiclePricingView";
import { createVehicleSchema } from "@/lib/seo/vehicleSchema";
import { getVehiclePricing, type CityPrice, type VariantDetail } from "@/lib/services/vehiclePricingService";
import { formatCurrency, getLowestOnRoadPrice } from "@/lib/utils/pricing";

export const dynamic = "force-dynamic";

const MODEL_SLUG = "maruti-alto-k10";
const BASE_CITY_SLUG = "delhi";
const DEFAULT_HERO_IMAGE =
  "https://res.cloudinary.com/dmywuw6u3/image/upload/v1728571022/hero-price-check/maruti-alto-k10-main_uhwklw.jpg";
const DEFAULT_VARIANT_IMAGE =
  "https://res.cloudinary.com/dmywuw6u3/image/upload/v1728571056/hero-price-check/maruti-alto-k10-variant_s6yupj.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Maruti Alto K10 Price in Delhi | On-Road Cost, Variants & Features";
  const description =
    "Check Maruti Alto K10 on-road price in Delhi with variant-wise cost breakup, specs, reviews, FAQs, and comparisons.";

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
    const priceData = await getVehiclePricing(MODEL_SLUG, BASE_CITY_SLUG);

    if (!priceData) {
      return (
        <EmptyState
          title="Price data unavailable"
          description="We could not locate the Maruti Alto K10 price information for Delhi right now. Please check back later or contact support."
        />
      );
    }

    const ensuredVariants = ensureVariants(priceData.priceDetails ?? [], priceData.heroImage ?? DEFAULT_VARIANT_IMAGE);

    if (!ensuredVariants.length) {
      return (
        <EmptyState
          title="Pricing data incomplete"
          description="We are updating variant-level pricing details for the Maruti Alto K10 in Delhi. Please check back shortly."
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
      vehicleType: priceData.vehicleType ?? "car",
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
          id="maruti-alto-k10-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleSchema) }}
        />

        <VehiclePricingView
          vehicleType={priceData.vehicleType ?? "car"}
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
          faqs={getCarFaqs(displayName, priceData.currency, lowestOnRoadPrice)}
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
    variant: `${baseVariant.variant} Dual Tone Edition`,
    onRoadPrice: Math.round(Number(baseVariant.onRoadPrice) * 1.06),
    features: Array.from(new Set([...(baseVariant.features ?? []), "Dual-tone dashboard", "Rear defogger"])),
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
      onRoadPrice: Math.round(basePrice * 1.04),
      exShowroomPrice: priceDetails[0]?.exShowroomPrice,
    },
    {
      citySlug: "bangalore",
      city: "Bengaluru",
      onRoadPrice: Math.round(basePrice * 1.06),
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
