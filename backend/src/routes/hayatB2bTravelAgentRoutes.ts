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

hayatRouter.use(hayatAuthorize(['hayat_b2b_travel_agent']));

hayatRouter.post('/hayat-search', hayatSearchFlights);
hayatRouter.post('/hayat-book', hayatBookFlight);
hayatRouter.get('/hayat-manage-clients', hayatManageClients);
hayatRouter.get('/hayat-commissions', hayatTrackCommissions);
hayatRouter.post('/hayat-custom-itinerary', hayatCreateCustomItinerary);

export default hayatRouter;
