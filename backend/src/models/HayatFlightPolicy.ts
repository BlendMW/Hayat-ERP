export class HayatFlightPolicy {
  static classType = 'FlightPolicy';

  id: string;
  flightId: string;
  isRefundable: boolean;
  cancellationFee: number;
  modificationFee: number;
  deadlineHours: number; // Declare deadlineHours property

  constructor(init: Partial<HayatFlightPolicy>) {
    this.id = init.id || '';
    this.flightId = init.flightId || '';
    this.isRefundable = init.isRefundable || false;
    this.cancellationFee = init.cancellationFee || 0;
    this.modificationFee = init.modificationFee || 0;
    this.deadlineHours = init.deadlineHours || 0; // Initialize deadlineHours
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

  async save(): Promise<void> {
    console.log(`Flight policy ${this.id} saved with deadline hours: ${this.deadlineHours}`);
  }

  static async get(id: string): Promise<HayatFlightPolicy | null> {
    return null; // Placeholder for actual data retrieval logic
  }
}
