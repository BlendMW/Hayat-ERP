import { Handler } from 'aws-lambda';
import { HoldTimer } from '../models/HoldTimer';
import { Booking } from '../models/Booking';
import { sendNotification } from '../services/notificationService';

export const handler: Handler = async () => {
  const now = new Date();
  const expiredHolds = await HoldTimer.scan({
    filter: {
      expiresAt: {
        lt: now.toISOString(),
      },
    },
  });

  for (const hold of expiredHolds) {
    const booking = await Booking.get(hold.bookingId);
    if (booking.status === 'RESERVED') {
      booking.status = 'CANCELLED';
      await booking.save();

      // Send notification to user
      await sendNotification(booking.userId, 'HOLD_EXPIRED', `Your reservation for booking ${booking.id} has expired.`);
    }

    // Remove the expired hold timer
    await hold.delete();
  }
};
