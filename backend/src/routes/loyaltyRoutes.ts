import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateLoyaltyProgramData, handleError } from '../utils/errorHandling';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.get('/loyalty-program', async (req, res) => {
  try {
    const tenantId = req.user.attributes['custom:tenant'];
    const program = await controller.getLoyaltyProgram(tenantId);
    res.json(program);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/loyalty-program', async (req, res) => {
  try {
    validateLoyaltyProgramData(req.body);
    const tenantId = req.user.attributes['custom:tenant'];
    const updatedProgram = await controller.updateLoyaltyProgram(tenantId, req.body);
    res.json(updatedProgram);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/loyalty-points', async (req, res) => {
  try {
    const points = await controller.getUserLoyaltyPoints(req.user.id);
    res.json({ points });
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/redeem-points', async (req, res) => {
  try {
    const { points, description } = req.body;
    const remainingPoints = await controller.redeemLoyaltyPoints(req.user.id, points, description);
    res.json({ remainingPoints });
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/loyalty-transactions', async (req, res) => {
  try {
    const transactions = await controller.getLoyaltyTransactions(req.user.id);
    res.json(transactions);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
