import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { handleError } from '../utils/errorHandling';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.get('/meta-search', async (req, res) => {
  try {
    const results = await controller.performMetaSearch(req.query);
    res.json(results);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
