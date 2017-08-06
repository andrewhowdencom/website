# Talkative Infrastructure: A strategy for making monitoring useful

So, the last couple of years I have had a growing interest in the backbone of our development; the computers and
software that we deploy to; or, more broadly, infrastructure. Below are some quick notes on my current understanding
of what "infrastructure" is, what I want from it, and what I think will make it easier to understand and use in
future.

## What is infrastructure?

Broadly speaking, Infrastructure is the set of systems that take code from being committed to version control and
put it in front of users. Further, it's the systems that help us understand what our users are seeing and feeling
when using our code.

More concretely, that covers the following:

- Git hosting
- CI/CD
- Compute (VMs, Containers, Whatever)
- Introspection (Logging + Metrics)

## What do I want from infrastructure?

Broadly speaking, I want to be able to deploy my code with as little risk as possible, and know when it goes wrong.

## How do we get to this?

"Infrastructure" is a complicated set of heterogenious systems all of which have their own, unique quirks. 
Fortunately, there are a series of common principles that we can apply to most (all?) systems to determine if they're
operating within normal bounds.

The trick is being able to query those principles!

### Getting a common language

Having a single place, language and process to query the health of many different systems is, in my opinion, extremely
important to having infrastructure that can be reasoned about. A perfect solution to this is to express all application
data as numeric data, and store that data in a time series database (or TSTB).

Many different types of application data can be collected, but the most important are the USE metrics:

- Utilisation (or, the average time a resource is serving a request)
- Saturation (or, how many requests are queued for this resource)
- Error Rate (or, how often the resource did not function as expected)

Once these metrics are collected, they can be queried when determining why a system is not functioning as expected.

Generally speaking, I don't find logs so useful for determining there is a problem. Logs are useful when it's clear
is a problem to help understand why that problem exists.

I hate notification emails (looking at you, cron!)

### Being able to query the infrastructure state

Once time series data is collected and stored in a TSDB, developers must know how to query the infrastructure to
determine why an application is not functioning as expected. It's naieve to think that developers will have a complete
understanding of what is wrong when an issue occurs, but there are certain things that can be done to hasten their
understanding:

- Take time to teach the developers how to query their data, and in the documentation that explains how their content
  makes it to production, also write how to check it's functioning as expected. One such example is here:

https://github.com/infinityworks/prometheus-example-queries

- When expressing metric data, make sure names are descriptive and follow a consistent naming standard. A tool that
  does this particularly well is Prometheus.
- Make it easy to understand what a metric is, as well as how it can be applied. A simple way to do this is just to
  export that metric without derivation, and the developer can Google what that metric means as expressed by the
  machine / application (for example, in /proc)
- When a developer is expected to debug a service (such as when an alert goes off) have playbooks that clearly explain
  the problem, the metrics to query, and how to resolve the issue. 

### Setting alerts for when the infrastructure is outside the expected params

I find learning about the systems we operate tremendously fun. However, pragmatically speaking, collecting all that
data doesn't do anything super useful. So, a system should be able to express when it's outside it's expected bounds.

The trickiest problem I have encounted in monitoring is determining when to notify a developer, and how to notify them.
The best solution I have found so far is to divide all expressions into two pools:

#### Notifications

Something that is not functioning as expected, but that isn't causing problems that users see. Developers
should look at this at some point.

#### Alerts

Something that is critically wrong. I think of this as "these are the things that should wake you up". These are
limited to:

- Things that affect users, and
- Things that cause data corruption

These must take action immediately, and must not be ignored.

#### Streams

So, the simplest mechansim to express this is to have different alerting streams. The vision I have is currently:

Critical Problems: SMS, Pushover
Notifications: Jira tickets

### Conclusions

This is a work in progress (all things are I think). But that's the justification, and the vision.

## So I don't want to home brew all that

Use Promethueus. It's an opinionated framework about how monitoring should be implemented. It's excellent.

## References

- http://www.brendangregg.com/usemethod.html
