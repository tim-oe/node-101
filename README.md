# node.js aws sample project 

- [vs code](https://code.visualstudio.com/)
- [node.js](https://nodejs.org/en/docs/guides/getting-started-guide/)
- [npm](https://docs.npmjs.com/)
- [typescript](https://www.typescriptlang.org/docs/)
- [winston](https://github.com/winstonjs/winston)
- [mongoos](https://mongoosejs.com)
- [aws-sdk](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest)
- [jest](https://jestjs.io/)
- [eslint](https://eslint.org/docs/developer-guide/nodejs-api)
- [jsDoc](https://www.npmjs.com/package/jsdoc)
- [serverless](https://www.serverless.com/)
- [serverless.yml](https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml/?rd=true)
- [serverless plugins](https://www.serverless.com/plugins/)
- [serverless localstack](https://github.com/localstack/serverless-localstack)
- [localstack](https://github.com/localstack/localstack)

# project setup, see [commands.sh](https://github.com/tim-oe/node-101/blob/main/commands.sh)

- [init project](https://medium.com/@phtnhphan/how-to-setup-typescript-for-nodejs-project-45d42057f7a3)
- [init typescript](https://khalilstemmler.com/blogs/typescript/node-starter-project/)
- [init express](https://expressjs.com/en/starter/installing.html)
- [init winston](https://www.section.io/engineering-education/logging-with-winston/)
- [init jest](https://jestjs.io/docs/en/getting-started)
- [init eslint](https://eslint.org/docs/user-guide/getting-started)
- [gitignore](https://philna.sh/blog/2019/01/10/how-to-start-a-node-js-project/)
- [init jsdoc](https://medium.com/swlh/creating-better-jsdoc-documentation-8b7a65744dcb)
- [init serverless](https://www.serverless.com/framework/docs/getting-started/)
- [init localstack](https://medium.com/manomano-tech/using-serverless-framework-localstack-to-test-your-aws-applications-locally-17748ffe6755)

# project structure
- [handler class](https://github.com/tim-oe/node-101/blob/main/src/functions/handler.ts)
    - echo: dumps request into sqs
    - record: dupes sqs message to persistance store (TBD)
# commands
- deploy >> `serverless deploy --stage local --region us-west-2`
- list apigateway >> `awslocal apigateway get-rest-apis`
- list apigateway resources >> `awslocal apigateway get-resources --rest-api-id <id>`
- list lambda functions >> `awslocal lambda list-functions`
- list logs >> `aws --endpoint-url http://localhost:4566 logs describe-log-groups`
- tail lambda logs (aws cli v2) >> `aws --endpoint-url=http://localhost:4566 logs tail <logGroupName> --follow`

# execute api gateway lambda
- `curl -v -i  http://localhost:4566/restapis/XXX/local/_user_request_/echo`
    - replace XXX with endpoint hash displayed as part of successful deploy
# FAQ
- [debugging with vsCode](https://code.visualstudio.com/docs/editor/debugging)