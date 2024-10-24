import { Model } from 'aws-amplify';

export class ExternalProvider extends Model {
  static classType = 'ExternalProvider';

  constructor(init: Partial<ExternalProvider>) {
    super(init);
  }

  static schema = {
    name: 'ExternalProvider',
    fields: {
      id: { type: 'ID', required: true },
      name: { type: 'String', required: true },
      apiKey: { type: 'String', required: true },
      isActive: { type: 'Boolean', required: true },
    },
  };
}
