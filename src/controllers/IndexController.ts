import Constants from '../constants/Constants';

export default class IndexController {
  public static async get(req: ExpressRequest, res: ExpressResponse) {
    const { authenticated } = res.locals;
    if (authenticated) {
      res.render('home');
      return;
    }
    res.render('sign-in');
  }

  public static async signUp(req: ExpressRequest, res: ExpressResponse) {
    const token = req.cookies[Constants.FIREBASE_COOKIE_TOKEN];
    if (!!token && typeof token === 'string') res.redirect('/');
    res.render('sign-up', {
      lang: req.cookies[Constants.COOKIE_LANG],
      title: 'Ei-Ebooks - Criar conta',
    });
  }
}
