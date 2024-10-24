import { Handler } from 'aws-lambda';
import { Notification } from '../models/Notification';
import { sendNotification } from '../services/notificationService';

export const handler: Handler = async () => {
  const now = new Date();
  const pendingNotifications = await Notification.scan({
    filter: {
      status: { eq: 'PENDING' },
      scheduledFor: { lte: now.toISOString() },
    },
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
