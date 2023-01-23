import { EnumStatusCode } from '../constants/EnumStatusCode';
import Exception from '../errors/Exception';

export default class ErrorHandling {
  public static catchError(
    error: unknown,
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) {
    if (error instanceof Exception) {
      res
        .status(error.getStatus())
        .json({ ...error, message: error.getMessage() });
    } else {
      console.log('****ERROR:', error);
      res.status(EnumStatusCode.INTERNAL_SERVER_ERROR).json({
        timestamp: new Date().toISOString(),
        status: EnumStatusCode.INTERNAL_SERVER_ERROR,
        code: EnumStatusCode[EnumStatusCode.INTERNAL_SERVER_ERROR],
        message: EnumStatusCode[EnumStatusCode.INTERNAL_SERVER_ERROR],
      });
    }
    next(error);
  }
}
