import { Model } from 'aws-amplify';

export class User extends Model {
  static classType = 'User';

  constructor(init: Partial<User>) {
    super(init);
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
}
