import { Document, WithId } from "mongodb";
import { getMongoClient } from "../db/mongoClient";

const DEFAULT_DB_NAME = "hero_price_check";
const COLLECTION_NAME = "prices";

type BrakeInfo = {
  front?: string;
  rear?: string;
};

export type CityPrice = {
  citySlug: string;
  city: string;
  exShowroomPrice?: number;
  onRoadPrice: number;
};

export type Review = {
  author: string;
  rating: number;
  title?: string;
  comment: string;
  source?: string;
  createdAt: Date;
};

export type VariantDetail = {
  variant: string;
  exShowroomPrice: number;
  registration?: number;
  insurance?: number;
  otherCharges?: number;
  onRoadPrice: number;
  engineCc?: number;
  power?: string;
  torque?: string;
  mileage?: string;
  fuelType?: string;
  transmission?: string;
  colorOptions?: string[];
  features?: string[];
  kerbWeight?: string;
  fuelTankCapacity?: string;
  brakeType?: BrakeInfo;
};

export type VehiclePricingDocument = WithId<Document> & {
  modelSlug: string;
  citySlug: string;
  city: string;
  brandName?: string;
  modelName: string;
  vehicleType?: "bike" | "car";
  currency: string;
  priceDetails: VariantDetail[];
  cityPrices?: CityPrice[];
  reviews?: Review[];
  lastUpdatedAt: Date;
  sourceUrl?: string;
  heroImage?: string;
};

export async function getVehiclePricing(modelSlug: string, citySlug: string): Promise<VehiclePricingDocument | null> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME ?? DEFAULT_DB_NAME;
  const database = client.db(dbName);
  const collection = database.collection<VehiclePricingDocument>(COLLECTION_NAME);

  const document = await collection.findOne({
    modelSlug,
    citySlug,
  });

  if (!document) {
    return null;
  }

  return normalizePriceDocument(document);
}

function normalizePriceDocument(document: VehiclePricingDocument): VehiclePricingDocument {
  const normalizeLegacyRegistration = (detail: VariantDetail & { roadTax?: number }) =>
    detail.registration ?? detail.roadTax;

  const normalizeLegacyOtherCharges = (detail: VariantDetail & { others?: number }) =>
    detail.otherCharges ?? detail.others;

  return {
    ...document,
    vehicleType: document.vehicleType ?? "bike",
    priceDetails: document.priceDetails.map((detail) => ({
      ...detail,
      exShowroomPrice: toNumber(detail.exShowroomPrice),
      registration: toOptionalNumber(normalizeLegacyRegistration(detail as VariantDetail & { roadTax?: number })),
      insurance: toOptionalNumber(detail.insurance),
      otherCharges: toOptionalNumber(normalizeLegacyOtherCharges(detail as VariantDetail & { others?: number })),
      onRoadPrice: toNumber(detail.onRoadPrice),
      engineCc: toOptionalNumber(detail.engineCc),
      power: toOptionalString(detail.power),
      torque: toOptionalString(detail.torque),
      mileage: toOptionalString(detail.mileage),
      fuelType: toOptionalString(detail.fuelType),
      transmission: toOptionalString(detail.transmission),
      kerbWeight: toOptionalString(detail.kerbWeight),
      fuelTankCapacity: toOptionalString(detail.fuelTankCapacity),
      colorOptions: toStringArray(detail.colorOptions),
      features: toStringArray(detail.features),
      brakeType: normalizeBrakeInfo(detail.brakeType),
    })),
    cityPrices: document.cityPrices?.map((cityPrice) => ({
      ...cityPrice,
      exShowroomPrice: toOptionalNumber(cityPrice.exShowroomPrice),
      onRoadPrice: toNumber(cityPrice.onRoadPrice),
    })),
    reviews: document.reviews?.map((review) => ({
      ...review,
      rating: toNumber(review.rating, 0),
      createdAt: new Date(review.createdAt),
    })),
    lastUpdatedAt: new Date(document.lastUpdatedAt),
  };
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : String(item)))
      .filter((item) => item.length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return [value.trim()];
  }

  return [];
}

function normalizeBrakeInfo(brakeInfo: VariantDetail["brakeType"]): BrakeInfo | undefined {
  if (!brakeInfo) {
    return undefined;
  }

  const front = brakeInfo.front?.trim();
  const rear = brakeInfo.rear?.trim();

  if (!front && !rear) {
    return undefined;
  }

  return {
    front: front || undefined,
    rear: rear || undefined,
  };
}

function toOptionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const stringValue = typeof value === "string" ? value.trim() : String(value).trim();
  return stringValue.length > 0 ? stringValue : undefined;
}
