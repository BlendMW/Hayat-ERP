import { Request, Response } from 'express';
import { API } from 'aws-amplify';

export const hayatManageTenants = async (req: Request, res: Response) => {
  try {
    const tenants = await API.get('hayatAdminAPI', '/tenants', {
      queryStringParameters: req.query
    });
    res.json(tenants);
  } catch (error) {
    console.error('Error managing tenants:', error);
    res.status(500).json({ error: 'Error managing tenants' });
  }
};

export const hayatManageUsers = async (req: Request, res: Response) => {
  try {
    const users = await API.get('hayatAdminAPI', '/users', {
      queryStringParameters: req.query
    });
    res.json(users);
  } catch (error) {
    console.error('Error managing users:', error);
    res.status(500).json({ error: 'Error managing users' });
  }
};

export const hayatManageFlightSources = async (req: Request, res: Response) => {
  try {
    const sources = await API.get('hayatAdminAPI', '/flight-sources', {
      queryStringParameters: req.query
    });
    res.json(sources);
  } catch (error) {
    console.error('Error managing flight sources:', error);
    res.status(500).json({ error: 'Error managing flight sources' });
  }
}; 