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

SECRET_CERT       := $(shell base64 -w 0 etc/tls/cert.pem)
SECRET_FULL_CHAIN := $(shell base64 -w 0 etc/tls/fullchain.pem)
SECRET_PRIVKEY    := $(shell base64 -w 0 etc/tls/privkey.pem)

TIMESTAMP := $(shell date "+%s")

help: ## Show this menu
	@echo -e $(ANSI_TITLE)www.andrewhowden.com$(ANSI_OFF)$(ANSI_SUBTITLE)" - Andrew Howden's personal website"$(ANSI_OFF)
	@echo -e $(ANSI_TITLE)Commands:$(ANSI_OFF)
	@grep -E '^[a-zA-Z_-%]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[32m%-30s\033[0m %s\n", $$1, $$2}'

app-version: ## Update application version
	sed -i "s/{{ APP_VERSION }}/$(APP_VERSION)/" "site/static/serviceworker.js"
	sed -i "s/{{ APP_VERSION }}/$(APP_VERSION)/" "site/static/js/app.js"
	sed -i 's/AppVersion: .*/AppVersion: "$(APP_VERSION)"/' site/config.yml

push-container-%: ## Tags and pushes a container to the repo
	docker tag ${CONTAINER_NS}/$*:${GIT_HASH} gcr.io/${GCR_NAMESPACE}/${PROJECT_NS}-$*:${GIT_HASH}
	gcloud docker -- push gcr.io/${GCR_NAMESPACE}/${PROJECT_NS}-$*:${GIT_HASH}

push-tls-certificates: ## Push an update to the TLS Certificate secret
	sed "s/{{CERT}}/${SECRET_CERT}/" build/kubernetes/nginx-etc-tls.yml | sed -e "s/{{FULL_CHAIN}}/${SECRET_FULL_CHAIN}/" | sed -e "s/{{PRIVKEY}}/${SECRET_PRIVKEY}/" | kubectl create -f -

build-container-%: ## Builds the $* container, and tags it with the git hash.
	docker build --no-cache -t ${CONTAINER_NS}/$*:${GIT_HASH} -f build/docker/$*/Dockerfile .

clean: ## Remove all compiled resources
	rm -rf site/static/css/*
	rm -rf site/static/fonts/*

content: ## Build Hugo site
	cd site && hugo

images: ## Generate images
	cp site/bower_components/Font-Awesome-SVG-PNG/black/svg/* site/static/images/icons/

js: ## Create the JavaScript resources
	- mkdir -p site/static/js
	cp --dereference --recursive site/src/js site/static
	uglifyjs site/src/serviceworker.js --output site/static/serviceworker.js --source-map site/static/serviceworker.js.map
	make app-version

styles: ## Make SCSS
	sed -i 's/CssVersion: .*/CssVersion: "${TIMESTAMP}"/' site/config.yml
	rm -rf site/static/css/styles-* # Clean previous CSS
	sassc --sourcemap --style=compressed site/src/scss/styles.scss site/static/css/styles.css
	# Do the css
	mkdir -p site/static/css/components
	mkdir -p site/static/css/vendor
	postcss --config=postcss.json site/src/css/components/* --dir site/static/css/components	
	postcss --config=postcss.json site/src/css/vendor/*     --dir site/static/css/vendor

fonts: ## Move the fonts into the appropriate dir
	# Materials Design
	rm -rf site/static/fonts//*
	cp site/bower_components/material-design-icons/iconfont/MaterialIcons* site/static/fonts/
	cd site/static/fonts && rename "s/\./\.${TIMESTAMP}\./" *
	sed -i "s/\$$materials-design-timestamp:.*/\$$materials-design-timestamp: '${TIMESTAMP}';/" site/src/scss/_variables.scss

static: fonts styles ## Compile all static assets
	echo "Static Compiled"

deploy: ## Deploys the app
	helm upgrade --install \
	    www-andrewhowd \
	    deploy/helm/www-andrewhowden-com/ \
	    --set="siteVersion=$(GIT_HASH)"
	
