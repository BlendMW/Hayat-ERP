import { Model } from 'aws-amplify';

export class Tenant extends Model {
  static classType = 'Tenant';

  constructor(init: Partial<Tenant>) {
    super(init);
  }

  static schema = {
    name: 'Tenant',
    fields: {
      id: { type: 'ID', required: true },
      name: { type: 'String', required: true },
      domain: { type: 'String', required: true },
      logo: { type: 'String', required: false },
      primaryColor: { type: 'String', required: false },
      secondaryColor: { type: 'String', required: false },
      flightSourcePriorities: { type: 'AWSJSON', required: false },
      bookingRules: { type: 'AWSJSON', required: false },
    },
  };
}
