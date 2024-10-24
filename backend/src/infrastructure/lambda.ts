import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

export class BookingLambda extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, bookingTable: lambda.Table) {
    super(scope, id);

    const lambdaFunction = new lambda.Function(this, 'BookingLambda', {
      // ... other configuration ...
    });

    // Grant the Lambda function read/write permissions to the DynamoDB table
    bookingTable.grantReadWriteData(lambdaFunction);
  }
}
