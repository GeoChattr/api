import express from "express";
import { Test } from "./routes/Test";
import { Server, Socket } from "socket.io";
import session from "express-session";
import cors from "cors";
import http from "http";
import passport from "passport";
import axios from "axios";
import "dotenv/config";
import { join } from "path/posix";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
  },
});

//so connection works :(
app.use(
  cors({
    origin: "*",
  })
);

const port = process.env.PORT || 4000;
const name = "GeoChattr";

//Middlewares
app.use(express.json());

//log server requests and request method
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

io.on("connection", async (socket: Socket) => {
  console.log(`Socket Connected: ${socket.id}`);

  socket.on("locationRoomUpdate", async (ip) => {
    try {
      const { data: location } = await axios.get(
        `http://ip-api.com/json/${ip}`
      );
      io.to(socket.id).emit("locationUpdate", location.city);
      console.log("locationUpdate");
      await socket.join(location.city);
      // console.log("first", location);
    } catch (e) {
      console.log(e);
    }
  });

  // console.log("second", location);

  // socket.on("connectLocationUpdate", async () => {
  //   socket.join(location.city);
  // });

  socket.on("message", (msg) => {
    let rooms = Array.from(socket.rooms);
    rooms.shift();
    io.to(rooms).emit("message", { msg, id: socket.id });
  });
});

server.listen(port || process.env.PORT, () => {
  // initializePassport();
  console.log(`Server started on port http://localhost:${port}`);
});
