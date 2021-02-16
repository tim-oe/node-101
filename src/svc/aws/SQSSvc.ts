import { 
    Config,
    SQS 
} from 'aws-sdk';

import BaseAWSSvc from "./BaseAWSSvc";

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
// https://github.com/localstack/localstack/issues/948
const defaultConfig: SQS.Types.ClientConfiguration = {apiVersion: '2012-11-05'};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
export default class SQSSvc extends BaseAWSSvc {

    protected sqs: SQS;
    protected queueName: string;
    protected queueUrl: string = "unset";
    public constructor(
        queueName: string, 
        awsConfig: Config, 
        sqsConfig: SQS.Types.ClientConfiguration) {
        super(awsConfig);
        
        this.queueName = queueName;

        if(sqsConfig){
            this.sqs = new this.AWS.SQS(sqsConfig);
        } else {
            this.sqs = new this.AWS.SQS(defaultConfig);
        }
    }

    // https://stackoverflow.com/questions/56269829/aws-lambda-finish-before-sending-message-to-sqs
    // TODO the get url returns localhost even in the lambda
    // https://github.com/localstack/localstack/issues/3562
    protected  getQueueUrl =  async (): Promise<string> => {
        if(!this.queueUrl){
            const sqsUrlParams: SQS.Types.GetQueueUrlRequest = {QueueName: this.queueName};

            const queueUrlResult: SQS.Types.GetQueueUrlResult = await this.sqs.getQueueUrl(sqsUrlParams).promise()

            if (queueUrlResult.QueueUrl) {
                this.logger.info('sqs: endpoint ' + queueUrlResult.QueueUrl);
                this.queueUrl = queueUrlResult.QueueUrl;
            } else {
                throw new Error('failed to get url for ' + this.queueName);
            }
        }
        return this.queueUrl;
    } 

    public post = async (message: string): Promise<string> => {
        const request: SQS.Types.SendMessageRequest = {
            MessageBody: message,
            //QueueUrl: ,
            QueueUrl: await this.getQueueUrl(),
            DelaySeconds: 0
        };

        const result: SQS.Types.SendMessageResult = await this.sqs.sendMessage(request).promise();

        this.logger.info('post to sqs success', result);

        if(!result.MessageId) {
            throw new Error('failed to post to ' + this.queueName + ' ' + message);
        }

        return result.MessageId;
    }
}