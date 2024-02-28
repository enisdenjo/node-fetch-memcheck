#!/usr/bin/env bash

service=$1
if [ -z "$service" ]
then
  echo "service argument not provided"
  exit 1
fi

vus=$2
if [ -z "$vus" ]
then
  echo "vus argument not provided"
  exit 1
fi

duration=$3
if [ -z "$duration" ]
then
  echo "duration argument not provided"
  exit 1
fi

if [ -z "$PORT" ]
then
  echo "PORT environment variable not provided"
  exit 1
fi

echo "# $service with $vus VUs and $duration duration"
echo ""
if [ "$CONSUME_BODY" = "true" ]
then
  echo "✅ consuming body "
else
  echo "❌ NOT consuming body "
fi
echo ""

${K6_PATH:="./k6"} run k6.js --vus=100 --duration="$duration" &> k6.out &

while true
do
  time=$(date +%T)

  if jobs % &> /dev/null;
  then
    memusage=$(docker stats --format json --no-stream | grep "node-fetch-memcheck-$service" | jq -r '.MemUsage')
    active_handles=$(curl -s "http://localhost:$PORT/active_handles")

    if [ -z "$active_handles" ]
    then
      echo ""
      echo "$service crashed at $time"
      exit 1
    fi

    echo "1. $time memory usage: $memusage, active handles: $active_handles"

    sleep 1
    continue
  fi

  echo ""
  echo "done at $time"
  exit 0
done

