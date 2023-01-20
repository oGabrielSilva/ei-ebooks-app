export default class ConsoleMiddleware {
  public static middleware(
    req: ExpressRequest,
    res: ExpressResponse,
    next: ExpressNext
  ) {
    console.log(
      req.method.concat(':'),
      '"'.concat(req.path, '";'),
      'Time:',
      new Date().toISOString()
    );
    next();
  }
}
