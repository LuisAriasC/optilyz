#!/usr/bin/env bash
set -e

cleanup() {
    docker-compose -f  docker-compose.test.yml down
    trap '' EXIT INT TERM
    exit $err
}

# Clead test environment
trap cleanup SIGINT EXIT

# Make sure docker-compose is installed
if ! hash docker-compose 2>/dev/null; then
  echo -e '\033[0;31mPlease install docker-compose\033[0m'
  exit 1
fi

if [ -z "$(docker network ls -qf name=^entropic$)" ]; then
  echo "Creating test network"
  docker network create entropic >/dev/null
fi

COMPOSE_HTTP_TIMEOUT=120 docker-compose -f docker-compose.test.yml up -d --force-recreate --remove-orphans

yarn run execute-test
