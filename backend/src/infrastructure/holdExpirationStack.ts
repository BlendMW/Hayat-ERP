import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import * as targets from '@aws-cdk/aws-events-targets';

export class HoldExpirationStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the Lambda function
    const processExpiredHoldsFunction = new lambda.Function(this, 'ProcessExpiredHoldsFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'processExpiredHolds.handler',
      code: lambda.Code.fromAsset('path/to/your/lambda/code'),
    });

    // Create the EventBridge rule to run every 5 minutes
    const rule = new events.Rule(this, 'ProcessExpiredHoldsRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
    });

    // Add the Lambda function as a target for the rule
    rule.addTarget(new targets.LambdaFunction(processExpiredHoldsFunction));

    // Create the Lambda function for processing scheduled notifications
    const processScheduledNotificationsFunction = new lambda.Function(this, 'ProcessScheduledNotificationsFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'processScheduledNotifications.handler',
      code: lambda.Code.fromAsset('path/to/your/lambda/code'),
    });

    // Create the EventBridge rule to run every minute
    const notificationRule = new events.Rule(this, 'ProcessScheduledNotificationsRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    });

    // Add the Lambda function as a target for the rule
    notificationRule.addTarget(new targets.LambdaFunction(processScheduledNotificationsFunction));
  }
}
