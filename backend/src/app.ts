import express from 'express';
import hayatFlightSourceRoutes from './routes/hayatFlightSourceRoutes';
import hayatAncillaryRoutes from './routes/hayatAncillaryRoutes';
import hayatBookingManagementRoutes from './routes/hayatBookingManagementRoutes';
import hayatNotificationRoutes from './routes/hayatNotificationRoutes';
import hayatLoyaltyRoutes from './routes/hayatLoyaltyRoutes';
import hayatMetaSearchRoutes from './routes/hayatMetaSearchRoutes';
import hayatTenantRoutes from './routes/hayatTenantRoutes';

// Add Hayat branding
const HAYAT_API_PREFIX = '/hayat/api/v1';

const hayatApp = express();

hayatApp.use(express.json());

// Update all route prefixes with Hayat branding
hayatApp.use(`${HAYAT_API_PREFIX}/flight-sources`, hayatFlightSourceRoutes);
hayatApp.use(`${HAYAT_API_PREFIX}/ancillaries`, hayatAncillaryRoutes);
hayatApp.use(`${HAYAT_API_PREFIX}/booking-management`, hayatBookingManagementRoutes);
hayatApp.use(`${HAYAT_API_PREFIX}/notifications`, hayatNotificationRoutes);
hayatApp.use(`${HAYAT_API_PREFIX}/loyalty`, hayatLoyaltyRoutes);
hayatApp.use(`${HAYAT_API_PREFIX}/meta-search`, hayatMetaSearchRoutes);
hayatApp.use(`${HAYAT_API_PREFIX}/tenants`, hayatTenantRoutes);

// ... other existing routes and middleware

export default hayatApp;
