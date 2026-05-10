import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const MONGODB_URI = process.env.MONGODB_URI as string;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME as string,
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error("Error connecting to DB:", error);
    throw error;
  }
};

export default connectMongoDB;
