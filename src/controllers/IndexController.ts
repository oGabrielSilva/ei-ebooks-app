import Constants from '../constants/Constants';

export default class IndexController {
  public static async get(req: ExpressRequest, res: ExpressResponse) {
    const firebase = req.app.get(Constants.FIREBASE_NAME) as F;
    res.status(200);
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
