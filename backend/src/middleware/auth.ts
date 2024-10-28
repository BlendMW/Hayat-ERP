import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    attributes: {
      'custom:tenant': string;
    };
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Decode token and structure it to match the expected `req.user` type
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
      'custom:tenant'?: string; // Optional tenant attribute for decoded token
    };

    // Assign `decoded` properties to `req.user`, including attributes if present
    req.user = {
      id: decoded.id,
      role: decoded.role,
      attributes: {
        'custom:tenant': decoded['custom:tenant'] || '', // Default to empty string if undefined
      },
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};
