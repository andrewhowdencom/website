#!/bin/bash

set -ex

export PATH="${PATH}:$(pwd)/bin"

make deploy-container-nginx
