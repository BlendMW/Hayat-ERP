import { Request, Response, NextFunction } from 'express';
import { Auth } from 'aws-amplify';

interface HayatAuthRequest extends Request {
  user?: any;
  tenant?: string;
}

export const hayatAuthMiddleware = async (req: HayatAuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    req.user = user;
    req.tenant = user.attributes['custom:tenant'];
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
