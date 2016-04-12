#!/bin/bash

set -x

scss-lint || true # We do not want this to break the build. Just see if it works
