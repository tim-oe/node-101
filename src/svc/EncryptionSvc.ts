import * as crypto from "crypto";

import * as urlsafebase64 from "urlsafe-base64";

import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import SecretsSvc from "./aws/SecretsSvc";

@Injectable()
export default class EncryptionSvc implements OnModuleInit {
  protected static readonly AES_IV_LENGTH: number = 16;
  protected static readonly AES_KEY_LENGTH: number = 32;
  protected static readonly ALGORTHM = "aes-256-ctr";
  protected static readonly DIGEST = "sha256";

  protected readonly logger = new Logger(this.constructor.name);

  protected iv: Buffer = crypto.randomBytes(4);

  protected secret!: Buffer;

  public constructor(
    protected configService: ConfigService,
    protected secretsSvc: SecretsSvc) {}
  
    async onModuleInit(): Promise<void> {
    // TODO get secret from secrets 
    const secret = this.configService.get<string>("encryption.secret");

    if (!secret) {
      throw Error("secret not set!");
    }

    let hash = crypto.createHash(EncryptionSvc.DIGEST).update(secret).digest();

    hash = hash.subarray(0, EncryptionSvc.AES_KEY_LENGTH);
    this.logger.debug(" secret hash " + hash.toString("hex"));

    this.secret = hash;
  }

  /**
   * encrypt value
   * @param value
   * @returns the encrypted value
   */
  encrypt = (value: string): string => {
    // Validate missing value
    if (!value) {
      throw Error("A value is required!");
    }

    let hash = crypto.createHash(EncryptionSvc.DIGEST).update(this.iv).digest();
    hash = hash.subarray(0, EncryptionSvc.AES_IV_LENGTH);
    this.logger.debug("encrypt iv hash " + hash.toString("hex"));

    // Initialize Cipher instance
    const cipher = crypto.createCipheriv(
      EncryptionSvc.ALGORTHM,
      this.secret,
      hash
    );
    cipher.setAutoPadding(false);

    // Return Buffer as a binary encoded string
    const buffer = Buffer.from(value, "utf8").toString("binary");

    const list = [cipher.update(buffer, "binary"), this.iv];

    // concat and return both parts
    return urlsafebase64.encode(Buffer.concat(list));
  };

  /**
   * decrypt an ecrypted token
   * @param encrypted token
   * @returns decrypted value
   */
  decrypt = (token: string): string => {
    // Validate missing token
    if (!token) {
      throw Error("A token is required!");
    }

    // encodes encrypted value from base64 to hex
    let buffer = Buffer.from(token, "base64");
    this.logger.debug("decrypt buffer raw " + buffer.toString("hex"));

    // get creation iv
    const iv = Buffer.from(buffer.subarray(buffer.length - 4, buffer.length));
    this.logger.debug("decrypt iv " + iv.toString("hex"));

    // remove iv suffix
    buffer = Buffer.from(buffer.subarray(0, buffer.length - 4));
    this.logger.debug("decrypt buffer [trim] " + buffer.toString("hex"));

    let hash = crypto.createHash("sha256").update(iv).digest();
    hash = hash.subarray(0, EncryptionSvc.AES_IV_LENGTH);
    this.logger.debug("decrypt iv hash " + hash.toString("hex"));

    // Initialize Decipher instance
    const decipher = crypto.createDecipheriv(
      EncryptionSvc.ALGORTHM,
      this.secret,
      hash
    );
    decipher.setAutoPadding(false);

    // Get decrypted data from decipher instance
    const firstPart = decipher.update(buffer.toString("hex"), "hex", "base64");
    const finalPart = decipher.final("base64") || "";

    // concat both parts
    const decrypted = `${firstPart}${finalPart}`;

    // Encode decrypted value as a 64-bit Buffer
    const buf = Buffer.from(decrypted, "base64");

    // convert decrypted value from base64 to utf-8 string
    return buf.toString("utf8");
  };

  /**
   * https://www.hacksparrow.com/nodejs/how-to-generate-md5-sha1-sha512-sha256-checksum-hashes.html
   */
  public getMD5 = (data: string): string => {
    return crypto.createHash("md5").update(data).digest("hex");
  };
}
