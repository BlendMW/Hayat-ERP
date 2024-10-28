import AWS from 'aws-sdk';

const kinesis = new AWS.Kinesis();

export const trackAffiliateClick = async (userId: string, metaSearchResultId: string, providerId: string) => {
  const event = {
    eventType: 'AFFILIATE_CLICK',
    userId,
    metaSearchResultId,
    providerId,
    timestamp: new Date().toISOString(),
  };

  await kinesis.putRecord({
    StreamName: process.env.AFFILIATE_ANALYTICS_STREAM!,
    Data: JSON.stringify(event),
    PartitionKey: userId,
  }).promise();
};

export const trackAffiliateConversion = async (userId: string, metaSearchResultId: string, providerId: string, amount: number) => {
  const event = {
    eventType: 'AFFILIATE_CONVERSION',
    userId,
    metaSearchResultId,
    providerId,
    amount,
    timestamp: new Date().toISOString(),
  };

  await kinesis.putRecord({
    StreamName: process.env.AFFILIATE_ANALYTICS_STREAM!,
    Data: JSON.stringify(event),
    PartitionKey: userId,
  }).promise();
};
