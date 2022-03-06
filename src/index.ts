import express from "express";
import { Test } from "./routes/Test";
import { GitHubOAuthStrategy } from "./routes/Auth/GitHubOAuthStrategy";
import { Server } from "socket.io";
import session from 'express-session'
import { prisma } from './db/Database'
import cors from "cors";
import http from "http";
import passport from 'passport'
import { GoogleOAuthStrategy } from "./routes/Auth/GoogleOAuthStrategy";
import { User } from "@prisma/client";


// function initializePassport() {
//   passport.serializeUser(async (user: any, cb: any) => {
//     const userData: User = user as any;

//     cb(null, userData);
//   });

//   passport.deserializeUser<string>(async (id, done) => done(null, { id }));
// }

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
  },
});

const port = 4000;
const name = "GeoChattr";

//Middlewares
app.use(express.json());

//log server requests & request method
app.use(async (req, res, next) => {
  console.log(`[${req.method} - ${req.path}]`);
  res.header("Access-Control-Allow-Origin", "*");

  next();
});

app.use(cors({ origin: true, credentials: true }));

// app.use(
//   session({
//     secret: "secret",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

app.get("/", (req, res) => {
  res.json({ success: true, message: `${name} API`, isAuthenticated: req.isAuthenticated(), });
});

io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`)
  
    socket.on("message", (msg) => {
      console.log("message: " + msg);
      io.emit("message", { msg, id: socket.id });
    });
  });
  
server.listen(port, () => {
  // initializePassport();
  console.log(`Server started on port http://localhost:${port}`);
});


