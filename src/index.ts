import express from "express";
import { Test } from "./routes/Test";
import { Server } from "socket.io";
import session from "express-session";
import cors from "cors";
import http from "http";
import passport from "passport";
import axios from "axios";

// import { User } from "@prisma/client";

// function initializePassport() {

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

app.use("/api", Test());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: `${name} API`,
  });
});

app.get("/user", (req, res) => {
  res.json(req.user);
});

io.on("connection", async (socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  const ip = socket.handshake.address.substring(7);
  // console.log(ip.substring(7));
  console.log(process.env.GEOLOCATION_API_KEY);
  let location: any;
  try {
    location = await (
      await axios.get(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEOLOCATION_API_KEY}&ip=${ip}`
      )
    ).data;
  } catch (e) {
    console.log(e);
  }

  io.to(socket.id).emit("locationUpdate", location);

  socket.on("connectLocationUpdate", async () => {
    socket.join(location.city);
  });

  socket.on("message", (msg) => {
    console.log("message: " + msg);
    io.emit("message", { msg, id: socket.id });
  });
});

server.listen(port || process.env.PORT, () => {
  // initializePassport();
  console.log(`Server started on port http://localhost:${port}`);
});
