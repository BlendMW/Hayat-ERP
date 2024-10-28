export class HayatUser extends Model {
  static classType = 'User';

  id: string;               // Explicitly add id property
  email: string;
  tenantId: string;
  loyaltyPoints: number;

  constructor(init: Partial<HayatUser>) {
    super(init);
    this.id = init.id || '';               // Initialize id with a default
    this.email = init.email || '';
    this.tenantId = init.tenantId || '';
    this.loyaltyPoints = init.loyaltyPoints || 0;
  }

  async save(): Promise<void> {
    console.log(`User ${this.id} saved with email ${this.email}.`);
    // Add save logic here, e.g., API call
  }

  static schema = {
    name: 'User',
    fields: {
      id: { type: 'ID', required: true },
      email: { type: 'String', required: true },
      tenantId: { type: 'ID', required: true },
      loyaltyPoints: { type: 'Int', required: true },
    },
  };

  static async get(id: string): Promise<HayatUser | null> {
    return null; // Placeholder for actual data retrieval logic
  }
}
