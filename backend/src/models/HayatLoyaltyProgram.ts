export class HayatLoyaltyProgram {
  static classType = 'LoyaltyProgram';

  id: string;
  tenantId: string;
  name: string;
  pointsPerCurrency: number; // Add pointsPerCurrency property
  expirationMonths: number;

  constructor(init: Partial<HayatLoyaltyProgram>) {
    this.id = init.id || '';
    this.tenantId = init.tenantId || '';
    this.name = init.name || '';
    this.pointsPerCurrency = init.pointsPerCurrency || 1; // Default to 1 if not provided
    this.expirationMonths = init.expirationMonths || 0;
  }

  async save(): Promise<void> {
    console.log(`Loyalty Program ${this.name} saved with ${this.pointsPerCurrency} points per currency.`);
  }

  static async create(data: Partial<HayatLoyaltyProgram>): Promise<HayatLoyaltyProgram> {
    return new HayatLoyaltyProgram(data);
  }

  static async query(criteria: any): Promise<HayatLoyaltyProgram[]> {
    return []; // Placeholder for actual data retrieval
  }

  static async get(id: string): Promise<HayatLoyaltyProgram | null> {
    return null; // Placeholder for actual data retrieval
  }

  static async scan(filter?: any): Promise<HayatLoyaltyProgram[]> {
    return []; // Placeholder for actual data retrieval
  }

  static schema = {
    name: 'LoyaltyProgram',
    fields: {
      id: { type: 'ID', required: true },
      tenantId: { type: 'ID', required: true },
      name: { type: 'String', required: true },
      pointsPerCurrency: { type: 'Float', required: true }, // Ensure pointsPerCurrency is in the schema
      expirationMonths: { type: 'Int', required: true },
    },
  };
}
