import { Request, Response, NextFunction } from 'express';
import { Auth } from 'aws-amplify';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await Auth.currentSession();
    const idToken = session.getIdToken().getJwtToken();
    const userGroups = session.getIdToken().payload['cognito:groups'] || [];

    req.user = {
      id: session.getIdToken().payload['sub'],
      email: session.getIdToken().payload['email'],
      groups: userGroups,
      attributes: session.getIdToken().payload,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.groups.includes(role)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
};
