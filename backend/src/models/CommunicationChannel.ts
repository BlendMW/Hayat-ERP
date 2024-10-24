import { Model } from 'aws-amplify';

export class CommunicationChannel extends Model {
  static classType = 'CommunicationChannel';

  constructor(init: Partial<CommunicationChannel>) {
    super(init);
  }

  static schema = {
    name: 'CommunicationChannel',
    fields: {
      id: { type: 'ID', required: true },
      type: { type: 'String', required: true }, // e.g., 'EMAIL', 'SMS', 'PUSH'
      address: { type: 'String', required: true }, // e.g., email address, phone number, device token
      userId: { type: 'ID', required: true },
      isActive: { type: 'Boolean', required: true },
    },
  };
}
