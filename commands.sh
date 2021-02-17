!bin/sh
# series of commands that were used to add libs and config the prokect
# basic node init
npm init -y
# generate ignore file
npx gitignore node
# typescript install
npm i -D typescript @types/node ts-node nodemon tsconfig-paths
# tsconfig
npx tsc --init --rootDir src --outDir build --esModuleInterop --resolveJsonModule --lib es6 --module commonjs --allowJs true --noImplicitAny true
# lib dependencies
npm i async config cookie mysql typeorm urlsafe-base64 winston
# aws sdk libs
npm i aws-sdk aws-lambda
npm i -D @types/aws-lambda
# jest install
npm i -D jest @types/jest ts-jest
# install globally
sudo npm i -g jest
# jest.config, follow prompts
jest --init
# eslint install
npm i -D eslint
# eslint init, follow prompts
npx eslint --init
# jsDoc install
npm add -D jsdoc docdash jsdoc-to-markdown
# serverless install
sudo npm install -g serverless
# initialize serverless (follow prompts)
serverless
# serverless plugins
npm i -D serverless-localstack serverless-plugin-typescript serverless-plugin-include-dependencies serverless-plugin-common-excludes
# create docker network
docker network create shared