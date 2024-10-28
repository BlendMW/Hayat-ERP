export class HayatRefund extends Model {
  static classType = 'Refund';

  id: string;
  bookingId: string;
  amount: number;
  status: string;
  type: string;
  reason?: string;
  processedAt?: string;
  paymentId?: string; // Declare paymentId as an optional property

  constructor(init: Partial<HayatRefund>) {
    super(init);
    this.id = init.id || '';
    this.bookingId = init.bookingId || '';
    this.amount = init.amount || 0;
    this.status = init.status || 'PENDING';
    this.type = init.type || 'FULL';
    this.reason = init.reason;
    this.processedAt = init.processedAt;
    this.paymentId = init.paymentId; // Initialize paymentId from init
  }

  static schema = {
    name: 'Refund',
    fields: {
      id: { type: 'ID', required: true },
      bookingId: { type: 'ID', required: true },
      amount: { type: 'Float', required: true },
      status: { type: 'String', required: true }, // e.g., 'PENDING', 'PROCESSED', 'REJECTED'
      type: { type: 'String', required: true },   // e.g., 'FULL', 'PARTIAL', 'VOUCHER'
      reason: { type: 'String', required: false },
      processedAt: { type: 'AWSDateTime', required: false },
      paymentId: { type: 'ID', required: false }, // Define paymentId in schema
    },
  };

  async save(): Promise<void> {
    console.log(`Refund ${this.id} status updated to ${this.status}, amount: ${this.amount}.`);
    // Add actual save logic here if needed
  }

  static async get(id: string): Promise<HayatRefund | null> {
    return null; // Placeholder for actual data retrieval logic
  }
}
