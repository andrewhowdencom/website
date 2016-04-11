#!/bin/bash

set -ex

# fetch the hash
GIT_HASH=$(git rev-parse --short HEAD)

# Fetch the most recent deployment tag
PREVIOUS_BUILD=$(git describe --tags `git rev-list --tags --max-count=1` | grep -oE '[0-9]+')

# Increment the build
((CURRENT_BUILD=PREVIOUS_BUILD+1))

# Format the tag
BUILD_TAG="deployment-$(printf "%04d" $CURRENT_BUILD)"
BUILD_MSG="Deployment #$(printf "%04d" $CURRENT_BUILD)"

# Tag the commit
git notes append "$GIT_HASH" -m "Deployment Success"
git tag -a "${BUILD_TAG}" -m "${BUILD_MSG}"
git push origin "refs/tags/${BUILD_TAG}"

# Push the notes to origin
git push origin refs/notes/*
>&2 echo "$TRAVIS_BUILD_NUMBER"
>&2 echo "$TRAVIS_JOB_NUMBER"
>&2 echo "$TRAVIS_JOB_ID"
