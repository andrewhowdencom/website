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
google-cloud-sdk/bin/gcloud auth activate-service-account ${GCR_SERVICE_ACCOUNT} --key-file .gcloud.json
google-cloud-sdk/bin/gcloud config set project ${GCR_PROJECT}
google-cloud-sdk/bin/gcloud config set compute/zone ${GCR_REGION}
google-cloud-sdk/bin/gcloud config set container/cluster ${KUBERNETES_CLUSTER}

# Auth Kube
google-cloud-sdk/bin/gcloud container clusters get-credentials ${KUBERNETES_CLUSTER}

# Set the context for kube
export CONTEXT=$(google-cloud-sdk/bin/kubectl config view | grep current-context | awk '{print $2}')
google-cloud-sdk/bin/kubectl config set-context $CONTEXT --namespace=${KUBE_NAMESPACE}

