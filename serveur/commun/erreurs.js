export class ErreurSynchro extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ErreurSynchro';
    this.code = code;
  }
}
