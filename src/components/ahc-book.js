/**
 * Copyright (c) 2018 Andrew Howden. All rights reserved.
 *
 * This copyright does not apply where other licenses override it.
 */

import { html } from '@polymer/lit-element';

// These are the elements needed by this element
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import {LitElement} from "@polymer/lit-element/lit-element";

class AhcBook extends LitElement {
    _render(props) {
        console.log(props);
        return html`
            <div>Hello, Book</div>
        `
    }

    static get properties()
    {
        return {
            caption: String,
            author: String
        }
    }
}

window.customElements.define('ahc-book', AhcBook);