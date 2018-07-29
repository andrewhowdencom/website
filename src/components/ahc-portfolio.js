/**
 * Copyright (c) 2018 Andrew Howden. All rights reserved.
 *
 * This copyright does not apply where other licenses override it.
 */

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

// These are the elements needed by this element
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';

class AhcPortfolio extends PageViewElement {
    _render(props) {
       return html`${SharedStyles}
       <custom-style>
         <style is="custom-style">
            #portfolio {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: center;
            }

            #portfolio > paper-card {
              box-sizing: border-box;
              max-width: 500px;
              margin: 3px;
              flex: 1 1 auto;
            }
         </style>
       </custom-style>
       <section>
         <div id="portfolio">
           <paper-card heading="Mageaudit"
                       image="/images/portfolio/mageaudit.jpg">
           <div class="card-content">
             <h3>Port the MageAudit Magento analysis tool from Laravel 2 to Magento 1.x</h3>
             <p>Most of the analysis existed, however the initial design had some inefficient designs, and the
                opportunity was taken to restructure the design to make additional analysis far easier to implement in
                future.</p>
             <p>MageAudit is <a href="https://www.fontis.com.au/mageaudit" target="_blank">still operating to this
                day.</a></p>
           </div>
           <div class="card-actions">
             <iron-icon src="/images/icons/skills.png"></iron-icon>
             <paper-button>PHP</paper-button>
             <paper-button>Magento</paper-button>
           </div>
           <div class="card-actions">
             <iron-icon icon="icons:home"></iron-icon>
             <paper-button>Fontis</paper-button>
           </div>
           </paper-card>
         </div>
       </section>
       `
    }
}

window.customElements.define('ahc-portfolio', AhcPortfolio);
