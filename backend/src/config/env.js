import dotenv from "dotenv"

dotenv.config()

export const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  GROQ_API_KEY: process.env.GROQ_API_KEY,

  // ✅ Add these for Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SERVER_URL: process.env.SERVER_URL,   // your backend URL
  CLIENT_URL: process.env.CLIENT_URL    // your frontend URL
}