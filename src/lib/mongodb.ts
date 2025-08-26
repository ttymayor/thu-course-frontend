import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME as string,
    });
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
};

export default connectMongoDB;
