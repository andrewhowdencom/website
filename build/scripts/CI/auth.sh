#!/bin/bash

# Terminate on first failure
set -e

# Set in Travis
# GCR_REGION
# GCR_PROJECT
# KUBERNETS_CLUSTER

KUBE_NAMESPACE=www-andrewhowden-com

# Google Cloud bin
export PATH="${PATH}:$(pwd)/google-cloud-sdk/bin"

# Source .bashrc
. /home/travis/.bashrc

# Auth Gcloud
gcloud auth activate-service-account ${GCR_SERVICE_ACCOUNT} --key-file .gcloud.json
gcloud config set project ${GCR_PROJECT}
gcloud config set compute/zone ${GCR_REGION}
gcloud config set container/cluster ${KUBERNETES_CLUSTER}

# Auth Kube
gcloud container clusters get-credentials ${KUBERNETES_CLUSTER}

# Set the context for kube
export CONTEXT=$(kubectl config view | grep current-context | awk '{print $2}')
kubectl config set-context $CONTEXT --namespace=${KUBE_NAMESPACE}

# Auth Docker
docker login -e ${GCR_SERVICE_ACCOUNT} -u _token -p "$(google-cloud-sdk/bin/gcloud auth print-access-token)" https://gcr.io

# Reset the github URL so we can use the privkey
REPO_URL=$(git config --get remote.origin.url)
SSH_URL=$(echo "$REPO_URL" | sed 's/https:\/\/github.com\//git@github.com:/' | sed 's/git\//git/')

git remote set-url origin "$SSH_URL"
