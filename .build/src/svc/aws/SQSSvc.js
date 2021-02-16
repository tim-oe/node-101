"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseAWSSvc_1 = __importDefault(require("./BaseAWSSvc"));
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
// https://github.com/localstack/localstack/issues/948
const defaultConfig = { apiVersion: '2012-11-05' };
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html
class SQSSvc extends BaseAWSSvc_1.default {
    constructor(queueName, awsConfig, sqsConfig) {
        super(awsConfig);
        this.queueUrl = "unset";
        // https://stackoverflow.com/questions/56269829/aws-lambda-finish-before-sending-message-to-sqs
        // TODO the get url returns localhost even in the lambda
        // https://github.com/localstack/localstack/issues/3562
        this.getQueueUrl = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.queueUrl) {
                const sqsUrlParams = { QueueName: this.queueName };
                const queueUrlResult = yield this.sqs.getQueueUrl(sqsUrlParams).promise();
                if (queueUrlResult.QueueUrl) {
                    this.logger.info('sqs: endpoint ' + queueUrlResult.QueueUrl);
                    this.queueUrl = queueUrlResult.QueueUrl;
                }
                else {
                    throw new Error('failed to get url for ' + this.queueName);
                }
            }
            return this.queueUrl;
        });
        this.post = (message) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                MessageBody: message,
                //QueueUrl: ,
                QueueUrl: yield this.getQueueUrl(),
                DelaySeconds: 0
            };
            const result = yield this.sqs.sendMessage(request).promise();
            this.logger.info('post to sqs success', result);
            if (!result.MessageId) {
                throw new Error('failed to post to ' + this.queueName + ' ' + message);
            }
            return result.MessageId;
        });
        this.queueName = queueName;
        if (sqsConfig) {
            this.sqs = new this.AWS.SQS(sqsConfig);
        }
        else {
            this.sqs = new this.AWS.SQS(defaultConfig);
        }
    }
}
exports.default = SQSSvc;
//# sourceMappingURL=SQSSvc.js.map