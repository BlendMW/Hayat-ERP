import express from 'express';
import { hayatAuthenticate, hayatAuthorize } from '../hayatMiddleware/hayatAuth';
import { hayatSearchFlights, hayatBookFlight, hayatManageAccount } from '../hayatControllers/hayatB2bController';

const hayatRouter = express.Router();

// HayatB2BRoutes: Routes for Hayat B2B portal
hayatRouter.use(hayatAuthenticate);
hayatRouter.use(hayatAuthorize(['b2b']));

hayatRouter.post('/search', hayatSearchFlights);
hayatRouter.post('/book', hayatBookFlight);
hayatRouter.get('/manage', hayatManageAccount);

export default hayatRouter;
