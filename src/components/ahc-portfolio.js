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
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';

import { repeat} from 'lit-html/lib/repeat.js';

class AhcPortfolio extends PageViewElement {
    _render(props) {
       return html`${SharedStyles}
       <custom-style>
         <style is="custom-style">
            #portfolio {
              @apply(--layout-horizontal);
              @apply(--layout-wrap);

              width: 100%;
              box-sizing: border-box;
              justify-content: space-between;
            }

            #portfolio > paper-card {
              box-sizing: border-box;
              flex: 1 0 auto;
            }

            paper-card {
                width: 100%;
                display: flex;
                flex-direction: column;
                margin-right: 4px;
                margin-bottom: 4px;
            }

            .card-content {
                flex: 1 0 auto;
            }

            @media (min-width: 768px) {
                paper-card {
                    width: 33%;
                }

                paper-card:nth-of-type(2n) {
                    width: 66%;
                }


                paper-card:nth-of-type(4n) {
                    width: 33%;
                }
            }
         </style>
       </custom-style>
       <section id="portfolio">
         ${repeat(AhcPortfolio.properties.portfolio.value(), (i) => i.id, (i, index) => html`
             <paper-card heading="${i.subtitle}">
             <div class="card-content">
               <p>${i.content}</p>
             </div>
             <!--
             <div class="card-actions">
               <iron-icon src="/images/icons/skills.png"></iron-icon>
               <paper-button>PHP</paper-button>
               <paper-button>Magento</paper-button>
             </div>
             -->
             <div class="card-actions">
               <iron-icon icon="icons:home"></iron-icon>
               <paper-button>${i.company}</paper-button>
             </div>
             </paper-card>
         `)}
       </section>
       `
    }

    static get properties() {
        return {
            active: Boolean,
            portfolio: {
                value() {
                    return [
                        {
                            id: 0,
                            title: "MageAudit",
                            subtitle: "Port the MageAudit Magento analysis tool from Laravel 2 to Magento 1.x",
                            content: 'Most of the analysis existed, however the initial design had some inefficient designs, and the opportunity was taken to restructure the design to make additional analysis far easier to implement in future. MageAudit is still operating to this day.',
                            skills: [
                                'PHP', 'Magento'
                            ],
                            company: 'Fontis'
                        },
                        {
                            id: 1,
                            title: "Kubernetes on CoreOS",
                            subtitle: "Writing an Ansible specification for deploying Kubernetes onto a CoreOS Cluster on Google Cloud",
                            content: "Still ongoing, but the goal is to have a Kubernetes stack that can be run on anything from bare metal to a cloud provider. This involved creating and understanding Systemd service units and how to drain CoreOS nodes of their Kubernetes workloads prior to the automated reboot scheduled by system upgrades.",
                            skills: [
                                'Ansible', 'CoreOS', 'Kubernetes', 'Linux'
                            ],
                            company: 'Fontis'
                        },
                        {
                            id: 2,
                            title: "Checkout redesign",
                            subtitle: "Redesign of the Bing Lee checkout",
                            content: "A complete reimplementation of a one step checkout, requiring as little information from the user as is required by the other information specified during the checkout. This required considerable restructuring of Magentos core validation logic, additional validation and reasonably complex implementation of various JavaScript driven features.",
                            skills: [
                                'JavaScript', 'PHP', 'Magento'
                            ],
                            company: 'Fontis'
                        },
                        {
                            id: 3,
                            title: "GAZ MAN redesign",
                            subtitle: "Rebuilding the GAZ MAN website as a mobile first website",
                            content: "The design for the desktop site was kept as similar as possible to the current design, but the design was ported to bootstrap 3.x and made responsive.",
                            skills: [
                                'CSS', 'JavaScript', 'PHP', 'Bootstrap'
                            ],
                            company: 'Fontis'
                        }
                    ]
                }
            }
        }
    }
}

window.customElements.define('ahc-portfolio', AhcPortfolio);
