import express from 'express';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import hayatB2cRoutes from './hayatRoutes/hayatB2cRoutes';
import hayatB2bCorporateRoutes from './hayatRoutes/hayatB2bCorporateRoutes';
import hayatB2bTravelAgentRoutes from './hayatRoutes/hayatB2bTravelAgentRoutes';
import hayatB2eRoutes from './hayatRoutes/hayatB2eRoutes';
import hayatAdminRoutes from './hayatRoutes/hayatAdminRoutes';
import { hayatAuthMiddleware } from './hayatMiddleware/hayatAuthMiddleware';

Amplify.configure(awsconfig);

const hayatApp = express();

hayatApp.use(express.json());
hayatApp.use(hayatAuthMiddleware);

// HayatApp: Main application setup for Hayat multi-tenant system
hayatApp.use('/api/hayat/b2c', hayatB2cRoutes);
hayatApp.use('/api/hayat/b2b/corporate', hayatB2bCorporateRoutes);
hayatApp.use('/api/hayat/b2b/travel-agent', hayatB2bTravelAgentRoutes);
hayatApp.use('/api/hayat/b2e', hayatB2eRoutes);
hayatApp.use('/api/hayat/admin', hayatAdminRoutes);

export default hayatApp;
