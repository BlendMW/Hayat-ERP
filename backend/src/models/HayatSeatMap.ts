export class HayatSeatMap extends Model {
  static classType = 'SeatMap';

  id: string;
  flightId: string;
  rows: number;
  columns: string;
  unavailableSeats?: string[];
  seatPrices: Record<string, number>; // Assuming seat prices are stored as key-value pairs
  lockedSeats: string[]; // Declare lockedSeats as an array of strings

  constructor(init: Partial<HayatSeatMap>) {
    super(init);
    this.id = init.id || '';
    this.flightId = init.flightId || '';
    this.rows = init.rows || 0;
    this.columns = init.columns || '';
    this.unavailableSeats = init.unavailableSeats || [];
    this.seatPrices = init.seatPrices || {};
    this.lockedSeats = init.lockedSeats || []; // Initialize lockedSeats as an empty array if not provided
  }

  async save(): Promise<void> {
    console.log(`SeatMap ${this.id} saved with locked seats: ${this.lockedSeats.join(', ')}.`);
  }

  static async get(id: string): Promise<HayatSeatMap | null> {
    return null; // Placeholder for actual data retrieval logic
  }

  static async query(criteria: any): Promise<HayatSeatMap[]> {
    return []; // Placeholder for actual data retrieval logic
  }

  static async scan(): Promise<HayatSeatMap[]> {
    return []; // Placeholder for actual data retrieval logic
  }

  static schema = {
    name: 'SeatMap',
    fields: {
      id: { type: 'ID', required: true },
      flightId: { type: 'ID', required: true },
      rows: { type: 'Int', required: true },
      columns: { type: 'String', required: true },
      unavailableSeats: { type: ['String'], required: false },
      seatPrices: { type: 'AWSJSON', required: true },
      lockedSeats: { type: ['String'], required: false }, // Define lockedSeats in schema as an array of strings
    },
  };
}
