import { Model } from 'aws-amplify';

export class FlightSource extends Model {
  static classType = 'FlightSource';

  constructor(init: Partial<FlightSource>) {
    super(init);
  }

  static schema = {
    name: 'FlightSource',
    fields: {
      id: { type: 'ID', required: true },
      name: { type: 'String', required: true },
      type: { type: 'String', required: true }, // e.g., 'DIRECT_API', 'GDS', 'AGGREGATOR'
      isActive: { type: 'Boolean', required: true },
    },
  };
}
