#!/bin/bash

set -e

# Decrypt the tar file
openssl aes-256-cbc -K $encrypted_33efbe80436a_key -iv $encrypted_33efbe80436a_iv -in .secrets.tar.gz.enc -out .secrets.tar.gz -d

# Unpack the file
tar -xvf .secrets.tar.gz
