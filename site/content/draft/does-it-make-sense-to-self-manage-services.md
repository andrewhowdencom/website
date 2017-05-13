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

If any of the above systems break, it will cause further downstream breakage which will, in turn, prevent the business
from being able to do or generate further billable work.

// Todo: Note that the time above is the same as the time that's used for building other client facing, billable
         tasks.
// Todo: Note that we already have to solve these problems.
// Todo: Note the overlap for some of these problems (they're all Linux services of some kind of other).
// Todo: A framework
    - Calculate availability
    - Calculate consequences of failure
    - Calculate cost of the consequences * the availability
    - Calculate the cost of an alternative service
