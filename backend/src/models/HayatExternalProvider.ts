export class HayatExternalProvider {
  static classType = 'ExternalProvider';

  constructor(init: Partial<HayatExternalProvider>) {
  }

  async save(): Promise<void> {
    // Implement the logic to save the instance to your data store
    // For example, using a hypothetical API call:
    // await api.saveHayatExternalProvider(this);
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
