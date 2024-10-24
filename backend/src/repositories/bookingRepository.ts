import { DynamoDB } from 'aws-sdk';
import { cacheBooking, getCachedBooking } from '../utils/cache';

export class BookingRepository {
  private dynamoDB: DynamoDB.DocumentClient;
  private tableName: string;

  constructor(private tenantId: string) {
    this.dynamoDB = new DynamoDB.DocumentClient();
    this.tableName = process.env.BOOKINGS_TABLE_NAME || 'Bookings';
  }

  async isPNRUnique(pnr: string): Promise<boolean> {
    const params = {
      TableName: this.tableName,
      KeyConditionExpression: 'PNR = :pnr AND TenantId = :tenantId',
      ExpressionAttributeValues: {
        ':pnr': pnr,
        ':tenantId': this.tenantId,
      },
    };

    const result = await this.dynamoDB.query(params).promise();
    return result.Items?.length === 0;
  }

  async getBooking(pnr: string): Promise<any> {
    // Try to get the booking from cache first
    const cachedBooking = await getCachedBooking(pnr, this.tenantId);
    if (cachedBooking) {
      return cachedBooking;
    }

    // If not in cache, fetch from DynamoDB
    const params = {
      TableName: this.tableName,
      Key: {
        PNR: pnr,
        TenantId: this.tenantId,
      },
    };

    const result = await this.dynamoDB.get(params).promise();
    const booking = result.Item;

    if (booking) {
      // Cache the booking for future requests
      await cacheBooking(pnr, this.tenantId, booking);
    }

    return booking;
  }

  async createBooking(pnr: string, bookingData: any): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        PNR: pnr,
        TenantId: this.tenantId,
        BookingData: bookingData,
        CreatedAt: new Date().toISOString(),
      },
    };

    await this.dynamoDB.put(params).promise();

    // Cache the new booking
    await cacheBooking(pnr, this.tenantId, bookingData);
  }

  // Add other database operations here
}
