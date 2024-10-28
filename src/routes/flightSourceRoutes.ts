import express from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { FlightSource } from '../types/flightSource';
import { FlightProvider } from '../../providers/flightProvider';

const router = express.Router();

router.get('/flight-sources', (req: AuthenticatedRequest, res: express.Response) => {
  const tenantId = req.user.attributes['custom:tenant'];
  // ... rest of the route handler
});

router.post('/flight-sources', (req: AuthenticatedRequest, res: express.Response) => {
  // ... existing code ...
  const newFlightSource: Partial<FlightSource> = {
    // ... other properties ...
    tenantId: req.user.attributes['custom:tenant'],
  };
  // ... rest of the route handler
});

export default router;
