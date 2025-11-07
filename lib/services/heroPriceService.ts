import { Document, WithId } from "mongodb";
import { getMongoClient } from "../db/mongoClient";

const DEFAULT_DB_NAME = "hero_price_check";
const COLLECTION_NAME = "prices";

export type PriceBreakdown = {
  variant: string;
  exShowroomPrice: number;
  onRoadPrice: number;
  insurance?: number;
  roadTax?: number;
  others?: number;
};

export type HeroPriceDocument = WithId<Document> & {
  modelSlug: string;
  citySlug: string;
  city: string;
  modelName: string;
  currency: string;
  priceDetails: PriceBreakdown[];
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
      exShowroomPrice: Number(detail.exShowroomPrice ?? 0),
      onRoadPrice: Number(detail.onRoadPrice ?? 0),
      insurance: detail.insurance !== undefined ? Number(detail.insurance) : undefined,
      roadTax: detail.roadTax !== undefined ? Number(detail.roadTax) : undefined,
      others: detail.others !== undefined ? Number(detail.others) : undefined,
    })),
    lastUpdatedAt: new Date(document.lastUpdatedAt),
  };
}

