import Constants from '../constants/Constants';

export default class GlobalCookiesMiddleware {
  public static middleware(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) {
    if (!req.cookies[Constants.COOKIE_LANG]) {
      res.cookie(Constants.COOKIE_LANG, Constants.APP_DISPLAY_LANGUAGES.ptBR);
    }
    next();
  }
}
