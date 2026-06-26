import mongoose from 'mongoose';

// Shape of the cached connection stored on globalThis.
// `conn`   – resolved Mongoose instance once connected.
// `promise`– in-flight connection to avoid duplicate connects.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Persist the cache on `globalThis` so it survives Next.js hot reloads
// in development, preventing multiple Mongoose connections.
declare global {
  var mongoose: MongooseCache | undefined;
}

// MongoDB connection string must be defined in environment variables.
// We validate it at module load to fail fast on misconfiguration.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Narrowed, non-nullable reference for use throughout the module.
const uri: string = MONGODB_URI;

const cached: MongooseCache = globalThis.mongoose ?? {
  conn: null,
  promise: null,
};
globalThis.mongoose = cached;

/**
 * Establishes and returns a cached Mongoose connection to MongoDB.
 *
 * - Returns the existing connection if one is already established.
 * - Otherwise creates a single shared connection promise and awaits it,
 *   so concurrent callers share the same connection attempt.
 * - On failure, resets the promise so the next call can retry.
 */
async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { bufferCommands: false })
      .then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;
