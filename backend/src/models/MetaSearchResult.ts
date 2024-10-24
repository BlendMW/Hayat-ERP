import { Model } from 'aws-amplify';

export class MetaSearchResult extends Model {
  static classType = 'MetaSearchResult';

  constructor(init: Partial<MetaSearchResult>) {
    super(init);
  }

  static schema = {
    name: 'MetaSearchResult',
    fields: {
      id: { type: 'ID', required: true },
      searchId: { type: 'ID', required: true },
      provider: { type: 'String', required: true },
      flightNumber: { type: 'String', required: true },
      departureAirport: { type: 'String', required: true },
      arrivalAirport: { type: 'String', required: true },
      departureTime: { type: 'AWSDateTime', required: true },
      arrivalTime: { type: 'AWSDateTime', required: true },
      price: { type: 'Float', required: true },
      deepLink: { type: 'String', required: true },
      affiliateCommission: { type: 'Float', required: false },
    },
  };
}
