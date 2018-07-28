[![Built with pwa–starter–kit](https://img.shields.io/badge/built_with-pwa–starter–kit_-blue.svg)](https://github.com/Polymer/pwa-starter-kit "Built with pwa–starter–kit")
[![Build status](https://api.travis-ci.org/Polymer/pwa-starter-kit.svg?branch=template-responsive-drawer-layout)](https://travis-ci.org/Polymer/pwa-starter-kit)

# PWA Starter Kit -- `template-responsive-drawer-layout`

This sample app is a starting point for building PWAs. Out of the box, the template
gives you the following features:
- all the PWA goodness (manifest, service worker)
- a responsive layout
- application theming
- example of using Redux for state management
- offline UI
- simple routing solution
- fast time-to-interactive and first-paint through the PRPL pattern
- easy deployment to prpl-server or static hosting
- unit and integrating testing starting points
- documentation about other advanced patterns.

This template is very similar to the `master` template, in the sense that it keeps both Redux for state management, and all of the UI elements. The main difference is that the wide screen layout displays a persistent `app-drawer`, inline with the content.

### 📖Head over to the [documentation site](https://polymer.github.io/pwa-starter-kit/) for more details or check out [how to get started](https://polymer.github.io/pwa-starter-kit/setup/)!

![pwa-starter-kit screenshot](https://user-images.githubusercontent.com/116360/39718020-dd60403e-51e9-11e8-9384-e019a6775841.png)

## Known issues
These are high priority and currently being worked on, and they will all be fixed before the 1.0 release:
- `lit-element` and `lit-html` have IE11 compatibility issues
- if you have Node version 10, you might have problems running the unit tests (and you will get an error along the lines of `Cannot read property '1' of null`. For now, we recommend using node 8 or 9.

## TODOs
- [x] setup Safari testing on Travis
- [ ] update to latest [material-design-web-components](https://github.com/material-components/material-components-web-components)
- [x] deploy all templates as demos
