import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateBookingData, handleError } from '../utils/errorHandling';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.post('/bookings', async (req, res) => {
  try {
    validateBookingData(req.body);
    const tenantId = req.user.attributes['custom:tenant'];
    const booking = await controller.createBooking(req.body, tenantId);
    res.status(201).json(booking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/bookings/:id', async (req, res) => {
  try {
    const booking = await controller.getBooking(req.params.id);
    if (booking.tenantId !== req.user.attributes['custom:tenant']) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(booking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/bookings/:id', requireRole('Admin'), async (req, res) => {
  try {
    validateBookingData(req.body);
    const updatedBooking = await controller.updateBooking(req.params.id, req.body);
    res.json(updatedBooking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

// ... other routes

export default router;
