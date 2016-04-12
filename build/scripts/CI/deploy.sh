#!/bin/bash

set -e

export PATH="${PATH}:$(pwd)/bin"
echo "${PATH}"

make deploy-container-nginx
