import { Router } from 'express';
import { hayatAuthenticate, hayatAuthorize } from '../hayatMiddleware/hayatAuth';
import { hayatSearchFlights, hayatBookFlight, hayatManageAccount } from '../hayatControllers/hayatB2bController';

const router = Router();

// Search flights - requires authentication
router.get('/flights', hayatAuthenticate, hayatSearchFlights);

// Book flight - requires authentication and B2B role
router.post('/bookings', 
  hayatAuthenticate, 
  hayatAuthorize(['B2B_USER', 'B2B_ADMIN']), 
  hayatBookFlight
);

// Manage account - requires authentication and admin role
router.put('/account', 
  hayatAuthenticate, 
  hayatAuthorize(['B2B_ADMIN']), 
  hayatManageAccount
);

export default router;
