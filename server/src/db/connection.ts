import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/upspring";

    await mongoose.connect(mongoURI);
    isConnected = true;
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.warn("MongoDB connection failed - running without cache:", error);
    console.warn("Server will continue to work, but caching is disabled");
    isConnected = false;
  }
};

export const isMongoConnected = (): boolean => {
  return isConnected && mongoose.connection.readyState === 1;
};
