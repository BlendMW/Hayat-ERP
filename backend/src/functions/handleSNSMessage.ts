import { SNSEvent, SNSHandler } from 'aws-lambda';
import { sendEmail } from '../services/hayatEmailService';
import { sendSMS } from '../services/hayatSmsService';
import { sendPushNotification } from '../services/hayatPushNotificationService';

export const handler: SNSHandler = async (event: SNSEvent) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.Sns.Message);
    const { channelType, address, content } = message;

    try {
      switch (channelType) {
        case 'EMAIL':
          await sendEmail(address, content);
          break;
        case 'SMS':
          await sendSMS(address, content);
          break;
        case 'PUSH':
          await sendPushNotification(address, content);
          break;
        default:
          console.error(`Unsupported channel type: ${channelType}`);
      }
    } catch (error) {
      console.error(`Error sending notification: ${error}`);
    }
  }
};
