import mongoose from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: function () {
        // Required only if not a Google user
        return !this.googleId
      },
      minlength: 6
    },
    googleId: {
      type: String, // store Google profile ID
      unique: true,
      sparse: true // allows null for normal users
    }
  },
  { timestamps: true }
)

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  if (!this.password) return next() // skip if password is empty (Google user)

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false // Google user has no password
  return bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model("User", userSchema)