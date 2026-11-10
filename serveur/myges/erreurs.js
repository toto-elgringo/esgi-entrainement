export class ErreurMyges extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ErreurMyges';
    this.code = code;
  }
}
