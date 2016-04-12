#!/bin/bash

LIBSASS_VERSION="3.3.4"
SASSC_VERSION="3.3.4"
SASS_LIBSASS_PATH="$(pwd)/libsass"

git clone git@github.com:sass/libsass.git
cd libsass
git checkout ${LIBSASS_VERSION}
cd ../

git clone https://github.com/sass/sassc.git
cd sassc
git checkout ${SASSC_VERSION}
make && make install
