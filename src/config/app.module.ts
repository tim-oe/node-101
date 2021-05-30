import { Module } from "@nestjs/common";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

import { WinstonModule } from "nest-winston";
import { DatabaseType } from "typeorm";

import * as winston from "winston";

import Customer from "../entity/Customer";
import S3Svc from "../svc/aws/S3Svc";
import SecretsSvc from "../svc/aws/SecretsSvc";
import SQSSvc from "../svc/aws/SQSSvc";
import CustomerSvc from "../svc/dao/CustomerSvc";
import EncryptionSvc from "../svc/EncryptionSvc";
import ResponseSvc from "../svc/ResponseSvc";
import configuration from "./configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    WinstonModule.forRoot({
      // TODO externalize
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
          level: "debug",
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.timestamp({
              format: "MMM-DD-YYYY HH:mm:ss",
            }),
            winston.format.printf(({ timestamp, level, message, ...rest }) => {
              let restString = JSON.stringify(rest, undefined, 2);
              restString = restString === "{}" ? "" : restString;

              return `[${timestamp}] ${level} - ${message} ${restString}`;
            })
          ),
        }),
      ],
    }),
    TypeOrmModule.forFeature([Customer]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService
      ): Promise<TypeOrmModuleAsyncOptions> =>
        ({
          type: "mysql" as DatabaseType,
          name: "default",
          autoLoadEntities: true,
          host: configService.get("db.host", "localhost"),
          port: configService.get<number>("db.port", 3306),
          username: configService.get("db.username"),
          password: configService.get("db.password"),
          database: configService.get("db.database"),
          logging: configService.get<boolean>("db.logging", false),
        } as TypeOrmModuleAsyncOptions),
    }),
  ],
  providers: [
    CustomerSvc,
    EncryptionSvc,
    SQSSvc,
    S3Svc,
    SecretsSvc,
    ResponseSvc,
  ],
})
export class AppModule {}
