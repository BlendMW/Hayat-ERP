import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateSeatMapData, validateAncillaryServiceData, handleError } from '../utils/errorHandling';
import { authMiddleware, requireRole } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.get('/seat-map/:flightId', async (req, res) => {
  try {
    const seatMap = await controller.getSeatMap(req.params.flightId);
    res.json(seatMap);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/seat-map/:flightId', requireRole('Admin'), async (req, res) => {
  try {
    validateSeatMapData(req.body);
    const updatedSeatMap = await controller.updateSeatMap(req.params.flightId, req.body);
    res.json(updatedSeatMap);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/ancillary-services', async (req, res) => {
  try {
    const services = await controller.getAncillaryServices(req.query.flightId as string | undefined);
    res.json(services);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/ancillary-services', requireRole('Admin'), async (req, res) => {
  try {
    validateAncillaryServiceData(req.body);
    const newService = await controller.createAncillaryService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/ancillary-services/:id', requireRole('Admin'), async (req, res) => {
  try {
    validateAncillaryServiceData(req.body);
    const updatedService = await controller.updateAncillaryService(req.params.id, req.body);
    res.json(updatedService);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
