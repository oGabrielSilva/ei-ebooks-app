export default class ResponseJSONModel<T> {
  constructor(
    private readonly status: number,
    private readonly code: string,
    private body?: KeyString<T>,
    private readonly message: string = '',
    private readonly timestamp = new Date().toISOString()
  ) {}

  public getBody() {
    return this.body;
  }

  public setBody(body: KeyString<T>) {
    this.body = body;
  }

  public getStatus() {
    return this.status;
  }

  public getCode() {
    return this.code;
  }

  public getMessage() {
    return this.message;
  }

  public getTimestamp() {
    return this.timestamp;
  }
}
