import express from 'express';
import { hayatAuthorize } from '../hayatMiddleware/hayatAuth';
import {
  hayatSearchFlights,
  hayatBookFlight,
  hayatManageClients,
  hayatTrackCommissions,
  hayatCreateCustomItinerary
} from '../hayatControllers/hayatB2bTravelAgentController';

const hayatRouter = express.Router();

hayatRouter.use(hayatAuthorize(['b2b_travel_agent']));

hayatRouter.post('/search', hayatSearchFlights);
hayatRouter.post('/book', hayatBookFlight);
hayatRouter.get('/manage-clients', hayatManageClients);
hayatRouter.get('/commissions', hayatTrackCommissions);
hayatRouter.post('/custom-itinerary', hayatCreateCustomItinerary);

export default hayatRouter;
