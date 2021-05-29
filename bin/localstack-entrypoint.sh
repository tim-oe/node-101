#!/usr/bin/env bash

# https://medium.com/better-programming/dont-be-intimidated-learn-how-to-run-aws-on-your-local-machine-with-localstack-2f3448462254

printf "Configuring localstack components...\n"

aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test

echo "[default]" > ~/.aws/config
echo "region = us-west-2" >> ~/.aws/config
echo "output = json" >> ~/.aws/config

aws configure list

# configure lambda deploment bucket
# very important as needed to deploy
# this also needs to be defined in serveless.yml: deploymentBucket
awslocal s3api create-bucket --bucket node-101-local-deploy
awslocal s3api put-bucket-acl --bucket node-101-local-deploy --acl public-read
#awslocal s3api get-bucket-website --bucket node-101-local-deploy
printf "\n\n"

# request archive bucket
awslocal s3api create-bucket --bucket node-101-archive
# TODO figure right perms
awslocal s3api put-bucket-acl --bucket node-101-archive --acl public-read
# s3 event registration
awslocal s3api put-bucket-notification-configuration --bucket node-101-archive --notification-configuration '{"LambdaFunctionConfigurations": [{"LambdaFunctionArn": "arn:aws:lambda:us-west-2:000000000000:function:node-101-local-archive","Events": ["s3:ObjectCreated:*"]}]}'
awslocal s3api get-bucket-notification-configuration --bucket node-101-archive

printf "\n\n"
awslocal s3api list-buckets

printf "\n\n"
# sqs queue gateway event
awslocal sqs create-queue --queue-name node-101-click

printf "\n\n"
# encryption secret
awslocal secretsmanager create-secret --name dev/node-101/encryption \
    --description "encryption stuff" \
    --secret-string '{"secret": "donttellanyone"}'

printf "\n\nlocalstack configuration complete\n"
