"use client";

import { useMemo, useState } from "react";

import { CityPrice, Review, VariantDetail } from "@/lib/services/vehiclePricingService";
import { getHighestOnRoadPrice, getLowestOnRoadPrice } from "@/lib/utils/pricing";

import { CityPriceList } from "./CityPriceList";
import { CompareSection } from "./CompareSection";
import { FaqAccordion } from "./FaqAccordion";
import { HeroIntro } from "./HeroIntro";
import { ReviewSection } from "./ReviewSection";
import { VariantCard } from "./VariantCard";

type VehiclePricingViewProps = {
  vehicleType: "bike" | "car";
  modelSlug: string;
  brandName?: string;
  modelName: string;
  baseCitySlug: string;
  currency: string;
  lastUpdatedAt: Date;
  priceDetails: VariantDetail[];
  cityPrices: CityPrice[];
  reviews: Review[];
  heroImage?: string;
  faqs: { question: string; answer: string }[];
};

export function VehiclePricingView({
  vehicleType,
  modelSlug,
  brandName,
  modelName,
  baseCitySlug,
  currency,
  lastUpdatedAt,
  priceDetails,
  cityPrices,
  reviews,
  heroImage,
  faqs,
}: VehiclePricingViewProps) {
  const defaultCitySlug = useMemo(() => {
    if (!cityPrices.length) {
      return baseCitySlug;
    }
    return cityPrices.some((city) => city.citySlug === baseCitySlug) ? baseCitySlug : cityPrices[0].citySlug;
  }, [cityPrices, baseCitySlug]);

  const [activeCitySlug, setActiveCitySlug] = useState(defaultCitySlug);
  const activeCity =
    cityPrices.find((city) => city.citySlug === activeCitySlug) ??
    cityPrices[0] ?? {
      city: brandName ? `${brandName} City` : "Selected City",
      citySlug: defaultCitySlug,
      onRoadPrice: getLowestOnRoadPrice(priceDetails),
    };

  const baseCity =
    cityPrices.find((city) => city.citySlug === defaultCitySlug) ??
    activeCity ??
    ({
      onRoadPrice: getLowestOnRoadPrice(priceDetails),
    } as CityPrice);

  const cityDelta = useMemo(
    () => Number(activeCity.onRoadPrice ?? 0) - Number(baseCity.onRoadPrice ?? 0),
    [activeCity.onRoadPrice, baseCity.onRoadPrice],
  );

  const priceRange = useMemo(() => {
    if (cityPrices.length >= 2) {
      return {
        lowestOnRoadPrice: Math.min(...cityPrices.map((city) => Number(city.onRoadPrice))),
        highestOnRoadPrice: Math.max(...cityPrices.map((city) => Number(city.onRoadPrice))),
      };
    }

    return {
      lowestOnRoadPrice: getLowestOnRoadPrice(priceDetails),
      highestOnRoadPrice: getHighestOnRoadPrice(priceDetails),
    };
  }, [cityPrices, priceDetails]);

  const adjustedVariants = useMemo(
    () =>
      priceDetails.map((detail) => ({
        ...detail,
        onRoadPrice: Math.max(0, Number(detail.onRoadPrice) + cityDelta),
      })),
    [priceDetails, cityDelta],
  );

  const displayName = brandName ? `${brandName} ${modelName}` : modelName;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
      <HeroIntro
        brandName={brandName}
        modelName={modelName}
        activeCityName={activeCity.city}
        currency={currency}
        lastUpdatedAt={lastUpdatedAt}
        variantCount={priceDetails.length}
        priceRange={priceRange}
        heroImage={heroImage}
      />

      <section className="mt-12 space-y-8">
        {adjustedVariants.map((detail) => (
          <VariantCard
            key={detail.variant}
            brandName={brandName}
            modelName={modelName}
            currency={currency}
            detail={detail}
            activeCityName={activeCity.city}
            fallbackImage={heroImage}
          />
        ))}
      </section>

      <CityPriceList
        cityPrices={cityPrices}
        currency={currency}
        activeCitySlug={activeCitySlug}
        onCityChange={setActiveCitySlug}
      />

      <ReviewSection reviews={reviews} />
      <CompareSection vehicleType={vehicleType} modelSlug={modelSlug} displayName={displayName} />
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
