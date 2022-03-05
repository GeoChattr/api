//Import routes
import { Test } from "../routes/Test";
// import { Socket } from '../routes/Socket'
import express, { Application } from "express";
import dotenv from "dotenv";

export class Server {
  public app: Application;
  private name: string = "GeoChattr";
  private PORT: number = 4000;

  public constructor() {
    this.app = express();

    //register server middlewares
    this.registerMiddlewares();

    //register server base routes
    this.registerRoutes();

    //Set up websocket
    // Socket(this.app);

    dotenv.config();
  }

  public start() {
    //listen the server on a local port
    this.app.listen(this.PORT, () => {
      console.log(`${this.name} API started on http://localhost:${this.PORT}`);
    });
  }

  private registerMiddlewares() {
    //use json
    this.app.use(express.json());

    //log server requests & request method
    this.app.use(async (req, res, next) => {
      console.log(`[${req.method} - ${req.path}]`);
      res.header("Access-Control-Allow-Origin", "*");

      next();
    });
  }

  private registerRoutes() {
    this.app.get("/", (req, res) => {
      res.json({
        success: true,
        message: `${this.name} API`,
      });
    });

    this.app.use("/api", Test());
  }
}
