#!/usr/bin/env bash

set -e

GOOGLE_CLOUD_VERSION=103.0.0
HUGO_VERSION=0.15
KUBECTL_VERSION=1.2.1
PATH=$PATH:$(pwd)/bin

# Defined in Travis
# GCR_PROJECT
# GCR_REGION
# KUBERNETS_CLUSTER

mkdir bin

# Install Google Cloud
# Need pyopenssl for gcloud, and need to install it via pip. See https://docs.travis-ci.com/user/languages/python
# Needs sudo to install pip
# Also needs additional libraries: http://urllib3.readthedocs.org/en/latest/security.html#openssl-pyopenssl
sudo pip install --upgrade pyopenssl ndg-httpsclient pyasn1

# Hugo needs pygments for code highlighting
sudo pip install --upgrade pygments

wget "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${GOOGLE_CLOUD_VERSION}-linux-x86_64.tar.gz"
tar -xvf google-cloud-sdk-${GOOGLE_CLOUD_VERSION}-linux-x86_64.tar.gz

google-cloud-sdk/install.sh --additional-components bq core gsutil gcloud alpha beta kubectl --quiet

# Install Hugo
wget "https://github.com/spf13/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_linux_amd64.tar.gz"
tar -xvf hugo_${HUGO_VERSION}_linux_amd64.tar.gz
mv hugo_${HUGO_VERSION}_linux_amd64/hugo_${HUGO_VERSION}_linux_amd64 ./bin/hugo
