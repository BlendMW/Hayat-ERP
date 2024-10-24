import { Model } from 'aws-amplify';

export class FlightPolicy extends Model {
  static classType = 'FlightPolicy';

  constructor(init: Partial<FlightPolicy>) {
    super(init);
  }

  static schema = {
    name: 'FlightPolicy',
    fields: {
      id: { type: 'ID', required: true },
      flightId: { type: 'ID', required: true },
      isRefundable: { type: 'Boolean', required: true },
      cancellationFee: { type: 'Float', required: true },
      modificationFee: { type: 'Float', required: true },
      deadlineHours: { type: 'Int', required: true }, // Hours before departure for free cancellation/modification
    },
  };
}
