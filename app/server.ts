
import express, { NextFunction, Request, Response } from 'express';
import { RegisterRoutes, rootRouter } from './routes';
import { ConfigService } from './config';
import path from 'path';
import { ValidateError } from 'tsoa';

class Server {
  // eslint-disable-next-line no-use-before-define
  static #instance: Server;

  private constructor() {}

  static async GetInstance() {
    if(!Server.#instance) {
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
      app.get('/.well-known/jwks.json', (_: Request, res: Response) => {
        res.type('application/json');
        res.sendFile(path.resolve(__dirname, 'jwks.json'));
      });

      RegisterRoutes(rootRouter);
      app.use('/', rootRouter);
      
      app.use(errorHandlingMiddleware);

      await new Promise(resolve => {
        app.listen(configService.getPort(), '0.0.0.0', () => {
          resolve(true);
        });
      });
    } catch(err: any) {
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
			message: 'Validation Failed',
			details: err?.fields,
		});
	} else if (err.status) {
		return res.status(err.status).json({ message: err.message });
	}
	if (err instanceof Error) {
		return res.status(500).json({
			message: 'Internal Server Error',
		});
	}

	next();
}


export default Server;