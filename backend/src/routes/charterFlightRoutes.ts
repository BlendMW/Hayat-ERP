import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateCharterFlightData, validatePricingRuleData, handleError } from '../utils/errorHandling';

const router = express.Router();
const controller = new HayatB2bCorporateController();

// Charter Flight routes
router.post('/charter-flights', async (req, res) => {
  try {
    validateCharterFlightData(req.body);
    const newFlight = await controller.createCharterFlight(req.body);
    res.status(201).json(newFlight);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/charter-flights/:id', async (req, res) => {
  try {
    const updatedFlight = await controller.updateCharterFlight(req.params.id, req.body);
    res.json(updatedFlight);
  } catch (error) {
    res.status(500).json({ error: 'Error updating charter flight' });
  }
});

router.get('/charter-flights', async (req, res) => {
  try {
    const flights = await controller.getCharterFlights();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching charter flights' });
  }
});

// Pricing Rule routes
router.post('/pricing-rules', async (req, res) => {
  try {
    validatePricingRuleData(req.body);
    const newRule = await controller.createPricingRule(req.body);
    res.status(201).json(newRule);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/pricing-rules/:id', async (req, res) => {
  try {
    const updatedRule = await controller.updatePricingRule(req.params.id, req.body);
    res.json(updatedRule);
  } catch (error) {
    res.status(500).json({ error: 'Error updating pricing rule' });
  }
});

router.get('/pricing-rules/:charterFlightId', async (req, res) => {
  try {
    const rules = await controller.getPricingRules(req.params.charterFlightId);
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pricing rules' });
  }
});

export default router;
