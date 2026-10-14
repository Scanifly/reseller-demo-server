import express, { NextFunction, Request, Response } from "express";
import { RegisterRoutes, rootRouter } from "./routes";
import { ConfigService } from "./config";
import path from "path";
import { ValidateError } from "tsoa";
import type { Server as HttpServer } from "http";
class Server {
  // eslint-disable-next-line no-use-before-define
  static #instance: Server;

  #httpServer?: HttpServer;

  private constructor() {}

  static async GetInstance() {
    if (!Server.#instance) {
      Server.#instance = new Server();
      await Server.#instance.start();
    }
    return Server.#instance;
  }

  private async start() {
    try {
      const configService = ConfigService.GetInstance();
      await configService.init();
      const app = express();

      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));

      // Server up public keys
      app.get("/.well-known/jwks.json", (_: Request, res: Response) => {
        res.type("application/json");
        res.sendFile("jwks.json", { root: __dirname });
      });

      // Demo partner page embedding the Scanifly 3D design settings
      app.get("/demo/design-settings", (_: Request, res: Response) => {
        res.sendFile("design-settings.html", {
          root: path.resolve(__dirname, "public"),
        });
      });

      RegisterRoutes(rootRouter);
      app.use("/", rootRouter);

      app.use(errorHandlingMiddleware);

      const port = configService.getPort();
      this.#httpServer = app.listen(port, "0.0.0.0", (err) => {
        if (err) {
          console.log("Server error: " + err);
        } else {
          console.log("Server listening on " + port);
        }
      });
      const shutdown = () =>
        this.#httpServer?.close(() => {
          console.log("Server shutdown");
          process.exit(0);
        });

      process.on("exit", (code) => console.log("[lifecycle] exit", code));
      process.on("SIGINT", shutdown);
      process.on("SIGTERM", shutdown);
      process.on("SIGUSR2", shutdown); // nodemon uses this
      process.on("uncaughtException", (e) => {
        console.log("[lifecycle] uncaughtException", e);
        shutdown();
      });
      process.on("unhandledRejection", (e) => {
        console.log("[lifecycle] unhandledRejection", e);
        shutdown();
      });
    } catch (err: any) {
      console.error(err);
    }
  }
}

function errorHandlingMiddleware(
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (err instanceof ValidateError) {
    //console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: "Validation Failed",
      details: err?.fields,
    });
  } else if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }

  next();
}

export default Server;
