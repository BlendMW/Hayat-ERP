import { Model } from 'aws-amplify';

export class Notification extends Model {
  static classType = 'Notification';

  constructor(init: Partial<Notification>) {
    super(init);
  }

  static schema = {
    name: 'Notification',
    fields: {
      id: { type: 'ID', required: true },
      userId: { type: 'ID', required: true },
      type: { type: 'String', required: true }, // e.g., 'BOOKING_CONFIRMATION', 'FLIGHT_UPDATE', 'REMINDER'
      content: { type: 'String', required: true },
      status: { type: 'String', required: true }, // e.g., 'PENDING', 'SENT', 'FAILED'
      sentAt: { type: 'AWSDateTime', required: false },
      channelId: { type: 'ID', required: true },
    },
  };
}
