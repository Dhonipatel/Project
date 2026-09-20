import mongoose from 'mongoose';

let isConnected = false;

export async function connectToDatabase(): Promise<boolean> {
  if (isConnected) {
    return true;
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn(
      '[MERN MongoDB] MONGODB_URI is not defined in environment variables. Operating in memory-backed local mode. To connect to MongoDB, set MONGODB_URI in your .env or platform secrets.'
    );
    return false;
  }

  try {
    const db = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = db.connection.readyState === 1;
    console.log('[MERN MongoDB] Successfully connected to MongoDB database:', db.connection.name);
    return isConnected;
  } catch (error) {
    console.error('[MERN MongoDB] Failed to connect to MongoDB:', error);
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
