import winston from 'winston';

import { logConfiguration } from "../../src/config/logging.config";

export default class EncryptionSvc {
  protected static readonly AES_IV_LENGTH: number = 16;
  protected static readonly AES_KEY_LENGTH: number = 32;
  protected static readonly ALGORTHM = 'aes-256-ctr';
  protected static readonly DIGEST = 'sha256';

  protected logger = winston.createLogger(logConfiguration);

  // TODO seed better
  protected secret = 'donttellanyone';

  protected URLSafeBase64 = require('urlsafe-base64');

  //TODO why not via import???
  protected crypto = require('crypto');

  protected iv = this.crypto.randomBytes(4)

  protected getSecret = (): Buffer => {
    let hash = this.crypto.createHash(EncryptionSvc.DIGEST).update('nqZAiIeV2STR').digest();

    hash = hash.subarray(0, EncryptionSvc.AES_KEY_LENGTH);
    this.logger.info(' secret hash ' + hash.toString('hex'));

    return hash;
  }

  /**
   * encrypt value
   * @param value 
   * @returns the encrypted value
   */
  encrypt = (value: string): string => {
    // Validate missing value
    if (!value) {
      throw Error('A value is required!');
    }

    let hash = this.crypto.createHash(EncryptionSvc.DIGEST).update(this.iv).digest();
    hash = hash.subarray(0, EncryptionSvc.AES_IV_LENGTH);
    this.logger.info('encrypt iv hash ' + hash.toString('hex'));

    // Initialize Cipher instance
    const cipher = this.crypto.createCipheriv(EncryptionSvc.ALGORTHM, this.getSecret(), hash);
    cipher.setAutoPadding(false);

    // Return Buffer as a binary encoded string
    const buffer = Buffer.from(value, 'utf8').toString('binary');

    const list = [cipher.update(buffer, 'binary'), this.iv];

    // concat and return both parts
    return this.URLSafeBase64.encode(Buffer.concat(list));
  }

  /**
   * decrypt an ecrypted token
   * @param encrypted token
   * @returns decrypted value
   */
  decrypt = (token: string): string => {
    // Validate missing token
    if (!token) {
      throw Error('A token is required!');
    }

    // encodes encrypted value from base64 to hex
    let buffer = Buffer.from(token, 'base64');
    this.logger.info('decrypt buffer raw ' + buffer.toString('hex'));

    // get creation iv
    const iv = Buffer.from(buffer.subarray(buffer.length - 4, buffer.length));
    this.logger.info('decrypt iv ' + iv.toString('hex'));

    // remove iv suffix
    buffer = Buffer.from(buffer.subarray(0, buffer.length - 4));
    this.logger.info('decrypt buffer [trim] ' + buffer.toString('hex'));

    let hash = this.crypto.createHash('sha256').update(iv).digest();
    hash = hash.subarray(0, EncryptionSvc.AES_IV_LENGTH);
    this.logger.info('decrypt iv hash ' + hash.toString('hex'));

    // Initialize Decipher instance
    const decipher = this.crypto.createDecipheriv(EncryptionSvc.ALGORTHM, this.getSecret(), hash);
    decipher.setAutoPadding(false);

    // Get decrypted data from decipher instance
    const firstPart = decipher.update(buffer.toString('hex'), 'hex', 'base64');
    const finalPart = decipher.final('base64') || '';

    // concat both parts
    const decrypted = `${firstPart}${finalPart}`;

    // Encode decrypted value as a 64-bit Buffer
    const buf = Buffer.from(decrypted, 'base64');

    // convert decrypted value from base64 to utf-8 string
    return buf.toString('utf8');
  }
}
