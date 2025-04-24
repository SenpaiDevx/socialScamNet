#!/bin/sh

program_is_installed() {
  if command -v "$1" >/dev/null 2>&1; then
    return 0
  else
    return 1  
  fi
}

if ! program_is_installed "zip"; then
  apk update
  apk add zip
fi

aws s3 sync s3://socialscamnet-env-file/develop .

unzip env-file.zip
cp .env.develop .env
rm .env.develop
sed -i -e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT:6379|g" .env
rm -rf env-file.zip
cp .env .env.develop
zip env-file.zip .env.develop
aws --region ap-southeast-1 s3 cp env-file.zip s3://socialscamnet-env-file/develop/
rm -rf .env*
rm -rf env-file.zip