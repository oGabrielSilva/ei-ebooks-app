import { Handler } from 'express';

export default function adapter(handlerFn: Handler) {
  return async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) => {
    try {
      return await Promise.resolve(handlerFn(req, res, next));
    } catch (e) {
      return next(e);
    }
  };
}
