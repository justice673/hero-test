import { MongoClient, MongoClientOptions, ServerApiVersion } from "mongodb";

type CachedClient = {
  client: MongoClient;
  promise: Promise<MongoClient>;
};

const options: MongoClientOptions = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 5,
  minPoolSize: 1,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

let cachedClient: CachedClient | undefined;

export async function getMongoClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }

  if (cachedClient?.client) {
    return cachedClient.client;
  }

  if (!cachedClient) {
    const client = new MongoClient(uri, options);
    cachedClient = {
      client,
      promise: client.connect(),
    };
  }

  try {
    cachedClient.client = await cachedClient.promise;
    return cachedClient.client;
  } catch (error) {
    cachedClient = undefined;
    throw new Error(`Failed to connect to MongoDB: ${String(error)}`);
  }
}

