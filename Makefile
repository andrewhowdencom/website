# Task runner

.PHONY: help build

.DEFAULT_GOAL := help

SHELL := /bin/bash

IT_HASH     := $(shell git rev-parse --short HEAD)

ANSI_TITLE        := '\e[1;32m'
ANSI_CMD          := '\e[0;32m'
ANSI_TITLE        := '\e[0;33m'
ANSI_SUBTITLE     := '\e[0;37m'
ANSI_WARNING      := '\e[1;31m'
ANSI_OFF          := '\e[0m'

PATH_DOCS                := $(shell pwd)/docs
PATH_BUILD_CONFIGURATION := $(shell pwd)/build

TIMESTAMP := $(shell date "+%s")

help: ## Show this menu
	@echo -e $(ANSI_TITLE)andrewhowden-com$(ANSI_OFF)$(ANSI_SUBTITLE)" - Common tasks for the resume website"$(ANSI_OFF)
	@echo -e "\nUsage: $ make \$${COMMAND} \n"
	@echo -e "Variables use the \$${VARIABLE} syntax, and are supplied as environment variables before the command. For example, \n"
	@echo -e "  \$$ VARIABLE="foo" make help\n"
	@echo -e $(ANSI_TITLE)Commands:$(ANSI_OFF)
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[32m%-30s\033[0m %s\n", $$1, $$2}'

compile: ## Creates the website
	asciidoctor src/docs/* --destination-dir public/
	asciidoctor-pdf src/docs/index.adoc --out-file public/media/pdf/resume.pdf
