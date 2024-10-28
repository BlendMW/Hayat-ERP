import AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'us-east-1' });

export const sendEmail = (address: string, content: string) => {
    const params = {
        Source: 'noreply@hayaterp.com',
        Destination: {
            ToAddresses: [address]
        },
        Message: {
            Body: {
                Text: {
                    Data: content
                }
            },
            Subject: {
                Data: 'Notification from Hayat ERP'
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email', error);
        throw error;
    }
};
