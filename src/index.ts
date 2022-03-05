import express from "express";
import { Test } from "./routes/Test";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = 4000;
const name = "GeoChattr";

//Middlewares
app.use(
  cors({
    origin: "*",
  })
);
app.use("/api", Test());

app.get("/", (req, res) => {
  res.json({ success: true, message: `${name} API` });
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
