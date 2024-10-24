import { Model } from 'aws-amplify';

export class Transaction extends Model {
  static classType = 'Transaction';

  constructor(init: Partial<Transaction>) {
    super(init);
  }

  static schema = {
    name: 'Transaction',
    fields: {
      id: { type: 'ID', required: true },
      userId: { type: 'ID', required: true },
      type: { type: 'String', required: true }, // 'EARN' or 'REDEEM'
      points: { type: 'Int', required: true },
      bookingId: { type: 'ID', required: false },
      description: { type: 'String', required: true },
      createdAt: { type: 'AWSDateTime', required: true },
      expiresAt: { type: 'AWSDateTime', required: true },
    },
  };
}
