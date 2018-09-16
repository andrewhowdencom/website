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

            .card-actions iron-icon {
                margin-right: 4px;
            }

            .links {
                padding-left: 20px;
                list-style-type: lower-alpha;
            }

            .links:empty {
                display: none;
            }
         </style>
       </custom-style>
       <section id="portfolio">
         ${repeat(AhcPortfolio.properties.portfolio.value(), (i) => html`
             <paper-card heading="${i.title}">
             <div class="card-content">
               <p>${i.content}</p>
               <p>${i.links ? 'Further details available at:': ''}</p>
               <ul class="links">${i.links ? repeat(i.links, (j) => html`<li><a href="${j.href}" target="_blank" rel="noopener">${j.caption}</a>`) : ''}</ul>
             </div>
             <div class="card-actions">
               <iron-icon src="/images/icons/skills.png"></iron-icon><em>${i.skills.join(', ')}</em><br />
               <iron-icon icon="icons:home"></iron-icon><em>${i.company}</em>
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
                            links: [
                                {
                                    caption: 'The MageAudit tool',
                                    href: 'https://www.fontis.com.au/mageaudit'
                                },
                                {
                                    caption: 'The MageAudit release blog',
                                    href: 'https://www.fontis.com.au/blog/mageaudit-updated-report-history'
                                }
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
                            links: [
                                {
                                    caption: 'An explanation of the incident response process',
                                    href: 'https://medium.com/sitewards/i-hereby-declare-this-an-incident-4219ba2573a6'
                                },
                                {
                                    caption: 'A gentle introduction to post mortems to be systematic about finding issues',
                                    href: 'https://medium.com/@andrewhowdencom/trust-me-i-know-what-im-doing-8d36de464dc4'
                                }
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '1b04d05a-a2b5-11e8-9fbc-4fb2b8fda64f',
                            title: "Collaboratively detect, analyse and remediate a compromised machine",
                            content: "This started as a routine investigation into unscheduled unavailability for > 5 minutes, triggering an alert. The unavailability was traced to a reboot, which was in turn triggered by a malicious actor to gain persistent root privileges. Detection involved scanning through the system log until we detected hardware USB insert events, at which point the data center was called for further information. Having no physical access recorded to the device, we discovered the IPMI interface and promptly disabled it. Remediation involved reflashing the machine with a new copy of the operating system, and using an Ansible definition to restore the machine to a known good state. The unauthorised access was detected and removed within approximately 3 hours, thanks to previously implemented time series data monitoring. Follow up work implemented the system monitoring tooling 'Falco', the remote analysis tool 'OSQuery' as well as log aggregation and other system utilities.",
                            skills: [
                                'Linux', 'Ansible', 'Security'
                            ],
                            links: [
                                {
                                    caption: 'A gentle introduction to evaluating security',
                                    href: 'https://medium.com/sitewards/am-i-secure-b080aff2fe17'
                                },
                                {
                                    caption: 'A description of our obligation to keep data safe with reference to the GDPR',
                                    href: 'https://medium.com/sitewards/on-the-obligation-under-gpdr-to-handle-data-safely-eac9831c0e83'
                                },
				{
				    caption: 'An extensive tutorial about how to deploy content on Kubernetes, written while writing this deployment',
				    href: 'https://medium.com/@andrewhowdencom/deploying-on-kubernetes-1-the-use-case-b4c201e2f049'
				}

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
                            links: [
                                {
                                    caption: 'The Bing Lee eCommerce store',
                                    href: 'https://www.binglee.com.au/'
                                }
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
                            links: [
                                {
                                    caption: 'The GAZ MAN eCommerce store',
                                    href: 'https://www.gazman.com.au/'
                                }
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
                            links: [
                                {
                                    caption: 'A guide to implementing Prometheus across disparate systems',
                                    href: 'https://medium.com/sitewards/one-approach-to-implementing-prometheus-across-disparate-systems-b87f2009b8be'
                                }
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
                            links: [
                                {
                                    caption: 'A description of the release pipeline, including CI/CD',
                                    href: 'https://medium.com/sitewards/one-take-on-release-management-20dc202e8762'
                                }
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
                            links: [
                                {
                                    caption: 'Some notes about making production simpler with containers',
                                    href: 'https://medium.com/sitewards/simpler-production-with-containers-f9b355087b12'
                                }
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
                            links: [
                                {
                                    caption: 'The personal Medium blog',
                                    href: 'http://medium.com/@andrewhowdencom'
                                },
                                {
                                    caption: 'The Sitewards Medium blog',
                                    href: 'https://medium.com/sitewards'
                                }
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
                            links: [
                                {
                                    caption: 'A discussion about our responsibilities as development teams',
                                    href: 'https://medium.com/sitewards/your-services-our-computers-83a964992930'
                                }
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
                            links: [
                                {
                                    caption: 'Arguments for storing documentation canonically in version control',
                                    href: 'https://medium.com/sitewards/docs-in-jira-eh-github-mm-git-histories-fuck-yeah-1576cc5a6c39'
                                },
                                {
                                    caption: 'A guide to templating commit messages',
                                    href: 'https://medium.com/sitewards/git-tips-template-your-commit-messages-187d8a2051b8'
                                },
                                {
                                    caption: 'Some notes about the value of git commit messages',
                                    href: 'https://medium.com/sitewards/git-tips-the-memoir-of-commit-messages-7d15ed2205ac'
                                },
                                {
                                    caption: 'Some opinions on what makes a "good" commit message',
                                    href: 'https://medium.com/@andrewhowdencom/anatomy-of-a-good-commit-message-acd9c4490437'
                                }
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '9c5b3222-a31c-11e8-ab72-a3408d589219',
                            title: 'Implemented team analytics for health, mood and so on',
                            content: 'To help facilitate discussion around contentious issues as well as allow the systematic evaluation of team health, I worked with several team members to implement the office communication app "OfficeVibe". This has been used successfully for many months, and has helped the team to share their discussions frankly with the executive team.',
                            skills: [
                                'Communication'
                            ],
                            links: [
                                {
                                    caption: 'The OfficeVibe product',
                                    href: 'https://www.officevibe.com/'
                                }
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '9c5b34fc-a31c-11e8-ab73-dbf0bbcabb3c',
                            title: 'Implement a central organisational documentation system',
                            content: 'In my personal life, I find it easy to track the wealth of information I gather in some sort of structured data format, more recently being blog posts. After joining the company, I missed having such a system and felt it could be useful to other memebers of the team. Accordingly, we deployed Mediawiki onto a GKE cluster using Helm, which has since become the central "general information" knowledge repository for the organisation. It contains on-boarding procedures, helpful tips and other miscellaneous cultural knowledge that must otherwise be passed down in direct conversation.',
                            skills: [
                                'Communication',
                                'Google Cloud',
                                'Kubernetes',
                                'Helm'
                            ],
                            links: [
                                {
                                    caption: 'The mediawiki software',
                                    href: 'https://www.mediawiki.org/wiki/MediaWiki'
                                },
                                {
                                    caption: 'The Helm chart for Mediawiki',
                                    href: 'https://github.com/helm/charts/tree/master/stable/mediawiki'
                                }
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '9c5b3592-a31c-11e8-ab74-27f359103f7f',
                            title: 'Developing chart for the OSQuery fleet manager "Kolide/Fleet"',
                            content: 'As part of the knowledge gained from the aforementioned unauthorized system use, OSQuery was deployed across various projects. Unfortunately absent a mechanism to centrally manage OSQuery it proved of limited use. "kolide/fleet" is a OSQuery management tool that has excellent capabilities, a friendly user interface and generally exposes queryability of OSQuery well. Accordingly, I built and deployed a helm chart that installs OSQuery, and registered the deployed machines with it. At the time of writing however, more work is required to get the chart merged in.',
                            skills: [
                                'OSQuery',
                                'SQL',
                                'Linux',
                                'Kubernetes',
                                'Helm'
                            ],
                            links: [
                                {
                                    caption: 'The pull request',
                                    href: 'https://github.com/helm/charts/pull/5093'
                                },
                                {
                                    caption: 'The Kolide/Fleet product',
                                    href: 'https://github.com/kolide/fleet'
                                }
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'c49be324-a31e-11e8-93cf-47a9f8bb3790',
                            title: 'Helped foster a systematic employee feedback scheme',
                            content: 'As part of ongoing salary discussions the need for an objective evaluation of developer performance was required. This evaluation has now been developed and is in its prototypical stages, and should be rolled out across the team in the next 12 months.',
                            skills: [
                                'Negotiation',
                                'Communication'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '00db789a-a31f-11e8-90f2-d3a8b38f1971',
                            title: 'Steering the "Dev Share"; a regular knowledge share',
                            content: 'One of the nicer aspects of Sitewards is their continual investment in the upskilling of their development team. As part of this, the development team gathers once per week and shares some bespoke knowledge they\'ve gained. As much as possible I do not directly participate, preferring instead others to share their knowledge however I have presented on many occasions across a broad range of topics.',
                            skills: [
                                'Communication',
                                'Planning'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '4cd7c294-a31f-11e8-adc0-0f6b28a6a93d',
                            title: 'Explained publicly technological solutions to our solved problems',
                            content: 'As part of ongoing outreach and an attempt to build a set of centralised knowledge within the developer community I have participated in a number of local meetups or usergroups around PHP and Magento. Additionally, I have had a public speaking engagement on "Commerce Hero" discussing operations, as well a speaker slot at the larger conference "Magento Poland".',
                            skills: [
                                'Communication',
                                'Planning'
                            ],
                            links: [
                                {
                                    caption: 'A YouTube Livestream discussion around AWS for Magento',
                                    href: 'https://www.youtube.com/watch?v=WBXHDnT8c4g'
                                },
                                {
                                    caption: 'Meet Magento Poland agenda',
                                    href: 'https://pl.meet-magento.com/en/agenda-en/'
                                }
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '1aa6c4e0-a320-11e8-90a2-2fc6a1b5676b',
                            title: 'Managed all development aspect of project for 9 months (solo)',
                            content: 'A partner selected Sitewards as their development partners to manage their Magento 2 store. The development required was enough for one full time developer, but no more. As a result I was responsible for all aspects of this system including migration to AWS, building the CI/CD pipeline, writing and managing the Ansible specification for all systems and feature development, debugging and bug fixing on the service itself. The service consisted of the PHP application "Magento 2", NGINX, Varnish, MySQL and Thumbor as well as other ancillary services such as OSQuery and Prometheus',
                            skills: [
                                'Ansible',
                                'Magento 2',
                                'PHP',
                                'CI/CD',
                                'Bash',
                                'Docker',
                                'Linux',
                                'Documentation'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: 'b56a0f24-ade2-11e8-9933-03f4a4d19ae6',
                            title: 'Scheduled and removed old, EOL hardware / software',
                            content: 'Within the office there was still some legacy, end of life (Windows server 2003) software doing some minor administrative functions. Each of these functions was moved to another system that had a better support model, and the system was decomissioned.',
                            skills: [
                                'Security',
                                'Communication',
                                'Sales'
                            ],
                            company: 'Sitewards'
                        },
                        {
                            id: '3ccafff2-ade1-11e8-a4bc-a37d23a4ef7a',
                            title: 'Managed organisational transition from "Password Safe" to "1Password"',
                            content: 'The solution "Password Safe" was the canonical way of managing resources that required shared password material, such as passwords received to access third party systems. This system had several limitations, such as being only available on an SMB fileshare, only available within a single network or via a VPN and itself and itself using a shared password to access it, thus making revocation or auditing essentially impossible. This became a blocker for work, as well as having ramifications for security. Various third party and open source password management solutions were evaluated, and a 30 day trial of 1Password was run. 1Password then replaced the "PasswordSafe" product, which was removed from public share. 1Password has been successfully operating for several months.',
                            skills: [
                                'Communication',
                                'Security',
                                'Sales'
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
