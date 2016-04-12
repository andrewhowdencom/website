#!/bin/bash

set -e

# Sassc installs to ${HOME}/${BIN}. More generally, new binaries should probably
# go here anyway.
export PATH="${PATH}:${HOME}/bin"

# Find all the changed containers
CHANGED_CONTAINERS=$(git diff --name-only master | grep 'build\/docker' | sed -e 's/build\/docker\///' | sed -e 's/\/Dockerfile//');

make deploy-container-nginx
