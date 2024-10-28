import AWS from 'aws-sdk';
import { Notification, CommunicationChannel, User, Flight, Booking } from '../models';

const sns = new AWS.SNS();

interface NotificationData {
  id: string;
  userId: string;
  type: string;
  content: string;
  channelId: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sentAt?: string;
}

export const sendNotification = async (notification: NotificationData) => {
  const channel = await CommunicationChannel.findById(notification.channelId);

  if (!channel || !channel.isActive) {
    throw new Error('Invalid or inactive communication channel');
  }

  const params = {
    Message: notification.content,
    Subject: `Hayat ERP Notification: ${notification.type}`,
    TopicArn: process.env.SNS_TOPIC_ARN,
    MessageAttributes: {
      'channelType': {
        DataType: 'String',
        StringValue: channel.type
      },
      'address': {
        DataType: 'String',
        StringValue: channel.address
      }
    }
  };

  try {
    await sns.publish(params).promise();
    notification.status = 'SENT';
    notification.sentAt = new Date().toISOString();
    await Notification.findByIdAndUpdate(notification.id, notification);
  } catch (error) {
    console.error('Error sending notification:', error);
    notification.status = 'FAILED';
    await Notification.findByIdAndUpdate(notification.id, notification);
    throw error;
  }
};

export const createNotification = async (userId: string, type: string, content: string, channelId: string) => {
  const notification = await Notification.create({
    userId,
    type,
    content,
    status: 'PENDING',
    channelId,
  });

  await sendNotification(notification);
  return notification;
};

export const sendFlightUpdateNotification = async (userId: string, flightId: string, updateType: string) => {
  const user = await User.findById(userId);
  const flight = await Flight.findById(flightId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Your flight ${flight.flightNumber} has been updated. ${updateType}`;
  await createNotification(userId, 'FLIGHT_UPDATE', content, channel.id);
};

export const sendReminderNotification = async (userId: string, bookingId: string, hoursBeforeDeparture: number) => {
  const user = await User.findById(userId);
  const booking = await Booking.findById(bookingId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Reminder: Your flight ${booking.flightNumber} departs in ${hoursBeforeDeparture} hours.`;
  await createNotification(userId, 'REMINDER', content, channel.id);
};

export const sendPointsEarnedNotification = async (userId: string, points: number) => {
  const user = await User.findById(userId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Congratulations! You've earned ${points} loyalty points.`;
  await createNotification(userId, 'POINTS_EARNED', content, channel.id);
};

export const sendPointsExpiringNotification = async (userId: string, points: number, expirationDate: string) => {
  const user = await User.findById(userId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Alert: ${points} loyalty points will expire on ${new Date(expirationDate).toLocaleDateString()}.`;
  await createNotification(userId, 'POINTS_EXPIRING', content, channel.id);
};

export const sendPointsRedeemedNotification = async (userId: string, points: number, redemptionOption: string) => {
  const user = await User.findById(userId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `You've successfully redeemed ${points} points for ${redemptionOption}.`;
  await createNotification(userId, 'POINTS_REDEEMED', content, channel.id);
};

// Add this function
const getDefaultCommunicationChannel = async (userId: string): Promise<CommunicationChannel> => {
  const channel = await CommunicationChannel.findOne({ userId, isDefault: true });
  if (!channel) {
    throw new Error('No default communication channel found for user');
  }
  return channel;
};
