#!/usr/bin/env bash

mkdir -p /tmp/room
docker run -it --rm -e TERM=$TERM -v /tmp/room:/app/room estimation-poker-tui $*
