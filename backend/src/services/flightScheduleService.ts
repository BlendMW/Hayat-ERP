import { DynamoDB } from 'aws-sdk';
import { FlightSchedule, SeatAvailability, FareClass, SeatInventory } from '../modules/flights/types';
import { logger } from '../utils/logger';
import { SeatInventoryService } from './seatInventoryService';
import { ScheduleChangeLogService } from './scheduleChangeLogService';

export class FlightScheduleService {
  private dynamoDb: DynamoDB.DocumentClient;
  private seatInventoryService: SeatInventoryService;
  private scheduleChangeLogService: ScheduleChangeLogService;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
    this.seatInventoryService = new SeatInventoryService();
    this.scheduleChangeLogService = new ScheduleChangeLogService();
  }

  async createOrUpdateFlightSchedule(schedule: FlightSchedule, userId: string): Promise<void> {
    const oldSchedule = await this.getFlightSchedule(schedule.id);
    const changeType = oldSchedule ? 'UPDATE' : 'CREATE';

    const params = {
      TableName: process.env.FLIGHT_SCHEDULE_TABLE || 'FlightSchedules',
      Item: schedule,
    };

    try {
      await this.dynamoDb.put(params).promise();
      logger.info('Flight schedule created/updated', { flightNumber: schedule.flightNumber });

      // Log the change
      await this.scheduleChangeLogService.logScheduleChange(
        schedule.id,
        changeType,
        oldSchedule || {},
        schedule,
        userId
      );
    } catch (error) {
      logger.error('Error creating/updating flight schedule', error as Error, { schedule });
      throw error;
    }
  }

  async deleteFlightSchedule(scheduleId: string, userId: string): Promise<void> {
    const oldSchedule = await this.getFlightSchedule(scheduleId);
    if (!oldSchedule) {
      throw new Error('Flight schedule not found');
    }

    const params = {
      TableName: process.env.FLIGHT_SCHEDULE_TABLE || 'FlightSchedules',
      Key: { id: scheduleId },
    };

    try {
      await this.dynamoDb.delete(params).promise();
      logger.info('Flight schedule deleted', { scheduleId });

      // Log the change
      await this.scheduleChangeLogService.logScheduleChange(
        scheduleId,
        'DELETE',
        oldSchedule,
        {},
        userId
      );
    } catch (error) {
      logger.error('Error deleting flight schedule', error as Error, { scheduleId });
      throw error;
    }
  }

  async getFlightSchedule(id: string): Promise<FlightSchedule | null> {
    const params = {
      TableName: process.env.FLIGHT_SCHEDULE_TABLE || 'FlightSchedules',
      Key: { id },
    };

    try {
      const result = await this.dynamoDb.get(params).promise();
      return result.Item as FlightSchedule || null;
    } catch (error) {
      logger.error('Error getting flight schedule', error as Error, { id });
      throw error;
    }
  }

  async updateFareClasses(flightScheduleId: string, fareClasses: FareClass[]): Promise<void> {
    const params = {
      TableName: process.env.FLIGHT_SCHEDULE_TABLE || 'FlightSchedules',
      Key: { id: flightScheduleId },
      UpdateExpression: 'SET fareClasses = :fareClasses',
      ExpressionAttributeValues: {
        ':fareClasses': fareClasses,
      },
    };

    try {
      await this.dynamoDb.update(params).promise();
      logger.info('Fare classes updated', { flightScheduleId });
    } catch (error) {
      logger.error('Error updating fare classes', error as Error, { flightScheduleId });
      throw error;
    }
  }

  async updateSeatAvailability(availability: SeatAvailability): Promise<void> {
    const params = {
      TableName: process.env.SEAT_AVAILABILITY_TABLE || 'SeatAvailability',
      Item: availability,
    };

    try {
      await this.dynamoDb.put(params).promise();
      logger.info('Seat availability updated', { flightScheduleId: availability.flightScheduleId, date: availability.date });
    } catch (error) {
      logger.error('Error updating seat availability', error as Error, { availability });
      throw error;
    }
  }

  async getSeatAvailability(flightScheduleId: string, date: string): Promise<SeatAvailability | null> {
    const params = {
      TableName: process.env.SEAT_AVAILABILITY_TABLE || 'SeatAvailability',
      Key: { flightScheduleId, date },
    };

    try {
      const result = await this.dynamoDb.get(params).promise();
      return result.Item as SeatAvailability || null;
    } catch (error) {
      logger.error('Error getting seat availability', error as Error, { flightScheduleId, date });
      throw error;
    }
  }

  async updateSeatInventory(flightId: string, fareClassCode: string, seatInventory: SeatInventory): Promise<void> {
    await this.seatInventoryService.updateSeatInventory(flightId, fareClassCode, seatInventory);

    // Update the flight schedule with the new seat inventory
    const params = {
      TableName: process.env.FLIGHT_SCHEDULE_TABLE || 'FlightSchedules',
      Key: { id: flightId },
      UpdateExpression: 'SET seatInventory = list_append(if_not_exists(seatInventory, :empty_list), :new_inventory)',
      ExpressionAttributeValues: {
        ':empty_list': [],
        ':new_inventory': [seatInventory],
      },
    };

    try {
      await this.dynamoDb.update(params).promise();
      logger.info('Flight schedule updated with new seat inventory', { flightId, fareClassCode });
    } catch (error) {
      logger.error('Error updating flight schedule with seat inventory', error as Error, { flightId, fareClassCode });
      throw error;
    }
  }

  async getSeatInventory(flightId: string, fareClassCode: string): Promise<SeatInventory | null> {
    return this.seatInventoryService.getSeatInventory(flightId, fareClassCode);
  }

  async getScheduleChangeLogs(scheduleId: string): Promise<ScheduleChangeLog[]> {
    return this.scheduleChangeLogService.getScheduleChangeLogs(scheduleId);
  }
}
