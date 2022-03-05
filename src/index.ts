import express from "express";
import { Test } from "./routes/Test";
import { GitHubOAuthStrategy } from "./routes/Auth/GitHubOAuthStrategy";
import { Server } from "socket.io";
import session from 'express-session'
import cors from "cors";
import http from "http";
import passport from 'passport'


function initializePassport() {

    passport.serializeUser(async (user: any, cb: any) => {
      const userData: any = user as any;

      cb(null, userData);
    });

    passport.deserializeUser<string>(async (id, done) => done(null, { id }));
}

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
app.use("/api", Test(), GitHubOAuthStrategy());
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);


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
  initializePassport();
  console.log(`Server started on port http://localhost:${port}`);
});


