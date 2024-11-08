import { Request, Response } from 'express';
import { API } from 'aws-amplify';

export const hayatSearchFlights = async (req: Request, res: Response) => {
  try {
    const flights = await API.get('hayatFlightAPI', '/flights', {
      queryStringParameters: req.query
    });
    res.json(flights);
  } catch (error) {
    console.error('Error searching flights:', error);
    res.status(500).json({ error: 'Error searching flights' });
  }
};

export const hayatBookFlight = async (req: Request, res: Response) => {
  try {
    const booking = await API.post('hayatBookingAPI', '/bookings', {
      body: req.body
    });
    res.json(booking);
  } catch (error) {
    console.error('Error booking flight:', error);
    res.status(500).json({ error: 'Error booking flight' });
  }
};

export const hayatManageAccount = async (req: Request, res: Response) => {
  try {
    const account = await API.put('hayatAccountAPI', '/account', {
      body: req.body
    });
    res.json(account);
  } catch (error) {
    console.error('Error managing account:', error);
    res.status(500).json({ error: 'Error managing account' });
  }
}; 