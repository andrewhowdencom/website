#!/bin/bash

set -x

gem install scss_lint || true # We do not want this to break the build. Just see if it works
