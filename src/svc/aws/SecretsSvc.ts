import {
    Config,
    SecretsManager
} from 'aws-sdk';

import BaseAWSSvc from "./BaseAWSSvc";

const defaultConfig: SecretsManager.Types.ClientConfiguration = {
    apiVersion: '2017-10-17'
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html
export default class SecretsSvc extends BaseAWSSvc {

    protected secretsmanager!: SecretsManager;

    public constructor(
        awsConfig: Config,
        secretsConfig: SecretsManager.Types.ClientConfiguration) {
        super(awsConfig);

        if (secretsConfig) {
            this.secretsmanager = new this.AWS.SecretsManager(secretsConfig);
        } else {
            this.secretsmanager = new this.AWS.SecretsManager(defaultConfig);
        }
    }

    public get = async (id: string): Promise<string> => {
        try {
            const request: SecretsManager.Types.GetSecretValueRequest = { SecretId: id };

            const resp: SecretsManager.Types.GetSecretValueResponse = await this.secretsmanager.getSecretValue(request).promise();

            if (resp && resp.SecretString) {
                this.logger.info("got secret", resp);

                return resp.SecretString;
            } else {
                throw new Error("failed to get secret " + id);
            }
        } catch (err) {
            this.logger.error("failed to get secret " + id, err.stack);
            throw new Error("failed to get secret " + id);
        }
    }
}