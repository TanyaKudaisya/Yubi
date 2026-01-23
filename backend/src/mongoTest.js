import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 👇 resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 👇 explicitly load backend/.env
dotenv.config({ path: path.join(__dirname, "../.env") });

// 🔎 PROOF LINE (do not remove yet)
console.log("ENV CHECK:", process.env.MONGO_URI);

async function testMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB test failed:", err);
    process.exit(1);
  }
}

testMongo();
