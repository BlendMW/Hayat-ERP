import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateModificationData, handleError, validateFlightPolicyData } from '../utils/errorHandling';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await controller.getBooking(req.params.id);
    res.json(booking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/bookings/:id/modify', async (req, res) => {
  try {
    validateModificationData(req.body);
    const updatedBooking = await controller.modifyBooking(req.params.id, req.body);
    res.json(updatedBooking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/bookings/:id/cancel', async (req, res) => {
  try {
    const result = await controller.cancelBooking(req.params.id);
    res.json(result);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

// New route for admin to manage flight policies
router.get('/flight-policies', requireRole('Admin'), async (req, res) => {
  try {
    const policies = await controller.getFlightPolicies();
    res.json(policies);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/flight-policies', requireRole('Admin'), async (req, res) => {
  try {
    validateFlightPolicyData(req.body);
    const newPolicy = await controller.createFlightPolicy(req.body);
    res.status(201).json(newPolicy);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/flight-policies/:id', requireRole('Admin'), async (req, res) => {
  try {
    validateFlightPolicyData(req.body);
    const updatedPolicy = await controller.updateFlightPolicy(req.params.id, req.body);
    res.json(updatedPolicy);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
