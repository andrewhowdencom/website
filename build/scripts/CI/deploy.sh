#!/bin/bash

set -ex

export PATH="${PATH}:$(pwd)/bin"
echo "${PATH}"

make deploy-container-nginx
