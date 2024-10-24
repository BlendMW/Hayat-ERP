import AWS from 'aws-sdk';
import { Notification } from '../models/Notification';
import { CommunicationChannel } from '../models/CommunicationChannel';
import { User } from '../models/User';
import { Flight } from '../models/Flight';
import { Booking } from '../models/Booking';

const sns = new AWS.SNS();

export const sendNotification = async (notification: Notification) => {
  const channel = await CommunicationChannel.get(notification.channelId);

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
    await notification.save();
  } catch (error) {
    console.error('Error sending notification:', error);
    notification.status = 'FAILED';
    await notification.save();
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
  const user = await User.get(userId);
  const flight = await Flight.get(flightId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Your flight ${flight.flightNumber} has been updated. ${updateType}`;
  await createNotification(userId, 'FLIGHT_UPDATE', content, channel.id);
};

export const sendReminderNotification = async (userId: string, bookingId: string, hoursBeforeDeparture: number) => {
  const user = await User.get(userId);
  const booking = await Booking.get(bookingId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Reminder: Your flight ${booking.flightNumber} departs in ${hoursBeforeDeparture} hours.`;
  await createNotification(userId, 'REMINDER', content, channel.id);
};

export const sendPointsEarnedNotification = async (userId: string, points: number) => {
  const user = await User.get(userId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Congratulations! You've earned ${points} loyalty points.`;
  await createNotification(userId, 'POINTS_EARNED', content, channel.id);
};

export const sendPointsExpiringNotification = async (userId: string, points: number, expirationDate: string) => {
  const user = await User.get(userId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `Alert: ${points} loyalty points will expire on ${new Date(expirationDate).toLocaleDateString()}.`;
  await createNotification(userId, 'POINTS_EXPIRING', content, channel.id);
};

export const sendPointsRedeemedNotification = async (userId: string, points: number, redemptionOption: string) => {
  const user = await User.get(userId);
  const channel = await getDefaultCommunicationChannel(userId);

  const content = `You've successfully redeemed ${points} points for ${redemptionOption}.`;
  await createNotification(userId, 'POINTS_REDEEMED', content, channel.id);
};
