import express from 'express';
import { HayatB2bCorporateController } from '../hayatControllers/hayatB2bCorporateController';
import { validateNotificationData, validateCommunicationChannelData, handleError } from '../utils/errorHandling';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const controller = new HayatB2bCorporateController();

router.use(authMiddleware);

router.get('/notifications', async (req, res) => {
  try {
    const notifications = await controller.getNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.get('/communication-channels', async (req, res) => {
  try {
    const channels = await controller.getCommunicationChannels(req.user.id);
    res.json(channels);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.post('/communication-channels', async (req, res) => {
  try {
    validateCommunicationChannelData(req.body);
    const newChannel = await controller.createCommunicationChannel({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(newChannel);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

router.put('/communication-channels/:id', async (req, res) => {
  try {
    validateCommunicationChannelData(req.body);
    const updatedChannel = await controller.updateCommunicationChannel(req.params.id, req.body);
    res.json(updatedChannel);
  } catch (error) {
    const errorResponse = handleError(error);
    res.status(errorResponse.statusCode).json(JSON.parse(errorResponse.body));
  }
});

export default router;
