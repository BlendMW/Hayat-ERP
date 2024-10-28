
export class HayatTenant extends Model {
  static classType = 'Tenant';

  constructor(init: Partial<HayatTenant>) {
    super(init);
  }

  async save(): Promise<void> {
    // Implement the logic to save the instance to your data store
    // For example, using a hypothetical API call:
    // await api.saveHayatTenant(this);
  }

  static async query(criteria: any): Promise<HayatTenant[]> {
    return []; // Placeholder implementation
  }

  static async get(id: string): Promise<HayatTenant | null> {
    return null; // Placeholder implementation
  }

  static schema = {
    name: 'Tenant',
    fields: {
      id: { type: 'ID', required: true },
      name: { type: 'String', required: true },
      domain: { type: 'String', required: true },
      logo: { type: 'String', required: false },
      primaryColor: { type: 'String', required: false },
      secondaryColor: { type: 'String', required: false },
      flightSourcePriorities: { type: 'AWSJSON', required: false },
      bookingRules: { type: 'AWSJSON', required: false },
    },
  };
}
