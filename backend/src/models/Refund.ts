import { Model } from 'aws-amplify';

export class Refund extends Model {
  static classType = 'Refund';

  constructor(init: Partial<Refund>) {
    super(init);
  }

  static schema = {
    name: 'Refund',
    fields: {
      id: { type: 'ID', required: true },
      bookingId: { type: 'ID', required: true },
      amount: { type: 'Float', required: true },
      status: { type: 'String', required: true }, // e.g., 'PENDING', 'PROCESSED', 'REJECTED'
      type: { type: 'String', required: true }, // e.g., 'FULL', 'PARTIAL', 'VOUCHER'
      reason: { type: 'String', required: false },
      processedAt: { type: 'AWSDateTime', required: false },
    },
  };
}
