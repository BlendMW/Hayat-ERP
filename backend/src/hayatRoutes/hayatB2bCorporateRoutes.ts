import express from 'express';
import { hayatAuthorize } from '../hayatMiddleware/hayatAuth';
import {
  hayatSearchFlights,
  hayatBulkBookFlights,
  hayatManageCorporateAccount,
  hayatGetCorporateInvoices,
  hayatGetBulkItineraries,
  hayatCustomizeDashboard
} from '../hayatControllers/hayatB2bCorporateController';

const hayatRouter = express.Router();

hayatRouter.use(hayatAuthorize(['b2b_corporate']));

hayatRouter.post('/search', hayatSearchFlights);
hayatRouter.post('/bulk-book', hayatBulkBookFlights);
hayatRouter.get('/manage', hayatManageCorporateAccount);
hayatRouter.get('/invoices', hayatGetCorporateInvoices);
hayatRouter.get('/bulk-itineraries', hayatGetBulkItineraries);
hayatRouter.post('/customize-dashboard', hayatCustomizeDashboard);

export default hayatRouter;
