export class HayatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HayatError';
  }
}
