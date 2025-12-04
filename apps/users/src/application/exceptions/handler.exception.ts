export class HandlerException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HandlerException';
  }
}
