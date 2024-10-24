import { Model } from 'aws-amplify';

export class LoyaltyProgram extends Model {
  static classType = 'LoyaltyProgram';

  constructor(init: Partial<LoyaltyProgram>) {
    super(init);
  }

  static schema = {
    name: 'LoyaltyProgram',
    fields: {
      id: { type: 'ID', required: true },
      tenantId: { type: 'ID', required: true },
      name: { type: 'String', required: true },
      pointsPerCurrency: { type: 'Float', required: true },
      expirationMonths: { type: 'Int', required: true },
    },
  };
}
