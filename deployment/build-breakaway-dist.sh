#!/bin/bash

export SOLUTION_NAME=dynamic-image-transformation-for-amazon-cloudfront
export DIST_OUTPUT_BUCKET=dev-breakaway-image-solution-assets
export VERSION=1.0.0
./build-s3-dist.sh
# aws s3 cp --recursive --acl public-read ./dev-breakaway-image-solution-assets/ s3://$DIST_OUTPUT_BUCKET/$SOLUTION_NAME/$VERSION/

export SOLUTION_NAME=dynamic-image-transformation-for-amazon-cloudfront
export DIST_OUTPUT_BUCKET=prod-breakaway-image-solution-assets
export VERSION=1.0.0
./build-s3-dist.sh
# aws s3 cp --recursive --acl public-read ./prod-breakaway-image-solution-assets/ s3://$DIST_OUTPUT_BUCKET/$SOLUTION_NAME/$VERSION/