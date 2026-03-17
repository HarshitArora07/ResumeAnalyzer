import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import User from "../models/user.model.js"
import { env } from "./env.js"

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${env.SERVER_URL}/api/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value })
          if (user) {
            // Link Google account to existing user
            user.googleId = profile.id
            await user.save()
          } else {
            // Create new user
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              password: Math.random().toString(36).slice(-8)
            })
          }
        }

        done(null, user)
      } catch (err) {
        done(err, null)
      }
    }
  )
)