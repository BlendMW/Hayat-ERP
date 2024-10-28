import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateTenantData, validateWalletData, handleError } from '../utils/errorHandling';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.get('/tenant', async (req, res) => {
  try {
    const tenant = await controller.getTenant(req.user.attributes['custom:tenant']);
    res.json(tenant);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/tenant', requireRole('TenantAdmin'), async (req, res) => {
  try {
    validateTenantData(req.body);
    const updatedTenant = await controller.updateTenant(req.user.attributes['custom:tenant'], req.body);
    res.json(updatedTenant);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/wallet', requireRole('TenantAdmin'), async (req, res) => {
  try {
    const wallet = await controller.getWallet(req.user.attributes['custom:tenant']);
    res.json(wallet);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/wallet', requireRole('TenantAdmin'), async (req, res) => {
  try {
    validateWalletData(req.body);
    const updatedWallet = await controller.updateWallet(req.user.attributes['custom:tenant'], req.body);
    res.json(updatedWallet);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
