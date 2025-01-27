#!/bin/bash
export AWS_ACCESS_KEY_ID=$ENV_AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$ENV_AWS_SECRET_ACCESS_KEY
export AWS_REGION=$ENV_AWS_REGION

aws configure set aws_access_key_id "$AWS_ACCESS_KEY_ID" &&
aws configure set aws_secret_access_key "$AWS_SECRET_ACCESS_KEY" &&
aws configure set region "$AWS_REGION"

echo "ENV_AWS_REGION: $ENV_AWS_REGION"
echo "ENV_AWS_ACCESS_KEY_ID: $ENV_AWS_ACCESS_KEY_ID"
echo "ENV_AWS_SECRET_ACCESS_KEY: $ENV_AWS_SECRET_ACCESS_KEY"
echo "AWS_ACCESS_KEY_ID: $AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY: $AWS_SECRET_ACCESS_KEY"
echo "AWS_REGION: $AWS_REGION"

BUCKET_NAME=metrics

echo "CRIAR BUCKET: $BUCKET_NAME"
aws --endpoint-url http://localhost:4566 s3 mb s3://${BUCKET_NAME}
echo "put-bucket-policy (s3-local-policy.json): $BUCKET_NAME"
aws --endpoint-url http://localhost:4566 s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy file:///etc/localstack/init/ready.d/s3-local-policy.json
