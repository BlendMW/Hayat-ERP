import { CloudWatchLogs } from 'aws-sdk';

const cloudWatchLogs = new CloudWatchLogs();

export const logger = {
  info: (message: string, data?: any) => log('INFO', message, data),
  warn: (message: string, data?: any) => log('WARN', message, data),
  error: (message: string, error?: Error, data?: any) => log('ERROR', message, { error: error?.stack, ...data }),
};

async function log(level: string, message: string, data?: any) {
  const logEvent = {
    message: JSON.stringify({
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }),
    timestamp: new Date().getTime(),
  };

  const params = {
    logGroupName: process.env.CLOUDWATCH_LOG_GROUP_NAME || '/aws/lambda/flight-status',
    logStreamName: new Date().toISOString().split('T')[0], // Use date as log stream name
    logEvents: [logEvent],
  };

  try {
    await cloudWatchLogs.putLogEvents(params).promise();
  } catch (error) {
    console.error('Failed to write to CloudWatch:', error);
  }

  // Also log to console for local development and debugging
  console.log(`${level}: ${message}`, data);
}
