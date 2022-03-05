
   
import { PassportGoogleUser } from "../../types/PassportGoogleUser";
import { InitialAuthUser } from "../../types/InitialAuthUser";
import { clientUrl } from "../../utils/clientUrl";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import dotenv from "dotenv";
import { Router } from "express";
import { v4 as uuid } from "uuid";
import { AuthProvider } from "@prisma/client";
import { prisma } from '../../db/Database'

//Google Authentication Strategy
export const GoogleOAuthStrategy = () => {
  dotenv.config();

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "/api/auth/google/callback",
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: PassportGoogleUser,
        cb: any
      ) => {
        const userObject: InitialAuthUser = {
          id: uuid(),
          username: profile.displayName,
          provider: AuthProvider.google,
          displayName: profile.name.givenName,
          email: profile._json.email,
          profilePicture: profile._json.picture,
          location: "Mountain View"
        };

        const existingUser = await prisma.user.findFirst({
          where: {
            email: profile._json.email,
          },
        });

        if (existingUser) {
          cb(null, existingUser);
        } else {
          const newUser = await prisma.user.create({
            data: userObject,
          });

          cb(null, newUser);
        }
      }
    )
  );

  const router = Router();

  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

  router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect(clientUrl);
    }
  );

  return router;
};