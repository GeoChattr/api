"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubOAuthStrategy = void 0;
const clientUrl_1 = require("../../utils/clientUrl");
const express_1 = require("express");
const passport_github2_1 = require("passport-github2");
const passport_1 = __importDefault(require("passport"));
const dotenv_1 = __importDefault(require("dotenv"));
const uuid_1 = require("uuid");
const client_1 = require("@prisma/client");
const Database_1 = require("../../db/Database");
const GitHubOAuthStrategy = () => {
    dotenv_1.default.config();
    passport_1.default.use(new passport_github2_1.Strategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/api/auth/github/callback",
        scope: ["user:email"],
    }, (accessToken, refreshToken, profile, cb) => __awaiter(void 0, void 0, void 0, function* () {
        const userObject = {
            id: uuid_1.v4(),
            provider: client_1.AuthProvider.github,
            username: profile.username,
            displayName: profile.displayName,
            profilePicture: profile.photos[0].value,
            location: "Mountain View"
        };
        const existingUser = yield Database_1.prisma.user.findFirst({
            where: { username: profile.username },
        });
        if (existingUser) {
            cb(null, existingUser);
        }
        else {
            const newUser = yield Database_1.prisma.user.create({
                data: userObject,
            });
            cb(null, newUser);
        }
    })));
    const router = express_1.Router();
    router.get("/auth/github", passport_1.default.authenticate("github", { scope: ["user:email"] }));
    router.get("/auth/github/callback", passport_1.default.authenticate("github", {
        scope: ["user:email"],
        failureRedirect: "/",
    }), (req, res) => {
        res.redirect(clientUrl_1.clientUrl);
    });
    return router;
};
exports.GitHubOAuthStrategy = GitHubOAuthStrategy;
//# sourceMappingURL=GitHubOAuthStrategy.js.map