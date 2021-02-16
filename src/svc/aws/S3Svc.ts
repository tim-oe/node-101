import { 
    Config,
    S3 
} from 'aws-sdk';

import { ManagedUpload } from "aws-sdk/clients/s3";

import BaseAWSSvc from "./BaseAWSSvc";

// in localstack need to set both endpoint and s3ForcePathStyle
// https://github.com/localstack/localstack/issues/3566
const defaultConfig: S3.Types.ClientConfiguration = {
    apiVersion: '2006-03-01',
    s3ForcePathStyle: true
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
export default class S3Svc extends BaseAWSSvc {

    protected s3: S3;
    protected bucket: string;
    public constructor(
        bucket: string, 
        awsConfig: Config, 
        s3Config: S3.Types.ClientConfiguration) {
        super(awsConfig);
        
        this.bucket = bucket;

        if(s3Config){
            this.s3 = new this.AWS.S3(s3Config);
        } else {
            this.s3 = new this.AWS.S3(defaultConfig);
        }
    }

    public upload = async (key: string, content: Buffer): Promise<string> => {
    
        const request: S3.Types.PutObjectRequest = {
            Bucket: this.bucket,
            Body: content,
            Key: key
        };

        this.logger.info("uploading " + this.bucket + ':' + request.Key);
        const data: ManagedUpload.SendData =  await this.s3.upload(request).promise();
        this.logger.info("uploaded to s3", data);

        return data.Location;
    }
}