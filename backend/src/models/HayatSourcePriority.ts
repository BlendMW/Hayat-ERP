export class HayatSourcePriority extends Model {
  static classType = 'SourcePriority';

  id: string;
  tenantId: string;
  userId?: string;
  sourceId: string;
  priority: number;

  constructor(init: Partial<HayatSourcePriority>) {
    super(init);
    Object.assign(this, init);
  }

  async save(): Promise<void> {
    // Implement the logic to save the instance to your data store
    // For example, using a hypothetical API call:
    // await api.saveHayatSourcePriority(this);
  }

  static async query(tenantId: string): Promise<HayatSourcePriority[]> {
    return [
      new HayatSourcePriority({ id: 'priority1', tenantId, sourceId: 'source1', priority: 10 }),
    ];
  }
}
