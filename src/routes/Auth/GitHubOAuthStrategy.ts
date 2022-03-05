
import { PassportGitHubUser } from "../../types/PassportGitHubUser";
import { InitialAuthUser } from "../../types/InitialAuthUser";
import { clientUrl } from "../../utils/clientUrl";
import { Router } from "express";
import { Strategy as GitHubStrategy } from "passport-github2";
import passport from "passport";
import dotenv from "dotenv";
import { v4 as uuid } from "uuid";
import { AuthProvider } from "@prisma/client";
import { prisma } from '../../db/Database'

//GitHub Authentication Strategy
export const GitHubOAuthStrategy = () => {
  dotenv.config();

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: PassportGitHubUser,
        cb: any
      ) => {
        const userObject: InitialAuthUser = {
          id: uuid(),
          provider: AuthProvider.github,
          username: profile.username,
          displayName: profile.displayName,
          profilePicture: profile.photos[0].value,
        };



        const existingUser = await prisma.user.findFirst({
          where: { username: profile.username },
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

  router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

  router.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      scope: ["user:email"],
      failureRedirect: "/",
    }),
    (req, res) => {
      res.redirect(clientUrl);
    }
  );

  return router;
};