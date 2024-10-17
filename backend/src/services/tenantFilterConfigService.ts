import { DynamoDB } from 'aws-sdk';
import { TenantFilterConfig, CustomFilter } from '../modules/flights/types';
import { logger } from '../utils/logger';

export class TenantFilterConfigService {
  private dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async getFilterConfig(tenantId: string): Promise<TenantFilterConfig> {
    const params = {
      TableName: process.env.TENANT_FILTER_CONFIG_TABLE || 'TenantFilterConfig',
      Key: { tenantId },
    };

    try {
      const result = await this.dynamoDb.get(params).promise();
      return result.Item as TenantFilterConfig;
    } catch (error) {
      logger.error('Error fetching tenant filter config', error as Error, { tenantId });
      throw error;
    }
  }

  async updateFilterConfig(config: TenantFilterConfig): Promise<void> {
    const params = {
      TableName: process.env.TENANT_FILTER_CONFIG_TABLE || 'TenantFilterConfig',
      Item: config,
    };

    try {
      await this.dynamoDb.put(params).promise();
      logger.info('Tenant filter config updated', { tenantId: config.tenantId });
    } catch (error) {
      logger.error('Error updating tenant filter config', error as Error, { config });
      throw error;
    }
  }
}
