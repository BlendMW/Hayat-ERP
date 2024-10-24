import { Model } from 'aws-amplify';

export class CharterFlight extends Model {
  static classType = 'CharterFlight';

  constructor(init: Partial<CharterFlight>) {
    super(init);
  }

  static schema = {
    name: 'CharterFlight',
    fields: {
      id: { type: 'ID', required: true },
      flightNumber: { type: 'String', required: true },
      departureAirport: { type: 'String', required: true },
      arrivalAirport: { type: 'String', required: true },
      departureTime: { type: 'AWSDateTime', required: true },
      arrivalTime: { type: 'AWSDateTime', required: true },
      capacity: { type: 'Int', required: true },
      availableSeats: { type: 'Int', required: true },
      basePrice: { type: 'Float', required: true },
    },
  };
}
