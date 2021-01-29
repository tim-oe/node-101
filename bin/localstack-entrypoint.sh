#!/usr/bin/env bash

printf "Configuring localstack components..."


# configure lambda deploment bucket
awslocal s3api create-bucket --bucket node-101-local-deploy
awslocal s3api put-bucket-acl --bucket node-101-local-deploy --acl public-read

# sqs endpoint 
awslocal sqs create-queue --queue-name node-101-click

# TODO secrets manager for creds