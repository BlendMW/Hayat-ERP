import { Request, Response, NextFunction } from 'express';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

interface HayatAuthRequest extends Request {
  user?: any;
  tenant?: string;
}

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION || 'us-east-1' });

export const hayatAuthenticate = async (req: HayatAuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const command = new GetUserCommand({ AccessToken: token });
    const response = await cognitoClient.send(command);

    if (response.UserAttributes) {
      req.user = response.UserAttributes.reduce((acc: any, attr: any) => {
        acc[attr.Name] = attr.Value;
        return acc;
      }, {});
      req.tenant = req.user['custom:tenant'];
    }

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const hayatAuthorize = (roles: string[]) => {
  return (req: HayatAuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userRole = req.user['custom:role'];
    if (!roles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}; 