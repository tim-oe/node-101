
import AWS, { S3, SecretsManager, SQS } from "aws-sdk";

import config from "config";

import { baseUrl } from "../svc/aws/BaseAWSSvc";
import S3Svc from "../svc/aws/S3Svc";
import SecretsSvc from "../svc/aws/SecretsSvc";
import SQSSvc from "../svc/aws/SQSSvc";

import CustomerSvc from "../svc/dao/CustomerSvc";
import ResponseSvc from "../svc/ResponseSvc";

// https://stackoverflow.com/questions/61028751/missing-credentials-in-config-if-using-aws-config-file-set-aws-sdk-load-config
// TODO this should not be needed
const awsConfig: AWS.Config = new AWS.Config();
awsConfig.credentials = new AWS.Credentials(
    "test",
    "test"
);
awsConfig.region = config.get('aws.region');

let sqss: SQSSvc;
export function clickQueueSvc(
): SQSSvc {
    if (!sqss) {
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
        // https://github.com/localstack/localstack/issues/948
        const sqsConfig: SQS.Types.ClientConfiguration = {
            endpoint: baseUrl,
            apiVersion: '2012-11-05'
        };
        sqss = new SQSSvc(config.get('sqs.queue'), awsConfig, sqsConfig);
    }
    return sqss;
}

let s3svc: S3Svc;
export function achiveBucketSvc(
): S3Svc {
    if (!s3svc) {
        // in localstack need to set both endpoint and s3ForcePathStyle
        // https://github.com/localstack/localstack/issues/3566
        const s3Config: S3.Types.ClientConfiguration = {
            endpoint: baseUrl,
            apiVersion: '2006-03-01',
            s3ForcePathStyle: true
        };
        s3svc = new S3Svc(config.get('s3.bucket'), awsConfig, s3Config);
    }
    return s3svc;
}

let ssvc: SecretsSvc;
export function secretsSvc(
): SecretsSvc {
    if (!ssvc) {
        const secretsConfig: SecretsManager.Types.ClientConfiguration = {
            endpoint: baseUrl,
            apiVersion: '2017-10-17'
        };
        ssvc = new SecretsSvc(awsConfig, secretsConfig);
    }
    return ssvc;
}

let cSvc: CustomerSvc;
export function customerSvc(
): CustomerSvc {
    if (!cSvc) {
        cSvc = new CustomerSvc(secretsSvc());
    }
    return cSvc;
}

let rSvc: ResponseSvc;
export function responseSvc(
): ResponseSvc {
    if (!rSvc) {
        rSvc = new ResponseSvc();
    }
    return rSvc;
}
