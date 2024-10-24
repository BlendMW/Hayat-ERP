import { Model } from 'aws-amplify';

export class Booking extends Model {
  static classType = 'Booking';

  constructor(init: Partial<Booking>) {
    super(init);
  }

  static schema = {
    name: 'Booking',
    fields: {
      id: { type: 'ID', required: true },
      userId: { type: 'ID', required: true },
      flightId: { type: 'ID', required: true },
      status: { type: 'String', required: true }, // 'RESERVED', 'CONFIRMED', 'CANCELLED'
      holdExpiresAt: { type: 'AWSDateTime', required: false },
      // ... other existing fields
    },
  };
}
