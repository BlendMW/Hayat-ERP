import * as aws from '@aws-cdk/aws-dynamodb';
import * as cdk from '@aws-cdk/core';

export class BookingTable extends cdk.Construct {
  public readonly table: aws.Table;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.table = new aws.Table(this, 'BookingsTable', {
      partitionKey: { name: 'PNR', type: aws.AttributeType.STRING },
      sortKey: { name: 'TenantId', type: aws.AttributeType.STRING },
      billingMode: aws.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'TTL',
    });

    // Add a GSI for querying by TenantId
    this.table.addGlobalSecondaryIndex({
      indexName: 'TenantIdIndex',
      partitionKey: { name: 'TenantId', type: aws.AttributeType.STRING },
      sortKey: { name: 'CreatedAt', type: aws.AttributeType.STRING },
    });
  }
}
