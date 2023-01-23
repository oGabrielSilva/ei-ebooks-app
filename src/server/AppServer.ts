import env from 'dotenv';
import express, { Express } from 'express';
import { resolve } from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import routes from '../routes/routes';
import FirebaseService from '../services/FirebaseService';
import ErrorHandling from '../middleware/ErrorHandling';
import Constants from '../constants/Constants';
import ConsoleMiddleware from '../middleware/ConsoleMiddleware';
import GlobalCookiesMiddleware from '../middleware/GlobalCookiesMiddleware';
import Exception from '../errors/Exception';
import { EnumStatusCode } from '../constants/EnumStatusCode';

export default class AppServer {
  private readonly app: Express;
  private readonly firebase: FirebaseService;

  public constructor() {
    this.app = express();
    this.firebase = new FirebaseService();
  }

  public start() {
    env.config();
    this.setConstants();
    this.setMiddlewares();
    this.setHtmlEngine();
    this.setRoutes();
    return this;
  }

  public on() {
    const port = process.env.PORT ?? 3000;
    this.app.listen(port, () => console.log(`App on http://127.0.0.1:${port}`));
  }

  private setHtmlEngine() {
    this.app.set('views', resolve(__dirname, '..', '..', 'templates'));
    this.app.set('view engine', 'ejs');
  }

  private setMiddlewares() {
    const staticPath = resolve(__dirname, '..', '..', 'browser', 'public');
    this.app.use(cors({ origin: true, optionsSuccessStatus: 200 }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(cookieParser(process.env.COOKIE_SECRET));
    this.app.use(express.static(staticPath));
    this.app.use(ConsoleMiddleware.middleware);
    this.app.use(GlobalCookiesMiddleware.middleware);
  }

  private setConstants() {
    this.app.set(Constants.FIREBASE_NAME, this.firebase);
  }

  private setRoutes() {
    this.app.use(routes());
    this.app.use(ErrorHandling.catchError);
  }
}
