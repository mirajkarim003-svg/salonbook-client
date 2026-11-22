import { MongoClient } from "mongodb";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Reuse ONE connection (Next.js reloads files a lot in development)
const globalForMongo = globalThis;

export function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing. Add it to your .env.local file.");
  }
  if (!globalForMongo._salonbookMongo) {
    globalForMongo._salonbookMongo = new MongoClient(process.env.MONGODB_URI);
  }
  return globalForMongo._salonbookMongo;
}
