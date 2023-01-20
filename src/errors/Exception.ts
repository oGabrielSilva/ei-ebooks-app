class Exception extends Error {
  private readonly timestamp: string;
  private readonly status: number;
  private readonly code: string;

  public constructor(
    status: number,
    code: string,
    message = 'unexpected error'
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.timestamp = new Date().toISOString();
    this.name = 'Exception';
  }

  public getMessage() {
    return this.message;
  }

  public getStatus() {
    return this.status;
  }

  public getCode() {
    return this.code;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getName() {
    return this.name;
  }
}

export default Exception;
