import mongoose from "mongoose";
import connectMongoDB from "./mongodb";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User =
  mongoose.models.User || mongoose.model("User", userSchema, "users");

/**
 * 根據 email 查找或創建用戶
 */
export async function findOrCreateUser({
  email,
  name,
  image,
}: {
  email: string;
  name?: string | null;
  image?: string | null;
}) {
  await connectMongoDB();

  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: name || undefined,
        image: image || undefined,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  return user;
}

/**
 * 根據 email 查找用戶
 */
export async function findUserByEmail(email: string) {
  await connectMongoDB();
  return await User.findOne({ email });
}
