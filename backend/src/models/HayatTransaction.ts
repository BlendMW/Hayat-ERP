export class HayatTransaction {
  static classType = 'Transaction';

  id: string;
  userId: string;
  type: 'EARN' | 'REDEEM';
  points: number;
  bookingId?: string;
  description: string;
  createdAt: string;
  expiresAt: string;

  constructor(init: Partial<HayatTransaction>) {
    this.id = init.id || ''; // Default empty string if not provided
    this.userId = init.userId || ''; // Default empty string if not provided
    this.type = init.type || 'EARN'; // Default type 'EARN'
    this.points = init.points || 0; // Default to 0 points
    this.bookingId = init.bookingId;
    this.description = init.description || '';
    this.createdAt = init.createdAt || new Date().toISOString();
    this.expiresAt = init.expiresAt || new Date().toISOString();
  }

  async save(): Promise<void> {
    console.log(`Transaction ${this.id} saved with type ${this.type}.`);
    // Implement actual save logic here
  }

  static async query(criteria: { userId?: string; type?: string }): Promise<HayatTransaction[]> {
    // Example query logic with criteria matching
    const mockData = [
      new HayatTransaction({
        id: 'trans1',
        userId: 'user1',
        type: 'EARN',
        points: 100,
        description: 'Earned points for booking',
        createdAt: '2024-10-27T12:00:00Z',
        expiresAt: '2025-10-27T12:00:00Z',
      }),
    ];
    return mockData.filter(transaction => {
      const userIdMatches = criteria.userId ? transaction.userId === criteria.userId : true;
      const typeMatches = criteria.type ? transaction.type === criteria.type : true;
      return userIdMatches && typeMatches;
    });
  }

  static async get(id: string): Promise<HayatTransaction | null> {
    const mockTransaction = new HayatTransaction({
      id,
      userId: 'user1',
      type: 'EARN',
      points: 100,
      description: 'Fetched transaction',
      createdAt: '2024-10-27T12:00:00Z',
      expiresAt: '2025-10-27T12:00:00Z',
    });
    return mockTransaction.id === id ? mockTransaction : null;
  }

  static async scan(filter?: any): Promise<HayatTransaction[]> {
    return []; // Placeholder for actual scan implementation
  }

  static async create(data: Partial<HayatTransaction>): Promise<HayatTransaction> {
    return new HayatTransaction(data); // Placeholder implementation
  }

  static schema = {
    name: 'Transaction',
    fields: {
      id: { type: 'ID', required: true },
      userId: { type: 'ID', required: true },
      type: { type: 'String', required: true }, // 'EARN' or 'REDEEM'
      points: { type: 'Int', required: true },
      bookingId: { type: 'ID', required: false },
      description: { type: 'String', required: true },
      createdAt: { type: 'AWSDateTime', required: true },
      expiresAt: { type: 'AWSDateTime', required: true },
    },
  };
}
