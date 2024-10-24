import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateReservationData, handleError } from '../utils/errorHandling';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.post('/reserve-flight', async (req, res) => {
  try {
    validateReservationData(req.body);
    const { flightId, holdDurationMinutes } = req.body;
    const booking = await controller.reserveFlight(req.user.id, flightId, holdDurationMinutes);
    res.status(201).json(booking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/reservations/:reservationId/confirm', async (req, res) => {
  try {
    const booking = await controller.confirmBooking(req.params.reservationId);
    res.json(booking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/reservations/:reservationId/cancel', async (req, res) => {
  try {
    const booking = await controller.cancelReservation(req.params.reservationId);
    res.json(booking);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/reservations', async (req, res) => {
  try {
    const reservations = await controller.getUserReservations(req.user.id);
    res.json(reservations);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
