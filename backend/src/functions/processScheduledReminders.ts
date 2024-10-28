// processExpiredHolds.ts
import { Handler } from 'aws-lambda';
import { HayatBooking } from '../models/HayatBooking';
import { sendReminderNotification } from '../services/hayatNotificationService';

export const handler: Handler = async () => {
  const now = new Date();
  const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Retrieve upcoming bookings scheduled within the next 24 hours and that haven't been sent a reminder
  const upcomingBookings = await HayatBooking.scan({
    departureTime: { between: [now.toISOString(), twentyFourHoursLater.toISOString()] },
    reminderSent: { eq: false },
  });

  for (const booking of upcomingBookings) {
    const departureTime = new Date(booking.departureTime);
    const hoursUntilDeparture = Math.round((departureTime.getTime() - now.getTime()) / (1000 * 60 * 60));

    await sendReminderNotification(booking.userId, booking.id, hoursUntilDeparture);

    booking.reminderSent = true;
    await booking.save();
  }
};
