# node sample project to provide basic setup

- [vs code](https://code.visualstudio.com/)
- [node.js](https://nodejs.org/en/docs/guides/getting-started-guide/)
- [typescript](https://www.typescriptlang.org/docs/)
- [express](https://expressjs.com/)
- [winston](https://github.com/winstonjs/winston)
- [jest](https://jestjs.io/)
- [eslint](https://eslint.org/docs/developer-guide/nodejs-api)
- [jsDoc](https://www.npmjs.com/package/jsdoc)
- [serverless](https://www.serverless.com/)
- [serverless plugins](https://www.serverless.com/plugins/)
- [localstack](https://github.com/localstack/localstack)

# project setup

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

# commands
- create queue >> awslocal sqs create-queue --queue-name click --region us-west-2
- deploy >> serverless deploy --stage local --region us-west-2
- list apigateway >> awslocal apigateway get-rest-apis
- list apigateway resources >> awslocal apigateway get-resources --rest-api-id <id>
- list lambda functions >> awslocal lambda list-functions
# FAQ

- [debugging with vsCode](https://code.visualstudio.com/docs/editor/debugging)