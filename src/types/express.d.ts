import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        attributes: {
          'custom:tenant': string;
        };
      };
    }
  }
}
