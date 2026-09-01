import mongoose from "mongoose";

// On serverless (Vercel), the module stays warm between invocations but a new
// request can land on a fresh instance at any time. Cache the connection (and
// the in-flight connection promise) on `global` so we reuse a single pooled
// connection instead of dialing MongoDB on every request.
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export const dbConnection = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "PersonalPortfolio",
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        console.log("Connected to Database!!");
        return mongooseInstance;
      })
      .catch((err) => {
        // Reset so the next request can retry instead of caching a failure.
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
