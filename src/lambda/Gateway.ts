import AWS = require('aws-sdk');
import winston = require('winston');

/**
 * API Gateway event handler
 * see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-handler.html
 * @param event see https://github.com/awsdocs/aws-lambda-developer-guide/blob/master/sample-apps/nodejs-apig/event.json
 * @param context see https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 * @param callback function that will be used to send response
 */
exports.handler = (event, context, callback) => {

    console.log('Received api gateway event:', JSON.stringify(event, null, 2));

    //TODO do something...

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: 'Go Serverless v1.0! Your function executed successfully!',
                input: event,
            },
            null,
            2
        ),
    };
}
