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

  1 . Email
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
the example of a wiki.

Suprisingly, Google doesn't offer a higher SLA than our hypothetical internal availability.

// Todo: Note that the time above is the same as the time that's used for building other client facing, billable
         tasks.
// Todo: Note that we already have to solve these problems.
// Todo: Note that proprietary software has risks also, but they're only apparent after some period of time.
// Todo: Note the overlap for some of these problems (they're all Linux services of some kind of other).
// Todo: A framework
    - Calculate availability
    - Calculate consequences of failure
    - Calculate cost of the consequences * the availability
    - Calculate the cost of an alternative service
      Calculate the cost to move off the service onto another service
