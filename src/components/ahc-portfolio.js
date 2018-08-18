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

                paper-card:nth-of-type(2n),
                paper-card:nth-of-type(3) {
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
             <paper-card heading="${i.title}">
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
                            id: 'a2d603bc-9f29-11e8-8e33-931c0083bdde',
                            title: "Port the MageAudit Magento analysis tool from Laravel 2 to Magento 1.x",
                            content: 'Most of the analysis existed, however the initial design had some inefficient designs, and the opportunity was taken to restructure the design to make additional analysis far easier to implement in future. MageAudit is still operating to this day.',
                            skills: [
                                'PHP', 'Magento'
                            ],
                            company: 'Fontis'
                        },
                        {
                            id: 'ad0c02c8-9f29-11e8-94a5-bb7f01112aaf',
                            title: "Drafted the incident response framework, structuring crisis management response",
                            content: "This involved creating the processes for declaring an 'incident', managing staff reallocation for the crisis and creating effective post-mortems to prevent issue recurrence. This framework has been used successfully for over a year to manage a wide variety of unexpected but critical system failures with minimal stress, clear communication with stakeholders and a systematic reduction of risk across otherwise risky systems.",
                            skills: [
                                'Communication', 'Crisis Management'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '1b04d05a-a2b5-11e8-9fbc-4fb2b8fda64f',
                            title: "Collaboratively detect, analyse and remediate a compromised machine",
                            content: "This started as a routine investigation into unscheduled unavailability for > 5 minutes, triggering an alert. The unavailability was traced to a reboot, which was in turn triggered by a malicious actor to gain persistent root privileges. Detection involved scanning through the system log until we detected hardware USB insert events, at which point the data center was called for further information. Having no physical access recorded to the device, we discovered the IMPI interface and promptly disabled it. Remediation involved reflashing the machine with a new copy of the operating system, and using an Ansible definition to restore the machine to a known good state. The unauthorised access was detected and removed within approximately 3 hours, thanks to previously implemented time series data monitoring. Follow up work implemented the system monitoring tooling 'Falco', the remote analysis tool 'OSQuery' as well as log aggregation and other system utilities.",
                            skills: [
                                'Linux', 'Ansible', 'Security'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'b3acb762-9f29-11e8-bd6e-6b6aee3a319c',
                            title: "Writing an Ansible specification for deploying Kubernetes onto a CoreOS Cluster on Google Cloud",
                            content: "Still ongoing, but the goal is to have a Kubernetes stack that can be run on anything from bare metal to a cloud provider. This involved creating and understanding Systemd service units and how to drain CoreOS nodes of their Kubernetes workloads prior to the automated reboot scheduled by system upgrades.",
                            skills: [
                                'Ansible', 'CoreOS', 'Kubernetes', 'Linux'
                            ],
                            company: 'Fontis'
                        },
                        {
                            id: 'b8639f5a-9f29-11e8-9a4b-333f4fa17870',
                            title: "Redesign of the Bing Lee checkout",
                            content: "A complete reimplementation of a one step checkout, requiring as little information from the user as is required by the other information specified during the checkout. This required considerable restructuring of Magentos core validation logic, additional validation and reasonably complex implementation of various JavaScript driven features.",
                            skills: [
                                'JavaScript', 'PHP', 'Magento'
                            ],
                            company: 'Fontis'
                        },
                        {
                            id: 'bc83b02a-9f29-11e8-94a9-dba2c3dad045',
                            title: "Rebuilding the GAZ MAN website as a mobile first website",
                            content: "The design for the desktop site was kept as similar as possible to the current design, but the design was ported to bootstrap 3.x and made responsive.",
                            skills: [
                                'CSS', 'JavaScript', 'PHP', 'Bootstrap'
                            ],
                            company: 'Fontis'
                        },
                        {
                            id: '0dcbc9a4-9f2a-11e8-ad70-975c4f96174c',
                            title: "Implemented time series data collection and alerting across production infrastructure.",
                            content: "This involved deploying the time series data collection tool 'Prometheus' and accompanying Grafana, Blackbox exporter and Pushgateway onto a Kubernetes cluster, writing Ansible playbooks to install the Prometheus 'exporter' or exposition binaries and configuring Prometheus and the appropriate reverse proxies to serve this data behind HTTPS and basic authentication. It additionally involved outreach in the dev team teaching how to read and understand time series data, particularly with regards to the Prometheus tooling.",
                            skills: [
                                'Prometheus', 'Kubernetes', 'Ansible', 'Communication'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'c0983938-9f29-11e8-9c36-7330ad0c79b4',
                            title: "Deploy a backup strategy for Kubernetes based on LVM snapshots",
                            content: "This involved finding and working with a package maintainer to implement a tool that made disk snapshots on a schedule defined on disk metadata.",
                            skills: [
                                'Kubernetes', 'Helm', 'Python'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'd330bd54-9f29-11e8-94c4-2fdbc8df2dee',
                            title: "Create continuous delivery pipelines based on Kubernetes, Ansible",
                            content: "This involved creating a multi-step pipeline based on the BitBucket pipelines product. Specific issues that required solving were ensuring idempotency and reproducability with the build, allowing deployment to multiple environments, allowing tearing down of created environments, delivering to production safely and reliably and allowing automated restoration of production systems in the case of build failure.",
                            skills: [
                                "Ansible", "Kubernetes", "Pipelines", "Bash", "Python"
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '762ec4ce-4178-4664-9e68-e96b0e4a9c93',
                            title: 'Implement image optimisation based on browser window size',
                            content: 'During a periodic analysis of a web service with the tool "Lighthouse", it was determined that the images are improperly sized given the bounds they\'re displayed in. To resolve this, the image proxy "Thumbor" was implemented, generating images that were stripped and degraded to reduce their size. Additionally and where possible, images were sized based on the Client Hints device width specification to further reduce the page weight.',
                            skills: [
                                'Web', 'Python', 'Ansible', 'Thumbor', 'JavaScript', 'Lighthouse'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'b8a7dd8c-a2c6-11e8-acb0-e7514a582152',
                            title: 'Completed the "Certified Kubernetes Administrator" exam',
                            content: 'As part of an effort to further increase adoption of the Kubernetes software orchestration tooling and to demonstrate capability to executive stakeholders I completed the "Certified Kubernetes Administrator" exam. Additionally, I am helping others to prepare and take the exam within the next 12 months.',
                            skills: [
                                'Kubernetes', 'Linux'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '28c05860-a2c7-11e8-996b-d7568421bdfc',
                            title: 'Diagnosed silent network failures that allowed MySQL replication to lag out of sync',
                            content: 'One of the replicated databases operated as part of the infrastructure periodically failed to replicate until it drifted so far out of sync it needed to be manually reconciled. This involved doing a TCPDump of the connection, spotting the TCP RST and seeing that MySQL did not detect the connection, still waiting on "Waiting for master to send event". Further investigation determined this happened after a long period without any other traffic, and that the issue is fairly common with the AWS stateful firewall pruning connections. The solution was to reduce the heartbeat for the SQL connection to ~60 seconds.',
                            skills: [
                                'MySQL', 'Amazon Web Services', 'Networking'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'b3e28e5c-a2c9-11e8-b1a6-fb2ee9838b59',
                            title: 'Started writing content on a Medium blog',
                            content: 'As part of ongoing efforts to impart knowledge to other colleagues and to increase the perception of both personal and corporate technical competence I started writing articles of a fairly technical nature on Medium. These have proven extremely useful in internal discussions as well as have a monthly readership of > 1000 people.',
                            skills: [
                                'English', 'Writing', 'Communication'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'b3e28e5c-a2c9-11e8-b1a6-fb2ee9838b59',
                            title: 'Assisted in general preparation for the General Data Protection Regulation',
                            content: 'With the GDPR being enforceable from May 1st, 2018 a general audit was conducted of company software, systems and processes to determine whether there were any safety and privacy violations. Though the audit showed nothing serious, various improvements were made to data anonymisation and various software systems that employees had picked up without clear privacy policies were migrated to other software systems. A list of all software was written and is maintained, and data protection agreements signed with all software suppliers. Lastly, stricter guidelines were written for the use of work computers, limiting their personal use to prevent the inadvertent leakage of customer data to third party services.',
                            skills: [
                                'Security', 'Communication', 'Legal'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'd0d60d6c-a2ca-11e8-8e46-3362eeff117d',
                            title: 'Transitioned between teams',
                            content: 'As part of ongoing professional development I\'ve been able to develop a reasonable expertise in systems administration. This expertise was a better fit for another, larger project and I was thus transferred. This involved handing over the project to other colleagues and ensuring they understood and could debug all systems associated. This was largely smooth due to the habit of ongoing documentation for all changes in git, and a limited amount of documentation during the transition betwen projects.',
                            skills: [
                                'Communication'
                            ],
                            company: 'Sitewards'
                        }
                    ]
                }
            }
        }
    }
}

window.customElements.define('ahc-portfolio', AhcPortfolio);
