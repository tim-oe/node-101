# node.js aws lambda sample project 

this project is a learning experience in progress. The goal is to learn node.js as it
pertains to aws development.

## tech stack
- [vs code](https://code.visualstudio.com/)
- [node.js](https://nodejs.org/en/docs/guides/getting-started-guide/)
- [npm](https://docs.npmjs.com/)
- [typescript](https://www.typescriptlang.org/docs/)
- [nestjs](https://docs.nestjs.com/)
- [aws-sdk](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest)
- [aws-lambda](https://www.npmjs.com/package/aws-lambda)
- [cookie](https://www.npmjs.com/package/cookie)
- [typeorm](https://www.npmjs.com/package/typeorm)
- [urlsafe-base64](https://www.npmjs.com/package/urlsafe-base64])
- [winston](https://github.com/winstonjs/winston)
- [jest](https://jestjs.io/)
- [typeorm-transactional-tests](https://github.com/viniciusjssouza/typeorm-transactional-tests)
- [eslint](https://eslint.org/docs/developer-guide/nodejs-api)
- [jsDoc](https://www.npmjs.com/package/jsdoc)
- [serverless](https://www.serverless.com/)
- [serverless.yml](https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml/?rd=true)
- [serverless plugins](https://www.serverless.com/plugins/)
- [serverless localstack](https://github.com/localstack/serverless-localstack)
- [localstack container](https://github.com/localstack/localstack)

## project setup
- [commands.sh](https://github.com/tim-oe/node-101/blob/main/commands.sh)
- [gitignore](https://philna.sh/blog/2019/01/10/how-to-start-a-node-js-project/)
- [init serverless](https://www.serverless.com/framework/docs/getting-started/)
- [init localstack](https://medium.com/manomano-tech/using-serverless-framework-localstack-to-test-your-aws-applications-locally-17748ffe6755)

## initialize database
- using gradle: ```gradle dbReset```
- leverages [flyway](https://flywaydb.org/documentation/)

## project functionality
- [handler class](https://github.com/tim-oe/node-101/blob/main/src/functions/handler.ts)
    - echo [api gateway event](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html): dumps request into sqs, looks up custid in path
    - record [SQS event](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html): dumps sqs message to s3 bucket
    - archive [S3 event](https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html): s3 even -> post to mongo TDB
## usefull commands
- deploy >> `serverless deploy --stage local --region us-west-2`
- list apigateway >> `awslocal apigateway get-rest-apis`
- list apigateway resources >> `awslocal apigateway get-resources --rest-api-id <id>`
- list lambda functions >> `awslocal lambda list-functions`
- list logs >> `aws --endpoint-url http://localhost:4566 logs describe-log-groups`
- tail lambda logs (requires aws cli v2) >> `aws --endpoint-url=http://localhost:4566 logs tail <logGroupName> --follow`
- list bucket contents >> `awslocal s3api list-objects --bucket <bucket name>`

## execute api gateway lambda
- `curl -v -i  http://localhost:4566/restapis/XXX/local/_user_request_/echo/custid`
    - replace ```XXX``` with endpoint hash displayed as part of successful deploy
    - replace ```custid``` with a customer.id from database
## FAQ
- see copious links wthin the code for solving issues encountered
- [debugging with vsCode](https://code.visualstudio.com/docs/editor/debugging)

## TODOs
- add mongo persistence 
- jsdoc
- deploy and verify functionality against aws.