#!/usr/bin/env bash

# https://medium.com/better-programming/dont-be-intimidated-learn-how-to-run-aws-on-your-local-machine-with-localstack-2f3448462254

printf "Configuring localstack components..."

# aws creds
aws configure set aws_access_key_id test
aws configure set aws_secret_access_key test
echo "[default]" > ~/.aws/config
echo "region = us-west-2" >> ~/.aws/config
echo "output = json" >> ~/.aws/config

# configure lambda deploment bucket
# very important as needed to deploy
# this also needs to be defined in serveless.yml: deploymentBucket
awslocal s3api create-bucket --bucket node-101-local-deploy
awslocal s3api put-bucket-acl --bucket node-101-local-deploy --acl public-read

# sqs endpoint 
awslocal sqs create-queue --queue-name node-101-click

# TODO secrets manager for creds