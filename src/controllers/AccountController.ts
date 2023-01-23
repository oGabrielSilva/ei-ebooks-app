import Constants from '../constants/Constants';
import { EnumStatusCode } from '../constants/EnumStatusCode';
import Exception from '../errors/Exception';
import ResponseJSONModel from '../json/ResponseJSONModel';

export default class AccountController {
  public static async signIn(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) {
    try {
      const firebase = req.app.get(Constants.FIREBASE_NAME) as F;
      const { token, uid } = req.body as RequestBodySetCookie;
      const verify = await firebase.getAuth().verifyIdToken(token);
      if (verify.uid !== uid || !verify.uid) {
        throw new Exception(
          EnumStatusCode.UNAUTHORIZED,
          EnumStatusCode[EnumStatusCode.UNAUTHORIZED],
          'user does not own this token'
        );
      }
      const response = new ResponseJSONModel(
        EnumStatusCode.OK,
        EnumStatusCode[EnumStatusCode.OK]
      );
      res
        .cookie(Constants.FIREBASE_COOKIE_TOKEN, token, {
          httpOnly: true,
          secure: true,
        })
        .cookie(Constants.FIREBASE_COOKIE_UID, uid)
        .status(EnumStatusCode.OK)
        .json(response)
        .end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  public static async createAccount(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) {
    try {
      const firebase = req.app.get(Constants.FIREBASE_NAME) as F;
      const { token, uid, profile } = req.body as RequestBodySetCookie;
      const verify = await firebase.getAuth().verifyIdToken(token);
      if (verify.uid !== uid || !verify.uid) {
        throw new Exception(
          EnumStatusCode.UNAUTHORIZED,
          EnumStatusCode[EnumStatusCode.UNAUTHORIZED],
          'user does not own this token'
        );
      }
      const profileURL = await firebase.uploadString(
        uid,
        'images/profile',
        profile
      );
      const response = new ResponseJSONModel<string>(
        EnumStatusCode.OK,
        EnumStatusCode[EnumStatusCode.OK]
      );
      response.setBody({ profileURL });
      res
        .cookie(Constants.FIREBASE_COOKIE_TOKEN, token, {
          httpOnly: true,
          secure: true,
        })
        .cookie(Constants.FIREBASE_COOKIE_UID, uid)
        .status(EnumStatusCode.OK)
        .json(response)
        .end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
