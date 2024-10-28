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

hayatRouter.use(hayatAuthorize(['hayat_b2b_corporate']));

hayatRouter.post('/hayat-search', hayatSearchFlights);
hayatRouter.post('/hayat-bulk-book', hayatBulkBookFlights);
hayatRouter.get('/hayat-manage', hayatManageCorporateAccount);
hayatRouter.get('/hayat-invoices', hayatGetCorporateInvoices);
hayatRouter.get('/hayat-bulk-itineraries', hayatGetBulkItineraries);
hayatRouter.post('/hayat-customize-dashboard', hayatCustomizeDashboard);

export default hayatRouter;
