// ./src/config/db.js
import mongoose from "mongoose";
import dns from "dns";
import { env } from "./env.js";

// 🔥 Force Google DNS instead of ISP DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI, {
      family: 4
    });

    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err);
    process.exit(1);
  }
};