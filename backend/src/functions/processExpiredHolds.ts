import { Handler } from 'aws-lambda';
import { HayatHoldTimer } from '../models/HayatHoldTimer';
import { HayatBooking } from '../models/HayatBooking';
import { sendNotification } from '../services/hayatNotificationService';
import { NotificationData } from '../types/NotificationData'; // Implied import for NotificationData

export const handler: Handler = async () => {
    const now = new Date();
    const expiredHolds = await HayatHoldTimer.scan({
      expiresAt: {
        lt: now.toISOString(),
      },
    });

  for (const hold of expiredHolds) {
    const booking = await HayatBooking.get(hold.bookingId);
    if (booking && booking.status === 'RESERVED') {
      booking.status = 'CANCELLED';
      await booking.save();

      // Send notification to user
      const notificationData: NotificationData = {
        userId: booking.userId,
        id: 'some-id', // Add a unique identifier
        type: 'some-type', // Specify the type of notification
        content: 'some-content', // Provide the content of the notification
        channelId: 'some-channel-id', // Specify the channel ID
        status: 'PENDING' as const, // Use the exact string literal
      };
      await sendNotification(notificationData);
    }

    // Remove the expired hold timer
    await hold.delete();
  }
};
