import { Request, Response, NextFunction } from 'express';
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';

interface HayatAuthRequest extends Request {
  user?: any;
  tenant?: string;
}

// Initialize the Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: 'us-east-1' }); // Update to your Cognito region

export const hayatAuthMiddleware = async (req: HayatAuthRequest, res: Response, next: NextFunction) => {
  try {
    // Retrieve the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Use the token to get user information
    const command = new GetUserCommand({ AccessToken: token });
    const response = await cognitoClient.send(command);

    // Attach user information to the request object
    if (response.UserAttributes) {
      req.user = response.UserAttributes.reduce((acc: any, attr: any) => {
        acc[attr.Name] = attr.Value;
        return acc;
      }, {});
    } else {
      req.user = {};
    }

    req.tenant = req.user['custom:tenant'];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
