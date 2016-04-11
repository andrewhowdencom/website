#!/bin/bash

set -e

# Decrypt the tar file
openssl aes-256-cbc -K $encrypted_1fa1ae5fd8c9_key -iv $encrypted_1fa1ae5fd8c9_iv -in .secrets.tar.gz.enc -out .secrets.tar.gz -d

# Unpack the file
tar -xvf .secrets.tar.gz
