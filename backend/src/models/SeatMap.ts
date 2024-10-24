import { Model } from 'aws-amplify';

export class SeatMap extends Model {
  static classType = 'SeatMap';

  constructor(init: Partial<SeatMap>) {
    super(init);
  }

  static schema = {
    name: 'SeatMap',
    fields: {
      id: { type: 'ID', required: true },
      flightId: { type: 'ID', required: true },
      rows: { type: 'Int', required: true },
      columns: { type: 'String', required: true }, // e.g., "ABCDEF"
      unavailableSeats: { type: ['String'], required: false },
      seatPrices: { type: 'AWSJSON', required: true }, // JSON object with seat prices
      lockedSeats: { type: ['String'], required: false },
    },
  };
}
