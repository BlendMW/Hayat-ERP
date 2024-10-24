import { Model } from 'aws-amplify';

export class PricingRule extends Model {
  static classType = 'PricingRule';

  constructor(init: Partial<PricingRule>) {
    super(init);
  }

  static schema = {
    name: 'PricingRule',
    fields: {
      id: { type: 'ID', required: true },
      charterFlightId: { type: 'ID', required: true },
      minAvailableSeats: { type: 'Int', required: true },
      maxAvailableSeats: { type: 'Int', required: true },
      priceMultiplier: { type: 'Float', required: true },
    },
  };
}
