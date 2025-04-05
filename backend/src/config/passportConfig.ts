import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../model/user.model"; // تأكد من المسار الصحيح لنموذج المستخدم

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "",
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        console.log("Google profile:", profile); // ✅ لفحص البيانات المستلمة من Google
        const email = profile.emails?.[0]?.value;
        console.log(email);
        if (!email) {
          return done(new Error("No email found on Google profile"), undefined);
        }
        let user = await User.findOne({
          $or: [{ email }, { googleId: profile.id }],
        });

        if (!user) {
          user = new User({
            name: profile.displayName,
            email: email,
            googleId: profile.id || undefined,
          });

          await user.save();
          console.log("the user is " + user);
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  console.log("Serializing user:", user.id || user._id); // ✅ فحص ما يتم حفظه في الجلسة
  done(null, user.id || user._id);
});

passport.deserializeUser(async (id: string, done) => {
  console.log("Deserializing user with ID:", id); // ✅ تحقق من الاسترداد
  const user = await User.findById(id);
  done(null, user);
});
export default passport;
