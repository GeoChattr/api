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
const express_1 = __importDefault(require("express"));
const Test_1 = require("./routes/Test");
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: true,
    },
});
const port = 4000;
const name = "GeoChattr";
app.use(express_1.default.json());
app.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[${req.method} - ${req.path}]`);
    res.header("Access-Control-Allow-Origin", "*");
    next();
}));
app.use("/api", (0, Test_1.Test)());
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: `${name} API`,
    });
});
app.get("/user", (req, res) => {
    res.json(req.user);
});
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Socket Connected: ${socket.id}`);
    const ip = socket.handshake.address.substring(7);
    console.log(process.env.GEOLOCATION_API_KEY);
    let location;
    try {
        location = yield (yield axios_1.default.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.GEOLOCATION_API_KEY}&ip=${ip}`)).data;
        io.to(socket.id).emit("locationUpdate", location);
        socket.join(location.city);
    }
    catch (e) {
        console.log(e);
    }
    socket.on("message", (msg) => {
        console.log("message: " + msg);
        io.emit("message", { msg, id: socket.id });
    });
}));
server.listen(port || process.env.PORT, () => {
    console.log(`Server started on port http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map