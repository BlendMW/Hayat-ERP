import { APIGatewayProxyResult } from 'aws-lambda';

export class HayatError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HayatError';
  }
}

export const handleError = (error: any): APIGatewayProxyResult => {
  console.error('Error:', error);

  if (error instanceof HayatError) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({ error: error.message }),
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Internal server error' }),
  };
};

export const validateFlightSourceData = (data: any) => {
  const requiredFields = ['name', 'type', 'isActive'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new HayatError(`Missing required field: ${field}`, 400);
    }
  }

  if (!['DIRECT_API', 'GDS', 'AGGREGATOR'].includes(data.type)) {
    throw new HayatError('Invalid source type', 400);
  }
};

export const validateSourcePriorityData = (data: any) => {
  const requiredFields = ['sourceId', 'priority'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new HayatError(`Missing required field: ${field}`, 400);
    }
  }

  if (typeof data.priority !== 'number' || data.priority < 1 || data.priority > 100) {
    throw new HayatError('Priority must be a number between 1 and 100', 400);
  }
};

export const validateSeatMapData = (data: any) => {
  const requiredFields = ['flightId', 'rows', 'columns', 'seatPrices'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new HayatError(`Missing required field: ${field}`, 400);
    }
  }

  if (typeof data.rows !== 'number' || data.rows < 1) {
    throw new HayatError('Invalid number of rows', 400);
  }

  if (typeof data.columns !== 'string' || data.columns.length < 1) {
    throw new HayatError('Invalid column configuration', 400);
  }

  if (typeof data.seatPrices !== 'object') {
    throw new HayatError('Invalid seat prices', 400);
  }
};

export const validateAncillaryServiceData = (data: any) => {
  const requiredFields = ['name', 'price', 'type'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new HayatError(`Missing required field: ${field}`, 400);
    }
  }

  if (typeof data.price !== 'number' || data.price < 0) {
    throw new HayatError('Invalid price', 400);
  }

  const validTypes = ['BAGGAGE', 'MEAL', 'INSURANCE'];
  if (!validTypes.includes(data.type)) {
    throw new HayatError('Invalid service type', 400);
  }
};

export const validateFlightPolicyData = (data: any) => {
  const requiredFields = ['flightId', 'isRefundable', 'cancellationFee', 'modificationFee', 'deadlineHours'];
  for (const field of requiredFields) {
    if (data[field] === undefined) {
      throw new HayatError(`Missing required field: ${field}`, 400);
    }
  }

  if (typeof data.isRefundable !== 'boolean') {
    throw new HayatError('isRefundable must be a boolean', 400);
  }

  if (typeof data.cancellationFee !== 'number' || data.cancellationFee < 0) {
    throw new HayatError('Invalid cancellation fee', 400);
  }

  if (typeof data.modificationFee !== 'number' || data.modificationFee < 0) {
    throw new HayatError('Invalid modification fee', 400);
  }

  if (typeof data.deadlineHours !== 'number' || data.deadlineHours < 0) {
    throw new HayatError('Invalid deadline hours', 400);
  }
};

export const validateModificationData = (data: any) => {
  if (!data.changes || !Array.isArray(data.changes) || data.changes.length === 0) {
    throw new HayatError('Invalid modification data: changes must be a non-empty array', 400);
  }

  const validChangeTypes = ['date', 'passenger', 'seat', 'ancillaryService'];
  for (const change of data.changes) {
    if (!validChangeTypes.includes(change.type)) {
      throw new HayatError(`Invalid change type: ${change.type}`, 400);
    }

    if (change.type === 'date' && !change.newDate) {
      throw new HayatError('New date is required for date changes', 400);
    }

    if (change.type === 'passenger' && (!change.passengerId || !change.newDetails)) {
      throw new HayatError('Passenger ID and new details are required for passenger changes', 400);
    }

    if (change.type === 'seat' && !change.newSeat) {
      throw new HayatError('New seat is required for seat changes', 400);
    }

    if (change.type === 'ancillaryService' && (!change.serviceId || change.action === undefined)) {
      throw new HayatError('Service ID and action are required for ancillary service changes', 400);
    }
  }
};

export const validateNotificationData = (data: any) => {
  const requiredFields = ['userId', 'type', 'content', 'channelId'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new HayatError(`Missing required field: ${field}`, 400);
    }
  }

  const validTypes = ['BOOKING_CONFIRMATION', 'FLIGHT_UPDATE', 'REMINDER'];
  if (!validTypes.includes(data.type)) {
    throw new HayatError('Invalid notification type', 400);
  }
};

export const validateCommunicationChannelData = (data: any) => {
  const requiredFields = ['type', 'address', 'userId'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new HayatError(`Missing required field: ${field}`, 400);
    }
  }

  const validTypes = ['EMAIL', 'SMS', 'PUSH'];
  if (!validTypes.includes(data.type)) {
    throw new HayatError('Invalid communication channel type', 400);
  }
};
