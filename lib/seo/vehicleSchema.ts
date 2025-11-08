import { Review, VariantDetail } from "@/lib/services/vehiclePricingService";

const DEFAULT_BASE_URL = "https://hero-price-check.vercel.app";

export type VehicleSchemaInput = {
  brandName?: string;
  modelName: string;
  modelSlug: string;
  citySlug: string;
  vehicleType: "bike" | "car";
  city: string;
  currency: string;
  priceDetails: VariantDetail[];
  lowestOnRoadPrice: number;
  highestOnRoadPrice: number;
  reviews?: Review[];
  heroImage?: string;
  baseUrl?: string;
};

export function createVehicleSchema({
  brandName,
  modelName,
  modelSlug,
  citySlug,
  vehicleType,
  city,
  currency,
  priceDetails,
  lowestOnRoadPrice,
  highestOnRoadPrice,
  reviews,
  heroImage,
  baseUrl = DEFAULT_BASE_URL,
}: VehicleSchemaInput) {
  const type = vehicleType === "car" ? "Car" : "Motorcycle";
  const reviewCount = reviews?.length ?? 0;
  const averageRating =
    reviewCount > 0 ? reviews!.reduce((sum, review) => sum + review.rating, 0) / reviewCount : undefined;

  return {
    "@context": "https://schema.org",
    "@type": type,
    name: `${brandName ? `${brandName} ` : ""}${modelName}`,
    brand: brandName ?? (vehicleType === "car" ? "Maruti" : "Hero"),
    url: `${baseUrl}/${modelSlug}/price-in-${citySlug}`,
    image:
      heroImage ??
      "https://res.cloudinary.com/dmywuw6u3/image/upload/v1728568136/hero-price-check/vehicle-default-cover_bkhhkc.jpg",
    offers: priceDetails.slice(0, 2).map((variant) => ({
      "@type": "Offer",
      priceCurrency: currency,
      price: variant.onRoadPrice,
      name: `${modelName} ${variant.variant}`,
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      areaServed: city,
    })),
    aggregateRating:
      averageRating !== undefined
        ? {
            "@type": "AggregateRating",
            ratingValue: Number(averageRating.toFixed(1)),
            reviewCount,
          }
        : undefined,
    vehicleSeatingCapacity: vehicleType === "car" ? "5" : "2",
    vehicleEngine: priceDetails[0]?.engineCc ? `${priceDetails[0]!.engineCc} cc` : undefined,
    knowsAbout: priceDetails[0]?.features ?? undefined,
    additionalProperty: {
      "@type": "PropertyValue",
      name: "On-road price range",
      value: `${lowestOnRoadPrice} - ${highestOnRoadPrice} ${currency}`,
    },
  };
}
