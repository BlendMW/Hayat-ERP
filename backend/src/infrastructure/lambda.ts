import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class BookingLambda extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, bookingTable: dynamodb.Table) {
    super(scope, id);

    const lambdaFunction = new lambda.Function(this, 'BookingLambda', {
      runtime: lambda.Runtime.NODEJS_14_X, // Specify the runtime
      code: lambda.Code.fromAsset('path/to/your/code'), // Specify the path to your Lambda code
      handler: 'index.handler', // Specify the handler function
      // ... other configuration ...
    });

    // Grant the Lambda function read/write permissions to the DynamoDB table
    bookingTable.grantReadWriteData(lambdaFunction);
  }
}
