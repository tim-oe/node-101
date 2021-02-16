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
// in localstack need to set both endpoint and s3ForcePathStyle
// https://github.com/localstack/localstack/issues/3566
const defaultConfig = {
    apiVersion: '2006-03-01',
    s3ForcePathStyle: true
};
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
class S3Svc extends BaseAWSSvc_1.default {
    constructor(bucket, awsConfig, s3Config) {
        super(awsConfig);
        this.upload = (key, content) => __awaiter(this, void 0, void 0, function* () {
            const request = {
                Bucket: this.bucket,
                Body: content,
                Key: key
            };
            this.logger.info("uploading " + this.bucket + ':' + request.Key);
            const data = yield this.s3.upload(request).promise();
            this.logger.info("uploaded to s3", data);
            return data.Location;
        });
        this.bucket = bucket;
        if (s3Config) {
            this.s3 = new this.AWS.S3(s3Config);
        }
        else {
            this.s3 = new this.AWS.S3(defaultConfig);
        }
    }
}
exports.default = S3Svc;
//# sourceMappingURL=S3Svc.js.map