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
import './ahc-book.js';

// These are the shared styles needed by this element.
import { SharedStyles } from './shared-styles.js';

class AhcResume extends PageViewElement {
  _render(props) {
    return html`
      ${SharedStyles}
       <custom-style>
         <style is="custom-style">
            #books {
                width: 100%;
            }
         </style>
       </custom-style>
      <section>
        <h2>Resume</h2>
        <p>Below is a short list of the more notable aspects of my career. However, if you're curious what I can do
           simply ask me to do it.</p>
      </section>
      <section>
        <h3>Education</h3>
        <p>I read a lot, and my colleagues are nice enough to impart knowledge upon me where they have it.</p>
        <p>A (non-exhaustive) list of the books I've read:</p>
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
	    <li><a href="https://books.google.de/books/about/Network_Security_Assessment.html?id=zKhCEYRGFuYC" target="_blank">"Network Security Assessment" -
		<a href="https://twitter.com/chrisforce1" target="_blank">Chris McNab</a></li>
	    <li><a href="https://books.google.de/books/about/Accelerate.html?id=85XHAQAACAAJ" target="_blank">"Accelerate"</a> -
		<a href="https://twitter.com/nicolefv" target="_blank">Nicole Forsgren</a>,
		<a href="https://twitter.com/jezhumble" target="_blank">Jez Humble</a> and
		<a href="https://twitter.com/RealGeneKim" target="_blank">Gene Kim</a>
	    </li>
	    <li><a href="https://books.google.de/books?id=fElmDwAAQBAJ&redir_esc=y" target="_blank">"The Site Reliability Workbook: Practical ways to implement SRE" -
	        Betsy Beyer, Niall Richard Murphy, David K. Rensin, Kent Kawahara, Stephen Thorne</li>
        </ul>
        <p>I'm half way through a bunch of others. Additionally, the more notable papers or blogs are:</p>
	<ul>
	    <li><a href="https://queue.acm.org/detail.cfm?id=2898444" rel="noopener" target="_blank">Borg, Omega, and Kubernetes</a></li>
	    <li><a href="https://www.usenix.org/system/files/login/articles/login_june_07_jones.pdf" rel="noopener" target="_blank">Hiring Site Reliability Engineers</a></li>
	    <li><a href="https://www.usenix.org/conference/srecon17europe/program/presentation/looney-safety" rel="noopener" target="_blank">Psychological Safety in SRE teams</a></li>
	    <li><a href="https://queue.acm.org/detail.cfm?id=3096459" rel="noopener" target="_blank">The Calculus of Service Availability</a></li>
	    <li><a href="https://queue.acm.org/detail.cfm?id=2371516" rel="noopener" target="_blank">Weathering the Unexpected</a></li>
	</ul>
      </section>
      <section>
        <h3>Competencies</h3>
        <p>Predominantly, I have quite a bit of experience with Magento, and am passionate about performance, user
           interface and, to a lesser extent, security. Competencies are all self-rated on a likert scale, where</p>
	<ul>
	    <li><strong>Some</strong>: I have used the thing but would not feel comfortable without more practice.</li>
	    <li><strong>Quite a bit</strong>: I have used the thing, and have some things to teach.</li>
	    <li><strong>An extreme amount</strong>: I consider my expert with this thing.</li>
	    <li><strong>All</strong>: I wrote, and provide support for, this thing.</li>
	</ul>
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
	  <li>Ansible - Quite a bit</li>
	  <li>Helm - Quite a bit</li>
	  <li>Prometheus - Quite a bit</li>
          <li>Lets Encrypt - Quite a bit</li>
          <li>Intellij IDEAs - Quite a bit</li>
	  <li>Vim - Some</li>
          <li>Atom - Some</li>
          <li>Boilr - Some</li>
          <li>Modd - Some</li>
	  <li>Jenkins - Some</li>
	  <li>Sensu - Some</li>
        </ul>
	<h4>Services</h4>
	<ul>
	  <li>Amazon Web Services - Quite a bit</li>
	  <li>Google Cloud - Quite a bit</li>
	</ul>
      </section>
      <section>
        <h3>Current Employment</h3>
        <p>Full time software engineer at Sitewards GmbH</p>
      </section>
      <section>
        <h3>Qualifications</h3>
	<h4>Certified Kubernetes Administrator</h4>
	<p>Completed March 17th, 2018 with a score of 89%. <a href="/resources/cka.pdf" target="_blank">See CKA-1800-0331-0100</a>.</p>
      </section>
      <section>
        <h3>Employment History</h3>
        <h4>10th October, 2016 → Now: Sitewards GmbH</h4>
        <p>Developer, specializing in the development, deployment and ongoing management of PHP Projects</p>
        <h4>3rd October, 2014 → 10th October, 2016: Fontis PTY LTD</h4>
        <p>Developer, specializing in the LEMP stack.</p>
      </section>
      <section>
        <h3>Notable Work</h3>
        <p>For work samples, please see the <a href="/portfolio">"portfolio"</a> section.</p>
      </section>
      <section>
        <h3>References</h3>
        <p>If you'd like to talk to some people about the quality of my work, let me know (or just ask them. Large
           samples of my work are public)</p>
      </section>
      <section>
        <h3>See Also</h3>
	<ul>
	    <li><a href="https://github.com/andrewhowdencom" target="_blank">GitHub profile</a></li>
	    <li><a href="/resources/cv.pdf" target="_blank">Document Resume</a></li>
	</ul>
    `;
  }
}

window.customElements.define('ahc-resume', AhcResume);
