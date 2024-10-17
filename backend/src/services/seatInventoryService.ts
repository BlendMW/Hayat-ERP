import { DynamoDB } from 'aws-sdk';
import { SeatInventory, BookingEvent } from '../modules/flights/types';
import { logger } from '../utils/logger';

export class SeatInventoryService {
  private dynamoDb: DynamoDB.DocumentClient;

  constructor() {
    this.dynamoDb = new DynamoDB.DocumentClient();
  }

  async updateSeatInventory(flightId: string, fareClassCode: string, seatInventory: SeatInventory): Promise<void> {
    const params = {
      TableName: process.env.SEAT_INVENTORY_TABLE || 'SeatInventory',
      Key: { flightId, fareClassCode },
      UpdateExpression: 'SET availableSeats = :availableSeats, seatMap = :seatMap',
      ExpressionAttributeValues: {
        ':availableSeats': seatInventory.availableSeats,
        ':seatMap': seatInventory.seatMap,
      },
    };

    try {
      await this.dynamoDb.update(params).promise();
      logger.info('Seat inventory updated', { flightId, fareClassCode });
    } catch (error) {
      logger.error('Error updating seat inventory', error as Error, { flightId, fareClassCode });
      throw error;
    }
  }

  async getSeatInventory(flightId: string, fareClassCode: string): Promise<SeatInventory | null> {
    const params = {
      TableName: process.env.SEAT_INVENTORY_TABLE || 'SeatInventory',
      Key: { flightId, fareClassCode },
    };

    try {
      const result = await this.dynamoDb.get(params).promise();
      return result.Item as SeatInventory || null;
    } catch (error) {
      logger.error('Error getting seat inventory', error as Error, { flightId, fareClassCode });
      throw error;
    }
  }

  async processBookingEvent(event: BookingEvent): Promise<void> {
    const seatInventory = await this.getSeatInventory(event.flightId, event.fareClassCode);
    if (!seatInventory) {
      throw new Error('Seat inventory not found');
    }

    if (event.type === 'BOOKING') {
      seatInventory.availableSeats -= event.seats.length;
      event.seats.forEach(seatNumber => {
        this.updateSeatStatus(seatInventory.seatMap, seatNumber, false);
      });
    } else if (event.type === 'CANCELLATION') {
      seatInventory.availableSeats += event.seats.length;
      event.seats.forEach(seatNumber => {
        this.updateSeatStatus(seatInventory.seatMap, seatNumber, true);
      });
    }

    await this.updateSeatInventory(event.flightId, event.fareClassCode, seatInventory);
  }

  private updateSeatStatus(seatMap: SeatMap, seatNumber: string, isAvailable: boolean): void {
    for (const row of seatMap.rows) {
      const seat = row.seats.find(s => s.seatNumber === seatNumber);
      if (seat) {
        seat.isAvailable = isAvailable;
        break;
      }
    }
  }
}
