import { Model } from 'aws-amplify';

export class HoldTimer extends Model {
  static classType = 'HoldTimer';

  constructor(init: Partial<HoldTimer>) {
    super(init);
  }

  static schema = {
    name: 'HoldTimer',
    fields: {
      id: { type: 'ID', required: true },
      bookingId: { type: 'ID', required: true },
      expiresAt: { type: 'AWSDateTime', required: true },
    },
  };
}
