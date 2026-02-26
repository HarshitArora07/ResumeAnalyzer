import mongoose from "mongoose"
import { env } from "./env.js"

export const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      throw new Error("MONGO_URI not defined")
    }

    const conn = await mongoose.connect(env.MONGO_URI)

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB Atlas Connection Failed")
    console.error(error.message)
    process.exit(1)
  }
}