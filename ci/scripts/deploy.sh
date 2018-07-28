#!/bin/bash

set -e

# Default bin
export PATH="${PATH}:$(pwd)/bin"

# Google Cloud bin
export PATH="${PATH}:$(pwd)/google-cloud-sdk/bin"

make application.dependencies
make application.content
make container.build.nginx
make container.push.nginx
make deploy
