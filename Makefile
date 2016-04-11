# Task runner

.PHONY: help build

.DEFAULT_GOAL := help

SHELL := /bin/bash

PROJECT_NS   := www-andrewhowden-com
CONTAINER_NS := www-andrewhowden-com
GIT_HASH     := $(shell git rev-parse --short HEAD)

ANSI_TITLE        := '\e[1;32m'
ANSI_CMD          := '\e[0;32m'
ANSI_TITLE        := '\e[0;33m'
ANSI_SUBTITLE     := '\e[0;37m'
ANSI_WARNING      := '\e[1;31m'
ANSI_OFF          := '\e[0m'

PATH_DOCS                := $(shell pwd)/docs
PATH_BUILD_CONFIGURATION := $(shell pwd)/build

GCR_NAMESPACE := littleman-co

SECRET_CERT       := $(shell base64 -w 0 etc/tls/cert.pem)
SECRET_FULL_CHAIN := $(shell base64 -w 0 etc/tls/fullchain.pem)
SECRET_PRIVKEY    := $(shell base64 -w 0 etc/tls/privkey.pem)

help: ## Show this menu
	@echo -e $(ANSI_TITLE)www.andrewhowden.com$(ANSI_OFF)$(ANSI_SUBTITLE)" - Andrew Howden's personal website"$(ANSI_OFF)
	@echo -e $(ANSI_TITLE)Commands:$(ANSI_OFF)
	@grep -E '^[a-zA-Z_-%]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[32m%-30s\033[0m %s\n", $$1, $$2}'

push-container-%: ## Tags and pushes a container to the repo
	docker tag ${CONTAINER_NS}/$*:${GIT_HASH} gcr.io/${GCR_NAMESPACE}/${PROJECT_NS}-$*:${GIT_HASH}
	docker push gcr.io/${GCR_NAMESPACE}/${PROJECT_NS}-$*:${GIT_HASH}

push-tls-certificates: ## Push an update to the TLS Certificate secret
	sed "s/{{CERT}}/${SECRET_CERT}/" build/kubernetes/nginx-etc-tls.yml | sed -e "s/{{FULL_CHAIN}}/${SECRET_FULL_CHAIN}/" | sed -e "s/{{PRIVKEY}}/${SECRET_PRIVKEY}/" | kubectl create -f -

build-container-%: ## Builds the $* (gollum) container, and tags it with the git hash.
	docker build -t ${CONTAINER_NS}/$*:${GIT_HASH} -f build/docker/$*/Dockerfile .

deploy-container-%: build-container-% push-container-% ## Pushes a container to GCR. Will eventually update Kubernetes
	echo "Deployed"

css:
	sassc --sourcemap --style=compressed site/static/scss/styles.scss site/static/css/styles.css

static: css
	echo "Coming soon!"
