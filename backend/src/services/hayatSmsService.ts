import AWS from 'aws-sdk';

const sns = new AWS.SNS({ region: 'us-east-1' });

export const sendSMS = (address: string, content: string) => {
    const params = {
        PhoneNumber: address,
        Message: content,
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Transactional'
            }
        }
    };

    try {
        await sns.publish(params).promise();
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('Failed to send SMS', error);
        throw error;
    }
};
