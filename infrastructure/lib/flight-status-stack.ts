import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as sqs from '@aws-cdk/aws-sqs';
import * as lambdaEventSources from '@aws-cdk/aws-lambda-event-sources';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class FlightStatusStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'FlightStatusLogGroup', {
      logGroupName: '/aws/lambda/flight-status',
      retention: logs.RetentionDays.ONE_WEEK,
    });

    const lambdaRole = new iam.Role(this, 'FlightStatusLambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    lambdaRole.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
      resources: [logGroup.logGroupArn],
    }));

    const webhookHandler = new lambda.Function(this, 'FlightStatusWebhookHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'flightStatusWebhook.handler',
      code: lambda.Code.fromAsset('backend/src/lambdas'),
      environment: {
        FLIGHT_STATUS_TABLE_NAME: 'FlightStatus',
        CLOUDWATCH_LOG_GROUP_NAME: logGroup.logGroupName,
      },
      role: lambdaRole,
    });

    const api = new apigateway.RestApi(this, 'FlightStatusApi', {
      restApiName: 'Flight Status Service',
    });

    const webhookIntegration = new apigateway.LambdaIntegration(webhookHandler);
    api.root.addMethod('POST', webhookIntegration);

    // Add necessary permissions for DynamoDB access
    // ...

    const pollingHandler = new lambda.Function(this, 'FlightStatusPollingHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'flightStatusPoller.handler',
      code: lambda.Code.fromAsset('backend/src/lambdas'),
      environment: {
        ACTIVE_FLIGHTS_TABLE_NAME: 'ActiveFlights',
        FLIGHT_STATUS_TABLE_NAME: 'FlightStatus',
        CLOUDWATCH_LOG_GROUP_NAME: logGroup.logGroupName,
      },
      role: lambdaRole,
    });

    // Set up CloudWatch Events to trigger the polling function periodically
    // ...

    const realTimeUpdatesHandler = new lambda.Function(this, 'RealTimeFlightUpdatesHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'realTimeFlightUpdates.handler',
      code: lambda.Code.fromAsset('backend/src/lambdas'),
      environment: {
        FLIGHT_SCHEDULE_TABLE: 'FlightSchedules',
        SEAT_AVAILABILITY_TABLE: 'SeatAvailability',
        CLOUDWATCH_LOG_GROUP_NAME: logGroup.logGroupName,
      },
      role: lambdaRole,
    });

    const realTimeUpdatesIntegration = new apigateway.LambdaIntegration(realTimeUpdatesHandler);
    api.root.addResource('real-time-updates').addMethod('POST', realTimeUpdatesIntegration);

    const realTimeFareClassUpdatesHandler = new lambda.Function(this, 'RealTimeFareClassUpdatesHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'realTimeFareClassUpdates.handler',
      code: lambda.Code.fromAsset('backend/src/lambdas'),
      environment: {
        FLIGHT_SCHEDULE_TABLE: 'FlightSchedules',
        SEAT_AVAILABILITY_TABLE: 'SeatAvailability',
        CLOUDWATCH_LOG_GROUP_NAME: logGroup.logGroupName,
      },
      role: lambdaRole,
    });

    const realTimeFareClassUpdatesIntegration = new apigateway.LambdaIntegration(realTimeFareClassUpdatesHandler);
    api.root.addResource('real-time-fare-class-updates').addMethod('POST', realTimeFareClassUpdatesIntegration);

    // Create SQS queue for real-time flight data updates
    const flightDataUpdateQueue = new sqs.Queue(this, 'FlightDataUpdateQueue', {
      queueName: 'flight-data-update-queue',
      visibilityTimeout: cdk.Duration.seconds(300), // 5 minutes
      retentionPeriod: cdk.Duration.days(14),
    });

    // Create Lambda function for processing real-time flight data updates
    const realTimeFlightDataUpdatesHandler = new lambda.Function(this, 'RealTimeFlightDataUpdatesHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'realTimeFlightDataUpdates.handler',
      code: lambda.Code.fromAsset('backend/src/lambdas'),
      environment: {
        FLIGHT_SCHEDULE_TABLE: 'FlightSchedules',
        SEAT_INVENTORY_TABLE: 'SeatInventory',
        CLOUDWATCH_LOG_GROUP_NAME: logGroup.logGroupName,
      },
      role: lambdaRole,
    });

    // Add SQS event source to the Lambda function
    realTimeFlightDataUpdatesHandler.addEventSource(new lambdaEventSources.SqsEventSource(flightDataUpdateQueue));

    // Grant the Lambda function permission to read from the SQS queue
    flightDataUpdateQueue.grantConsumeMessages(realTimeFlightDataUpdatesHandler);

    // Create an API Gateway endpoint for receiving real-time updates
    const realTimeUpdateApi = new apigateway.RestApi(this, 'RealTimeUpdateApi', {
      restApiName: 'Real-Time Flight Update API',
    });

    const realTimeUpdateIntegration = new apigateway.LambdaIntegration(new lambda.Function(this, 'RealTimeUpdateProxyHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'realTimeUpdateProxy.handler',
      code: lambda.Code.fromAsset('backend/src/lambdas'),
      environment: {
        SQS_QUEUE_URL: flightDataUpdateQueue.queueUrl,
      },
      role: lambdaRole,
    }));

    realTimeUpdateApi.root.addMethod('POST', realTimeUpdateIntegration);

    // Grant the proxy Lambda function permission to send messages to the SQS queue
    flightDataUpdateQueue.grantSendMessages(realTimeUpdateIntegration.handler);

    // Create DynamoDB table for schedule change logs
    const scheduleChangeLogTable = new dynamodb.Table(this, 'ScheduleChangeLogTable', {
      partitionKey: { name: 'flightScheduleId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
    });

    // Grant the Lambda functions access to the new table
    scheduleChangeLogTable.grantReadWriteData(realTimeFlightDataUpdatesHandler);
    scheduleChangeLogTable.grantReadWriteData(realTimeFareClassUpdatesHandler);
  }
}
