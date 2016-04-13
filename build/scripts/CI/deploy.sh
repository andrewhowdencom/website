#!/bin/bash

set -e

# Default bin
export PATH="${PATH}:$(pwd)/bin"

# Google Cloud bin
export PATH="${PATH}:$(pwd)/google-cloud-sdk/bin"

make content
make deploy-container-nginx
