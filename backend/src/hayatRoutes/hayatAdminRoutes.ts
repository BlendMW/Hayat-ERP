import express from 'express';
import { hayatAuthorize } from '../hayatMiddleware/hayatAuth';
import {
  hayatMonitorTenantActivity,
  hayatManageTenants,
  hayatViewBookings,
  hayatGenerateReports
} from '../hayatControllers/hayatAdminController';

const hayatRouter = express.Router();

hayatRouter.use(hayatAuthorize(['admin']));

hayatRouter.get('/monitor-activity', hayatMonitorTenantActivity);
hayatRouter.get('/manage-tenants', hayatManageTenants);
hayatRouter.get('/view-bookings', hayatViewBookings);
hayatRouter.get('/generate-reports', hayatGenerateReports);

export default hayatRouter;
