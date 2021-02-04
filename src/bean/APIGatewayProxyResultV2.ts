import { APIGatewayProxyResult } from 'aws-lambda';

// https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
// V2 result format
// TODO localstack doesn't seem to set cookies from result
export interface APIGatewayProxyResultV2 extends APIGatewayProxyResult {
    cookies?: string []
}