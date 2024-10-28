import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateFlightSourceData, validateSourcePriorityData, handleError } from '../utils/errorHandling';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.get('/flight-sources', async (req, res) => {
  try {
    const sources = await controller.getFlightSources();
    res.json(sources);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/flight-sources', async (req, res) => {
  try {
    validateFlightSourceData(req.body);
    const newSource = await controller.createFlightSource(req.body);
    res.status(201).json(newSource);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/flight-sources/:id', async (req, res) => {
  try {
    validateFlightSourceData(req.body);
    const updatedSource = await controller.updateFlightSource(req.params.id, req.body);
    res.json(updatedSource);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/source-priorities', async (req, res) => {
  try {
    const tenantId = req.user.attributes['custom:tenant'];
    const priorities = await controller.getSourcePriorities(tenantId);
    res.json(priorities);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/source-priorities', async (req, res) => {
  try {
    validateSourcePriorityData(req.body);
    const newPriority = await controller.createSourcePriority({
      ...req.body,
      tenantId: req.user.attributes['custom:tenant'],
    });
    res.status(201).json(newPriority);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/source-priorities/:id', async (req, res) => {
  try {
    validateSourcePriorityData(req.body);
    const updatedPriority = await controller.updateSourcePriority(req.params.id, req.body);
    res.json(updatedPriority);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
