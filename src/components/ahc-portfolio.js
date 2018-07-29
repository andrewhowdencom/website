/**
 * Copyright (c) 2018 Andrew Howden. All rights reserved.
 *
 * This copyright does not apply where other licenses override it.
 */

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class AhcPortfolio extends PageViewElement
{
    _render(props) {
        return 'Hi';
    }
}

window.customElements.define('ahc-portfolio', AhcPortfolio);