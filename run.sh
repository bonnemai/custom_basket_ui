#!/usr/bin/env bash
set -euo pipefail

VITE_CUSTOM_BASKET_API_URL=https://6adnqiwsenkvr2lasnrw25h5hm0ghlfb.lambda-url.eu-west-2.on.aws/
NAME=custom-basket-ui
# VITE_CUSTOM_BASKET_API_URL=${VITE_CUSTOM_BASKET_API_URL:-https://custom-basket-api.20urgjtsc9b0.eu-gb.codeengine.appdomain.cloud/}
VITE_CUSTOM_BASKET_API_URL=${VITE_CUSTOM_BASKET_API_URL:-http://localhost:8000/}


docker stop "$NAME" >/dev/null 2>&1 || true
docker rm "$NAME" >/dev/null 2>&1 || true

docker build \
  --build-arg VITE_CUSTOM_BASKET_API_URL="$VITE_CUSTOM_BASKET_API_URL" \
  -t "$NAME" .

docker run \
  --env VITE_CUSTOM_BASKET_API_URL="$VITE_CUSTOM_BASKET_API_URL" \
  --name "$NAME" \
  -p 8001:80 \
  "$NAME"
