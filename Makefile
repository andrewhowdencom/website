# Task runner

.PHONY: help build deploy

.DEFAULT_GOAL := help

APP_VERSION := $(shell date +%s)

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

TIMESTAMP := $(shell date "+%s")

help: ## Show this menu
	@echo -e $(ANSI_TITLE)www.andrewhowden.com$(ANSI_OFF)$(ANSI_SUBTITLE)" - Andrew Howden's personal website"$(ANSI_OFF)
	@echo -e $(ANSI_TITLE)Commands:$(ANSI_OFF)
	@grep -E '^[a-zA-Z_-%]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[32m%-30s\033[0m %s\n", $$1, $$2}'

container.push.%: ## Tags and pushes a container to the repo
	docker tag ${CONTAINER_NS}/$*:${GIT_HASH} gcr.io/${GCR_NAMESPACE}/${PROJECT_NS}-$*:${GIT_HASH}
	gcloud docker -- push gcr.io/${GCR_NAMESPACE}/${PROJECT_NS}-$*:${GIT_HASH}

container.build.%: ## Builds the $* container, and tags it with the git hash.
	docker build --no-cache -t ${CONTAINER_NS}/$*:${GIT_HASH} -f deploy/docker/$*/Dockerfile .

application.dependencies: ## Install application dependencies
	npm install

application.content: ## Build site
	polymer build

deploy: clean app-version content styles js fonts build-container-nginx push-container-nginx ## Deploys the app
	helm upgrade --install \
	    www-andrewhowd \
	    deploy/helm/www-andrewhowden-com/ \
	    --set="siteVersion=$(GIT_HASH)"
	
