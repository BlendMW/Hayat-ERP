import { Model } from 'aws-amplify';

export class AncillaryService extends Model {
  static classType = 'AncillaryService';

  constructor(init: Partial<AncillaryService>) {
    super(init);
  }

  static schema = {
    name: 'AncillaryService',
    fields: {
      id: { type: 'ID', required: true },
      name: { type: 'String', required: true },
      description: { type: 'String', required: false },
      price: { type: 'Float', required: true },
      type: { type: 'String', required: true }, // e.g., 'BAGGAGE', 'MEAL', 'INSURANCE'
      flightId: { type: 'ID', required: false }, // Optional, for flight-specific services
    },
  };
}
