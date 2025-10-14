const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const register = require("../models/Register");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/login/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let registerUser = await register.findOne({ where: { googleId: profile.id } });

        if (!registerUser) {  
          registerUser = await register.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value,
          });
        }

        return done(null, registerUser);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// passport.serializeUser((registerUser, done) => done(null, registerUser.id));
// passport.deserializeUser((id, done) => done(null, id));

module.exports = passport;
