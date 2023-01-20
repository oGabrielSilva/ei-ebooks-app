import Constants from '../constants/Constants';

export default class AuthMiddleware {
  public static middleware(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) {
    const token = req.cookies[Constants.FIREBASE_COOKIE_TOKEN];
    if (
      (!token || typeof token !== 'string') &&
      req.path !== '/sign-up' &&
      req.path !== '/sign-in'
    ) {
      res.clearCookie(Constants.FIREBASE_COOKIE_TOKEN);
      res.render('sign-in', {
        title: Constants.APP_NAME.concat(' - Entrar'),
        lang:
          req.cookies[Constants.COOKIE_LANG] ??
          Constants.APP_DISPLAY_LANGUAGES.ptBR,
      });
      return;
    }
    next();
  }
}
