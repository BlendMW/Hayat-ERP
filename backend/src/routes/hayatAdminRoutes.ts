import { Router } from 'express';
import { hayatAuthenticate, hayatAuthorize } from '../hayatMiddleware/hayatAuth';
import { 
  hayatManageTenants, 
  hayatManageUsers, 
  hayatManageFlightSources 
} from '../hayatControllers/hayatAdminController';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(hayatAuthenticate, hayatAuthorize(['ADMIN']));

// Tenant management
router.get('/tenants', hayatManageTenants);
router.post('/tenants', hayatManageTenants);
router.put('/tenants/:id', hayatManageTenants);
router.delete('/tenants/:id', hayatManageTenants);

// User management
router.get('/users', hayatManageUsers);
router.post('/users', hayatManageUsers);
router.put('/users/:id', hayatManageUsers);
router.delete('/users/:id', hayatManageUsers);

// Flight source management
router.get('/flight-sources', hayatManageFlightSources);
router.post('/flight-sources', hayatManageFlightSources);
router.put('/flight-sources/:id', hayatManageFlightSources);
router.delete('/flight-sources/:id', hayatManageFlightSources);

export default router;
