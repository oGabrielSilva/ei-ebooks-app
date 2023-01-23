import Constants from '../constants/Constants';

export default class AuthMiddleware {
  public static async middleware(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) {
    try {
      let authenticated = false;
      const uid = req.cookies[Constants.FIREBASE_COOKIE_UID];
      const token = req.cookies[Constants.FIREBASE_COOKIE_TOKEN];
      if (
        !!uid &&
        !!token &&
        typeof uid === 'string' &&
        typeof token === 'string'
      ) {
        const firebase = req.app.get(Constants.FIREBASE_NAME) as F;
        const verifyIdToken = await firebase.getAuth().verifyIdToken(token);
        authenticated = !!verifyIdToken && verifyIdToken.uid === uid;
      }
      res.locals.authenticated = authenticated;
      next();
    } catch (error) {
      console.log('HERE');
      console.log(error);
      res.locals.authenticated = false;
      next();
    }
  }
}
