// import { Model } from '@aws-amplify/datastore';

export class HayatBooking {
  static classType = 'Booking';

  id: string;
  userId: string;
  flightId: string;
  status: string;
  departureTime: string;
  reminderSent: boolean;
  holdExpiresAt: string;
  isRefundable: boolean;
  totalPrice: number; // Declare totalPrice property
  bookingId: string; // Declare bookingId property
  paymentId: string; // Declare paymentId property

  constructor(init: Partial<HayatBooking>) {
    this.id = init.id || '';
    this.userId = init.userId || '';
    this.flightId = init.flightId || '';
    this.status = init.status || '';
    this.departureTime = init.departureTime || '';
    this.reminderSent = init.reminderSent || false;
    this.holdExpiresAt = init.holdExpiresAt || '';
    this.isRefundable = init.isRefundable || false;
    this.totalPrice = init.totalPrice || 0; // Initialize totalPrice
    this.bookingId = init.bookingId || ''; // Initialize bookingId
    this.paymentId = init.paymentId || ''; // Initialize paymentId
  }

  static schema = {
    name: 'Booking',
    fields: {
      id: { type: 'ID', required: true },
      userId: { type: 'ID', required: true },
      flightId: { type: 'ID', required: true },
      status: { type: 'String', required: true },
      departureTime: { type: 'AWSDateTime', required: true },
      reminderSent: { type: 'Boolean', required: true },
      holdExpiresAt: { type: 'AWSDateTime', required: false },
      totalPrice: { type: 'Float', required: true }, // Add totalPrice to schema
      bookingId: { type: 'ID', required: true }, // Add bookingId to schema
    },
  };

  async save(): Promise<void> {
    console.log(`Booking ${this.id} status updated to ${this.status}, with total price ${this.totalPrice}.`);
  }

  static async get(id: string): Promise<HayatBooking | null> {
    return null; // Placeholder for actual data retrieval
  }

  static async query(criteria: any): Promise<HayatBooking[]> {
    return []; // Placeholder for actual implementation
  }

  static async delete(id: string): Promise<void> {
    // Implement delete logic if needed
  }

  static async update(id: string, data: Partial<HayatBooking>): Promise<HayatBooking | null> {
    return null; // Placeholder for actual update logic
  }

  static async create(data: Partial<HayatBooking>): Promise<HayatBooking> {
    return new HayatBooking(data); // Placeholder implementation
  }

  static async scan(filter: { departureTime?: { between: [string, string] }, reminderSent?: { eq: boolean } }): Promise<HayatBooking[]> {
    return []; // Placeholder for mock data
  }

  static async filter(criteria: Partial<HayatBooking>): Promise<HayatBooking[]> {
    return []; // Placeholder for actual filter logic
  }
}
