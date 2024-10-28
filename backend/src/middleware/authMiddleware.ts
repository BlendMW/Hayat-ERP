import { Request, Response, NextFunction } from 'express';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
      id: string;
      email: string;
      groups: string[];
      attributes: {
        'custom:tenant': string; // Ensure 'custom:tenant' is present in attributes
        [key: string]: string;   // Allow additional attributes if needed
      };
    };
}

// Configure the AWS Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' }); // Set your AWS region

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the JWT token to get the payload
    const decodedToken = jwt.decode(token, { complete: true }) as jwt.JwtPayload;

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    const userGroups = decodedToken.payload['cognito:groups'] || [];
    const userId = decodedToken.payload['sub'];
    const email = decodedToken.payload['email'];

    req.user = {
      id: userId,
      email: email,
      groups: userGroups,
      attributes: decodedToken.payload,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Middleware to check if the user has a required role
export const requireRole = (role: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.groups.includes(role)) {
      next();
    } else {
      res.status(403).json({ error: 'Forbidden' });
    }
  };
};
