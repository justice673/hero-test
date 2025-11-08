import { Document, WithId } from "mongodb";
import { getMongoClient } from "../db/mongoClient";

const DEFAULT_DB_NAME = "hero_price_check";
const COLLECTION_NAME = "prices";

type BrakeInfo = {
  front?: string;
  rear?: string;
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

export type HeroPriceDocument = WithId<Document> & {
  modelSlug: string;
  citySlug: string;
  city: string;
  brandName?: string;
  modelName: string;
  currency: string;
  priceDetails: VariantDetail[];
  lastUpdatedAt: Date;
  sourceUrl?: string;
};

export async function getHeroSplendorPlusPriceInDelhi(): Promise<HeroPriceDocument | null> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB_NAME ?? DEFAULT_DB_NAME;
  const database = client.db(dbName);
  const collection = database.collection<HeroPriceDocument>(COLLECTION_NAME);

  const document = await collection.findOne({
    modelSlug: "hero-splendor-plus",
    citySlug: "delhi",
  });

  if (!document) {
    return null;
  }

  return normalizePriceDocument(document);
}

function normalizePriceDocument(document: HeroPriceDocument): HeroPriceDocument {
  return {
    ...document,
    priceDetails: document.priceDetails.map((detail) => ({
      ...detail,
      exShowroomPrice: toNumber(detail.exShowroomPrice),
      registration: toOptionalNumber(detail.registration),
      insurance: toOptionalNumber(detail.insurance),
      otherCharges: toOptionalNumber(detail.otherCharges),
      onRoadPrice: toNumber(detail.onRoadPrice),
      engineCc: toOptionalNumber(detail.engineCc),
      colorOptions: toStringArray(detail.colorOptions),
      features: toStringArray(detail.features),
      brakeType: normalizeBrakeInfo(detail.brakeType),
    })),
    lastUpdatedAt: new Date(document.lastUpdatedAt),
  };
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function toOptionalNumber(value: unknown): number | undefined {
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
