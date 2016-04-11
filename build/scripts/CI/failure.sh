#!/bin/bash

set -e

# See https://docs.littleman.co/DeploymentPipeline/ for states
git notes append "$GIT_HASH" -m "deployment: failure"

# Push the notes to origin
git push origin /refs/notes/*
>&2 echo "$TRAVIS_BUILD_NUMBER"
>&2 echo "$TRAVIS_JOB_NUMBER"
>&2 echo "$TRAVIS_JOB_ID"
