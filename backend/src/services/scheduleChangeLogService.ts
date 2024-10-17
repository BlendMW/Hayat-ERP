import { DynamoDB } from 'aws-sdk';
import { ScheduleChangeLog, FlightSchedule } from '../modules/flights/types';
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

export class ScheduleChangeLogService {
  private dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async logScheduleChange(
    flightScheduleId: string,
    changeType: 'CREATE' | 'UPDATE' | 'DELETE',
    oldValue: Partial<FlightSchedule>,
    newValue: Partial<FlightSchedule>,
    userId: string
  ): Promise<void> {
    const changedFields = this.getChangedFields(oldValue, newValue);

    const log: ScheduleChangeLog = {
      id: uuidv4(),
      flightScheduleId,
      changeType,
      changedFields,
      oldValue,
      newValue,
      timestamp: new Date().toISOString(),
      userId,
    };

    const params = {
      TableName: process.env.SCHEDULE_CHANGE_LOG_TABLE || 'ScheduleChangeLogs',
      Item: log,
    };

    try {
      await this.dynamoDb.put(params).promise();
      logger.info('Schedule change logged', { flightScheduleId, changeType });
    } catch (error) {
      logger.error('Error logging schedule change', error as Error, { flightScheduleId, changeType });
      throw error;
    }
  }

  async getScheduleChangeLogs(flightScheduleId: string): Promise<ScheduleChangeLog[]> {
    const params = {
      TableName: process.env.SCHEDULE_CHANGE_LOG_TABLE || 'ScheduleChangeLogs',
      KeyConditionExpression: 'flightScheduleId = :flightScheduleId',
      ExpressionAttributeValues: {
        ':flightScheduleId': flightScheduleId,
      },
      ScanIndexForward: false, // to get the most recent changes first
    };

    try {
      const result = await this.dynamoDb.query(params).promise();
      return result.Items as ScheduleChangeLog[];
    } catch (error) {
      logger.error('Error fetching schedule change logs', error as Error, { flightScheduleId });
      throw error;
    }
  }

  private getChangedFields(oldValue: Partial<FlightSchedule>, newValue: Partial<FlightSchedule>): string[] {
    const changedFields: string[] = [];
    for (const key in newValue) {
      if (JSON.stringify(oldValue[key]) !== JSON.stringify(newValue[key])) {
        changedFields.push(key);
      }
    }
    return changedFields;
  }
}
