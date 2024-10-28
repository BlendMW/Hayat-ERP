import { Model } from '@aws-amplify/datastore';

export class HayatMetaSearchResult extends Model {
  static classType = 'MetaSearchResult';

  id: string;
  searchId: string;
  provider: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  deepLink: string;
  affiliateCommission?: number;

  constructor(init: Partial<HayatMetaSearchResult>) {
    super(init); // Initialize Model with the provided data
    this.id = init.id || '';
    this.searchId = init.searchId || '';
    this.provider = init.provider || '';
    this.flightNumber = init.flightNumber || '';
    this.departureAirport = init.departureAirport || '';
    this.arrivalAirport = init.arrivalAirport || '';
    this.departureTime = init.departureTime || '';
    this.arrivalTime = init.arrivalTime || '';
    this.price = init.price || 0;
    this.deepLink = init.deepLink || '';
    this.affiliateCommission = init.affiliateCommission;
  }

  async save(): Promise<void> {
    console.log(`Saving MetaSearchResult with ID: ${this.id}`);
    // Include actual save logic here if using a data store
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
