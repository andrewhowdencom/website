#!/bin/bash

set -e

# Find all the changed containers
CHANGED_CONTAINERS=$(git diff --name-only master | grep 'build\/docker' | sed -e 's/build\/docker\///' | sed -e 's/\/Dockerfile//');

# Build them
for CONTAINER in "${CHANGED_CONTAINERS}"; do
    make "build-container-${CONTAINER}"
    make "push-container-${CONTAINER}"
done
