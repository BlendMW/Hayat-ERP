import { Model } from 'aws-amplify';

export class SourcePriority extends Model {
  static classType = 'SourcePriority';

  constructor(init: Partial<SourcePriority>) {
    super(init);
  }

  static schema = {
    name: 'SourcePriority',
    fields: {
      id: { type: 'ID', required: true },
      tenantId: { type: 'ID', required: true },
      userId: { type: 'ID', required: false }, // For user-level overrides
      sourceId: { type: 'ID', required: true },
      priority: { type: 'Int', required: true },
    },
  };
}
