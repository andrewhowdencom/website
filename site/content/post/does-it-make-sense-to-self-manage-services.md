# Does it make sense to self manage services?

So recently I've been having a discussion with various people about whether it makes sense to self manage critical
services. This post is to help me think about whether it does (writing helps me think). So, the problem: There are
various services that a business relies in to perform day to day work. Running these services has an inherent
complexity, such as:

- Installing the service
- Customizing it to the business need
- Upgrading it
- Repairing it when it inevitably breaks

As well as the financial costs of the hardware and the time to do the aforementioned tasks. There are further the
additional risks of having to maintain that domain specific knowledge among several members of the team. There are
many services that fall into this category, such as:

    1. Email
    2. Slack
    3. Telephony
    4. Local office networking infrastructure
    5. Public facing internet services and web applications
    6. Internal facing internet services and web applications

If any of the above systems break, it will cause further downstream breakage which will, in turn, prevent the business
from being able to do or generate further billable work. To illustrate this further, let's take the example of email:

    1. Email server goes down for a period of 8 hours; 400 emails were neither received nor sent; the total is usually ~4000 / month.
    2. Marketing manager cannot send offer as expected to client before tender date ends
    3. Client goes with another business to provide their service.

That downtime has cost all of the revenue from that client, as well as the marketing managers lost investment time in
preparing the brief. There are various factors in determining whether this was a reasonable risk, including:

    1. Calculate the availability
    2. Calculate the projected financial losses associated with that service being unavailable
    3. Multiply the projected losses against the unavailability
    4. Calculate the cost of a comparable alternative service

We an apply these to our above example:

    Availability:    99.90%
    Anticpated cost: 100,000 EU / 0.10% of downtime.

We can compare this availability to a vendor. Let's take Google Mail

    SLO Availability:      99.95%
    Cost for 25 users:     100/Month

Given the above math, we can trivially compare the costs of 50,000 EU (1/2 of the .10 downtime cost) and 100 EU, and
decide that it makes sense to host our email in a third party provider. Further, email is a fairly stable service with
a well known contract that has not changed in many years, so the opportunity costs (or risk of change) is likely to be
extremely small.

However, there are cases in which it may make more sense to run the service internally. Instead of email, let's take
the example of a wiki. To provide the scenario:

    1. Wiki goes down for 8 hours; users are unable to look up documentation about internal business processes
    2. User incorrectly submits an internal report or cannot find internal data. Must ask a colleague who is more
       familiar with the topic.

The Google Site Reliability Engineering book indicates that a "context switch" costs approximately 20 minutes. We can
place this outage then at a cost of ~30 EU. Additionally, wiki costs approximately 20 EU per month to host on internal
hardware. Conversely, the company "Saas Web" offers a wiki hosting service at between 15 - 125 EU / Month. So, it might
be cheaper to host it externally. Or it might not -- it's hard to say.

Normally then, it appears it's better for most businesses to host their business critical applications on other
providers. However, the economics of a development services agency are a little different. A development agency
specialises in the customisation of an application to improve business outcomes for a business consumer. In order to
adequately develop these customisations, the engineer must have a sound understanding of the system in which the
application will operate. Let's review a couple of examples:

    1. An application developer is developing a new shop system on behalf of the client. They know of several shop
       systems, however the newer set of shop systems will require at least PHP 7.0 to run. It's still the case that
       many third party systems have not and will not upgrade to PHP 7.x in the near future, due to backwards
       compatbility concerns.
    2. A frontend developer is implementing a new checkout process for an e-commerce system. The developer is choosing
       whether to implement a simple, render blocking JS pattern or an asynchronous, modular JS pattern. Newer application
       environments include HTTP/2, which will make the asynchronous pattern considerably more efficient and result
       in a faster load time for the user (and presumabaly more conversions for the business owner).
    3. An application developer is determining whether it's possible to integrate another third party codebase into
       their application that has been obscured using the third party PHP extension IonCube.
    4. An application developer needs to show the client the changes as well as conduct testing in an environment that
       is as similar to the production environment as possible.

In the above cases, knowing the state of the environment that the application is being deployed to, and being able to
design the environment will allow the developer to implement superior solutions. This is only possible when the
infrastructure is within a domain the application developer is able to control or understand.

Further, while hosting companies typically due an excellent job of making sure a service is available hosted with them,
the host is unlikely to create bespoke customisations that will considerably increase the efficiency of the application
developer, such as:

    - Application specific host customisations (mounting partitions on tmpfs, installing software etc)
    - Host performance work (TCP optimisation, NGINX / Apache configuration adjustments)
    - Workflow driven automation (CI/CD)

If the above is accepted as a reasonable tradeoff, the development company can invest in developing this infrastructure
and progressively yield higher returns on the investment as the infrastructure becomes more mature. Further, the ability
to customize the systems to make the lives of the application developers easier allows those developers to further
specialise and become more efficient at their core business, without worrying about learning to work multiple different
heterogeneous environments.

Thus, I have the view that the hosting is in the domain the development services company specialises in, they
should consider managing the instances themselves, as well as developing the procedures necessary to ensure the
continued security and stability of these platforms.

