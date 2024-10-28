import { Handler } from 'aws-lambda';
import { HayatNotification } from '../models/HayatNotification';
import { sendNotification } from '../services/hayatNotificationService';

export const handler: Handler = async () => {
  const now = new Date();
  const pendingNotifications = await HayatNotification.scan({
    status: { eq: 'PENDING' },
    scheduledFor: { lte: now.toISOString() },
  });

  for (const notification of pendingNotifications) {
    try {
      await sendNotification(notification);
      notification.status = 'SENT';
      await notification.save();
    } catch (error) {
      console.error(`Error sending notification ${notification.id}:`, error);
      notification.status = 'FAILED';
      await notification.save();
    }
  }
};
