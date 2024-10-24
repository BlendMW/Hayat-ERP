import { Model } from 'aws-amplify';

export class Wallet extends Model {
  static classType = 'Wallet';

  constructor(init: Partial<Wallet>) {
    super(init);
  }

  static schema = {
    name: 'Wallet',
    fields: {
      id: { type: 'ID', required: true },
      tenantId: { type: 'ID', required: true },
      balance: { type: 'Float', required: true },
      creditLimit: { type: 'Float', required: true },
    },
  };
}
