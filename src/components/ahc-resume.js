/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { html } from '@polymer/lit-element';
import { PageViewElement } from './page-view-element.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class AhcResume extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
      <section>
        <h2>Resume</h2>
        <p>Below is a short list of the more notable aspects of my career. If you're curious what I can do, ask me to do
           it!</p>
      </section>
      <section>
        <h3>Education</h3>
        <p>I read a lot, and my colleagues are nice enough to impart knowledge upon me where they have it.</p>
        <p>A (non-exhaustive) list of the books I've read):</p>
        <ul>
            <li>"How Google Works" - Eric Schmidt and Jonathan Rosenberg</li>
            <li>"Packet Guide to Core Network Protocols" - Bruce Hartpence</li>
            <li>"Site Reliability Engineering" - Betsy Beyer</li>
            <li>"Continuous Delivery" - Jez Humble &amp; David Farley</li>
            <li>"Building Microservices" - Sam Newman</li>
            <li>"Hacking - The Next Generation" - Nitesh Dhanjani</li>
            <li>"Web Performance Daybook" - Stoyan Stefanov</li>
            <li>"High Performance Web Sites" - Steve Souders</li>
            <li>"High Performance Browser Networking" - Illya Grigorik</li>
        </ul>
      </section>
      <section>
        <h3>Competencies</h3>
        <p>Predominantly, I have quite a bit of experience with Magento, and am passionate about performance, user
           interface and, to a lesser extent, security. Competencies are all self-rated on a likert scale - "Some",
           "Quite a bit", "An extreme amount", "All"</p>
        <h4>Languages</h4>
        <p>I'm pretty sure I could hack around in another language reasonably quickly; it might take me a couple of
           years to feel at home in it, though.</p>
        <ul>
          <li>PHP - Quite a bit</li>
          <li>JS - Quite a bit</li>
          <li>Bash - Quite a bit</li>
          <li>SCSS - Some</li>
          <li>CSS - Some</li>
          <li>Go - Some</li>
        </ul>
        <h4>Environments</h4>
        <ul>
          <li>Docker - Quite a bit</li>
          <li>Kubernetes - Quite a bit</li>
          <li>Linux (Debian flavour) - Quite a bit</li>
          <li>Rkt - Some</li>
          <li>Windows (10) - Some</li>
        </ul>
        <h4>Tools</h4>
        <ul>
          <li>Git - An extreme amount</li>
          <li>Lets Encrypt - Quite a bit</li>
          <li>Intellij IDEAs - Quite a bit</li>
          <li>Atom - Some</li>
          <li>Boilr - Some</li>
          <li>Modd - Some</li>
        </ul>
      </section>
      <section>
        <h3>Current Employment</h3>
        <p>Full time software engineer at Sitewards GmbH</p>
      </section>
      <section>
        <h3>Employment History</h3>
        <p>Just about all work has been collaborative, and I cannot take all credit for anything I've been involved
           with.</p>
        <h4>10th October, 2016 → Now: Sitewards GmbH</h4>
        <p>Developer, specializing in the development, deployment and ongoing management of PHP Projects</p>
        <h4>Notable Work</h4>
        <h4>3rd October, 2014 → 10th October, 2016: Fontis PTY LTD</h4>
        <p>Developer, specializing in the LEMP stack.</p>
        <h4>Notable Work</h4>
        <h5>Implementation if automated lints as part of the normal code review process</h5>
        <p>Now part of the standard workflow, lints are run as part of code review, and issues highlighted (and
           generally solved) before a human reviewer inspects the work. This reduces the nitpicking associated with code
           review, and provides some clear standards for code style to follow.</p>
        <p>Implemented lints are:</p>
        <ul>
          <li>PHP</li>
          <li>PHPCS</li>
          <li>scss-lint</li>
          <li>Spelling</li>
          <li>Git Merge</li>
          <li>File Permissions</li>
        </ul>
        <h5>Implementation of lints on git commit, that prevent commit unless lints pass</h5>
        <p>In order to keep my own code as clean as possible, all the repos I work with run the lints over all files
           that have changed. If the lints are violated the violations are displayed in the terminal, and the commit
           cancelled.</p>
        <p>The lints can be skipped by ensuring the environment variable "SKIP_LINTS" exists. However, to ensure I don't
           become lazy, a large warning notice is shown, and the commit is paused for 5 seconds.</p>
        <p>You can see this git hook on GitHub</p>
        <h5>Redesign of the GAZ MAN website</h5>
        <p>The design for the desktop site was kept as similar as possible to the current design, but the design was
           ported to bootstrap 3.x and made responsive.</p>
        <h5>Redesign of the Bing Lee checkout</h5>
        <p>A complete reimplementation of a one step checkout, requiring as little information from the user as is
           required by the other information specified during the checkout.</p>
        <p>This required considerable restructuring of Magentos core validation logic, additional validation and
           reasonably complex implementation of various JavaScript driven features.</p>
        <h5>Provisioning of a Kubernetes cluster on CoreOS</h5>
        <p>Still ongoing, but the goal is to have a Kubernetes stack that can be run on anything from bare metal to a
           cloud provider.</p>
        <p>Highlights of this were:</p>
        <ul>
          <li>Creating several systemd units with various dependencies to manage the boot process.</li>
          <li>The need to drain the node as part of the CoreOS upgrade/reboot process</li>
        </ul>
      </section>
      <section>
        <h3>References</h3>
        <p>If you'd like to talk to some people about the quality of my work, let me know (or just ask them. Large
           samples of my work are public)</p>
      </section>
    `;
  }
}

window.customElements.define('ahc-resume', AhcResume);
