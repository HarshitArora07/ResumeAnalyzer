import mongoose from "mongoose"

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    resumeText: String,
    score: Number,
    jobMatchScore: Number,
    missingKeywords: [String],
    improvedText: String
  },
  { timestamps: true }
)

export default mongoose.model("History", historySchema)