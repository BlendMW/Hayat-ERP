import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    attributes: {
      'custom:tenant': string;
    };
  };
}
