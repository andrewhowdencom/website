---
title: "Getting Magento 1.9x up on Kubernetes (1.3)"
description: "An in depth guide on Kubernetes for Magento developers"
date: "22 Jul 16 17:00 +1100"
---

Getting Magento 1.9x up on Kubernetes
=====================================

This guide is written for Magento developers looking to gain familiarity
with `Kubernetes`_, and perhaps `Docker`_.

.. container:: tip info

  I am new to writing these sort of articles, and this will be my first. If
  there are parts that are unclear, or something that I have worded badly,
  please let me know and I'll fix it up.

.. container:: tip error

  This isn't done just yet. In particular, I need to do:

  - Turn up the Kubernetes cluster
  - Configure Kubectl
  - Revise (ideally remove) "ingredients"
  - Turn down the Kubernetes cluster
  - Deal with media
  - Delete persistent disks
  - Annotate the prometheus endpoints

  Note: Also need to make a note about compute zones. Let's keep the zone
  asia-east1-a, just for convenience

The problem Kubernetes solves
-----------------------------

Magento consists of a few moving parts, give or take:

#. PHP
#. NGINX
#. Redis
#. MySQL

Each of these components has to run somewhere, and be discoverable by the other
components in the stack. Further, several replicas of PHP and NGINX are often
run so that if one copy dies (due to segfault or machine failure) other versions
of the application can pick up the slack.

Further, multiple need to be able to introspect the stack, including determining
what is wrong with an application at any given time, increase the number of
replicas of a given component or just determine what's running and where at any
given time.

A combination of Docker and Kubernetes elegantly solve a lot of these problems.
Docker images (run by the Docker daemon) are *containers* - encapsulated,
distributable environments to run a process in. A container is:

- A separate spot in the kernel to execute the process in.
- A root file system (including the application) to run things in.
- Reasonable isolation from other processes running on the same kernel.

Because they're encapsulated, the runtime environment is largely the same from
development to staging to production to whatever. This encapsulation solves one
of the hardest problems: knowing exactly what's running, what version and in
what state.

Kubernetes provides the management layer for these containers, and is
responsible for:

- Managing how much available compute resources there are in the entire cluster
- Deciding which machine a container should run on
- Starting and monitoring that container on the machine
- Creating a means to route to that container
- Provisioning any required cloud resources needed by that container
- Handling the failure of a machine

The Kubernetes spec is declarative - you indicate the state that you'd like your
cluster to be in, and Kubernetes is responsible for making your cluster reflect
your specification. It provides a superb abstraction for the compute resources,
letting the sysadmin manage cluster and the machines, and the developer only
managing Kubernetes. In otherwords:

- A machine dies? You should be OK
- A container dies? It'll be restarted
- A container consistently dies? It'll be moved to another machine, and
  restarted

Kubernetes can be run in a highly available way, tolerating even faults in
Kubernetes itself. Lastly, Kubernetes makes certain other sysadmin tasks easier,
such as

- Log rotation
- Monitoring (at least with Prometheus)

.. Container:: tip idea

  If you read closely, you'll notice there are many references here to
  metric exporters for Prometheus. Prometheus has excellent support for
  Kubernetes, and uses the Kubernetes API to discover processes to collect
  metrics for, as well as monitoring the cluster itself.

  You can learn more at the following blog post by CoreOS:
  https://coreos.com/blog/prometheus-and-kubernetes-up-and-running.html

Ingredients
-----------

You will need:

- A Google Cloud account
- One Kubernetes cluster, spun up on `Google Container Engine`
- The kubectl tool, correctly configured to your cluster
- The gcloud tool, correctly configured for your account
- (Optional) Prometheus running on your cluster

Getting Started
---------------

Our own, tidy workspace
"""""""""""""""""""""""

Most of the resources in Kubernetes operate in the context of a *namespace*.
To quote the docs[KNS]_:

  Kubernetes supports multiple virtual clusters backed by the same physical
  cluster. These virtual clusters are called namespaces.

This namespace revents collisions between applications that need to be discovered,
lets us sets some resource limits and (coming soon) network policy. To provision
anything, we have to have a namespace to put it.

Kubernetes creates resources based on text configuration, in either JSON or
Yaml. I like Yaml, so we're going to use that. So, let's get started, and
create a namespace resource. Create a file called `20-m1onk8s-littleman-co.ns.yml`
with the following content:

.. Code:: yaml

  ---
  # Generated by Boilr at Wed, 20 Jul 2016 20:50:37 AEST
  apiVersion: "v1"
  kind: "Namespace"
  metadata:
    name: "m1onk8s-littleman-co"
    # See http://blog.kubernetes.io/2016/04/Kubernetes-Network-Policy-APIs.html
    # net.alpha.kubernetes.io/network-isolation: "off"

You'll notice a few things about this file:

- It's got a comment that indicates it's generated. I'm too lazy to generate
  them myself, so I use a templating tool called `boilr`_. If you like, the
  templates are available on `the littleman.co GitHub`_.
- "`net.alpha.kubernetes.io/network-isolation`_: "off"" is commented out. Alpha
  resources are not available on GKE; when this feature is beta, I'll try and
  remember to update this.
- The file is prefixed with the number 20. We're applying lots of configuration
  at once, and this number determines what order to apply the configuration in.

Deploying containers... sortof
""""""""""""""""""""""""""""""

The lowest functional unit in Kubernetes is called a *pod* [KPOD]_. To quote the
docs:

  A pod (as in a pod of whales or pea pod) is a group of one or more containers
  (such as Docker containers), the shared storage for those containers, and
  options about how to run the containers. Pods are always co-located and
  co-scheduled, and run in a shared context.

Concretely, this means that we often deploy more then one container as a single
unit. An example of this is Redis, where we have:

=========================================== ====================================================================
`redis:3.2.1-alpine`_                       The container running Redis (and tools)
`21zoo/redis_exporter`_                     A *sidecar* container, that exports metrics consumable by Prometheus
=========================================== ====================================================================

Pods have some nice characteristics, like

- Being able to share Kubernetes volumes
- Being able to access other containers in the pod at localhost

Hello, Redis - Getting the simplest application up
""""""""""""""""""""""""""""""""""""""""""""""""""

There are pre-build images for MySQL and Redis that can be deployed as is, and
require very little effort on the part of the developer. We're going to start
ith those, as Kubernetes has quite the learning curve, and it's nice to start
slow.

The way I like to get applications running on Kubernetes is to have:

- A `deployment`_ artifact: Something to indicate what to run on Kubernetes,
  and how many copies.
- A `service`_ artifact: Something to indicate how to route things on the
  network, and to where.

We'll start with the *deployment* [KDEP]_.

  A Deployment provides declarative updates for Pods and Replica Sets (the
  next-generation Replication Controller). You only need to describe the desired
  state in a Deployment object, and the Deployment controller will change the
  actual state to the desired state at a controlled rate for you.

The deployment I'm using is below. I've heavily commented it, to explain what
each constituent part is for. Create a file called `50-cache.dep.yaml`, and
paste in the below.

.. Code:: yaml

  ---
  # Generated by boilr at Wed, 20 Jul 2016 20:55:37 AEST
  # Kubernetes separates its artifacts into revisions, with Alpha, Beta, and
  # standard. The apiVersion tag specifies where Kubernetes should look for this
  # object definition.
  apiVersion: "extensions/v1beta1"
  # Well, it's a deployment, as mentioned.
  kind: "Deployment"
  metadata:
    # The labels are used for grouping tasks of resource, such as for service
    # discovery later.
    labels:
      application: "redis"
      role: "cache"
    # How to reference this resource going forward
    name: "cache"
    # Where to put this resource
    namespace: "m1onk8s-littleman-co"
  spec:
    # How many instances of the application we want to run on the cluster. All
    # applications can be horizontally scaled, however, in this case we're
    # running a stateful Redis instance, and it's not so easy to scale. We'll
    # stick to one.
    replicas: 1
    selector:
      # The deployment artifact will create a "replica set", which manages how
      # many pods are running at any given time. Kubernetes matches the labels
      # of the pods, defined later, with these pods to reconcile the pods the
      # replica set is looking for with the pods in the cluster.
      matchLabels:
        application: "redis"
        role: "cache"
    strategy:
      # How to push new versions of the application. In this case, we're
      # allowing {n}+- 1 container, where n = 1 (defined earlier in replicas).
      # Rolling Update is the only supported deployment mechanism at the moment.
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 1
      type: "RollingUpdate"
    template:
      metadata:
        labels:
          application: "redis"
          role: "cache"
      # Kubernetes deploys {n} containers together, who all share an IP address.
      #  This allows us to do things like attach monitoring processes to our
      # application processes, or attach PHP to NGINX.
      # In this case, we're going to have the root process (redis) and a redis
      # metric exporter for Prometheus.
      spec:
        # Here's where we declare the type of storage resources that our pod
        # will need. Kubernetes allows us to use a variety of storage
        # abstractions as volumes in our container, including configuration,
        # gluster, GCE Persistent Disks and more.
        volumes:
        - name: "m1onk8s-littleman-co-redis-data"
          gcePersistentDisk:
            pdName: "m1onk8s-littleman-co-redis-data"
            fsType: "ext4"
        containers:
          # Our application! Here, we're running the official redis:3.2.1-alpine
          # container. There's not much to it, except to say that it's a redis
          # instance running on the Apline Linux root filesystem.
        - name: "redis"
          # The docker image to use
          image: "redis:3.2.1-alpine"
          # Kubernetes will automatically pull the image onto the node that
          # needs to run it. However, if you use the same docker image tag
          # (for example, 'latest') and update the image, Kubernetes won't
          # check back upstream unless you tell it with "imagePullPolicy:
          # Always". Note: I think this is a tremendously bad idea, as
          # different images will be updated at different times.
          imagePullPolicy: "IfNotPresent"
          # Each node has a finite amount of resource, and each application
          # uses an amount of resource. We should (in theory) have a good idea
          # how much resource each instance of our application will require.
          # The below configuration allows us to "reserve" the resources
          # required - In this case, 100m (.1) of a CPU, and 64mb of ram. I'm
          # not too sure what the difference is yet - We're learning about
          # this together.
          resources:
            limits:
              cpu: "100m"
              memory: "64Mi"
            requests:
              cpu: "100m"
              memory: "64Mi"
          # These are the ports to make available on the container. When we
          # create a service, we'll be directing traffic to these ports.
          ports:
          - containerPort: 6379
            protocol: "TCP"
            name: "redis"
          # The below configuration tells Kubernetes to attach the persistent
          # storage we requested earlier to this container.
          volumeMounts:
          - name: "m1onk8s-littleman-co-redis-data"
            readOnly: false
            mountPath: "/data""
          # "Process has started" and "Application is ready" are two distinct
          # phases. An application might have to do some initilisation or cache
          # warming before it's ready to go. So, we allow it to do so - in this
          # case, we're testing "Readiness" by testing if port 6379 is open.
          readinessProbe:
            tcpSocket:
              port: 6379
            initialDelaySeconds: 1
            timeoutSeconds: 5
          # During the lifecycle of the application, something might go wrong.
          # Redis, for example, could become blocked and refuse to serve any
          # more traffic. We don't want traffic being sent to an unhealthy
          # application instance! To avoid this, we check if the application
          # is healthy every so often, by testing if port 6379 is open.
          livenessProbe:
            tcpSocket:
              port: 6379
            initialDelaySeconds: 1
            timeoutSeconds: 5
        - name: exporter
          image: "21zoo/redis_exporter:0.5"
          imagePullPolicy: "IfNotPresent"
          resources:
            limits:
              cpu: "50m"
              memory: "8Mi"
            requests:
              cpu: "50m"
              memory: "8Mi"
          ports:
          - containerPort: 6379
            protocol: "TCP"
            name: "redis"
          readinessProbe:
            tcpSocket:
              port: 9121
            initialDelaySeconds: 1
            timeoutSeconds: 5
          livenessProbe:
            tcpSocket:
              port: 9121
            initialDelaySeconds: 1
            timeoutSeconds: 5
          # Kubernetes will automatically restart containers when it detects they
          # are unhealthy, either by failling the liveness probe or the process
          # exiting. We usually went the application restarted, so we indicate
          # this to Kubernetes with a `restartPolicy`
        restartPolicy: "Always"
        # I have no idea what this does. When I do, I'll update these notes!
        securityContext: {}

Whoa. That was a tonne of information! Luckily, I reckon that's the most
complicated artifact that we're going to deal with for a very long time. Further,
there's a bunch of reoccurring themes that make Kubernetes easiest to digest
over time. Kind of like Magento!

Now, we need to create the deployment. However, there's a catch - The deployment
references a storage volume called "Persistent Disk". This is essentially
"HDD as a service" - Virtual storage that can be mounted to a node.

To create the required disk, enter the command below

.. Code:: bash

  $  gcloud compute disks create --size=10GB --zone=asia-east1-a m1onk8s-littleman-co-redis-data

That's it - Kubernetes will handle the rest. Let's create our deloyment!

.. Code:: bash

  $ kubectl apply -f 50-cache.dep.yml

So, we have a Redis instance running. We can check this by querying the
Kubernetes API for the status of that pod

.. Code:: bash

  $ kubectl get pods

.. Code::

  NAME                     READY     STATUS    RESTARTS   AGE
  cache-4036923991-vwy3z   1/1       Running   0          22h

There it is! Let's take a closer look:

.. Code:: bash

  $ kubectl describe pod cache-4036923991-vwy3z

.. Code::

  Name:		cache-4036923991-vwy3z
  Namespace:	m1onk8s-littleman-co
  Node:		{node-name}/10.240.0.2
  ...

It'll show you a bunch more information. But, it doesn't show us how how to find
our application in the network!

.. container:: tip warning

  It does show an IP. Don't use it - it's tied to the application instance, and
  not permanent.

Kubernetes provides a means to handle the discovery and routing of applications
for us, called *services*:

  A Kubernetes Service is an abstraction which defines a logical set of Pods
  and a policy by which to access them - sometimes called a micro-service

Concretely, this means that we can use services to provide a fixed address that
we can access out pods on. To create a service we need a service declaration
file. Create a file called `50-cache.svc.yml`, and paste in the content below:

.. Code:: yaml

  ---
  # Generated by boilr at Thu, 21 Jul 2016 20:00:17 AEST
  kind: "Service"
  apiVersion: "v1"
  metadata:
    # The name will form the first part of the URL that we can find our service
    # at.
    name: "cache"
    # The namespace is the same namespace we specified earlier, and will form
    # the next part of the URL we will query
    namespace: "m1onk8s-littleman-co"
    annotations:
      # I like monitoring services with Prometheus. This means "Find and scrape"
      # this endpoint for metrics
      prometheus.io/scrape: "true"
    labels:
      # These labels are how this service decides what to route traffic to. They
      # should be a matching set as the ones defined in the deployment earlier.
      # Note: These labels work on an "everything that matches" basis. If you
      # have another service that routes to "applicaton: redis", it will Also
      # match the same pods as this service.
      application: "redis"
      role: "cache"
  spec:
    selector:
      # See above.
      application: "redis"
      role: "cache"
    ports:
      # Which ports to route traffic for. These should be the same as the sum
      # of all ports opened by all containers in the port.
      - protocol: "TCP"
        name: "redis"
        port: 6379
      - protocol: "TCP"
        name: "metrics"
        port: 9191
    type: "ClusterIP"

.. container:: tip info

  If you have more then one replica (indicated earlier by the `replicas` node in
  `50-cache.dep.yml`) then Kubernetes will load balance to each of them with a
  simple round-robin load balancer.

Now we have the two Kubernetes definitions:

- `20-m1onk8s-littleman-co.ns.yml`
- `50-cache.dep.yml`
- `50-cache.svc.yml`

Making changes in each one and then applying them can get tiresome. Luckily,
we don't have to do that! Kubernetes will simpily patch the resources that are
there if you ask it to, updating them as required. We can even patch the entire
set of resources at once! This is super nice if you're working with lots of
files, as we will be later.

.. Code:: bash

  # Note: The definition files must be the only thing in the directory for this
  # to work
  $ cd {directory you created the files in}
  $ kubectl apply -f .

  namespace "m1onk8s-littleman-co" configured
  deployment "cache" configured
  service "cache" created

Looks like everything worked OK. But how do we know our service is working?
Let's take a look:

.. Code:: bash

  $ kubectl get svc

.. Code::

  NAME      CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
  cache     10.59.254.85   <none>        6379/TCP   40s

Kubenretes has found it. It's not an externally facing service, so that `<none>`
is fine. However, is that service doing anything? Can an application connect to
it? Let's first see whether the service has found any pods.

.. Code:: bash

  $ kubectl describe svc cache

.. Code::

  Name:			cache
  Namespace:		m1onk8s-littleman-co
  Labels:			application=redis,role=cache
  Selector:		application=redis,role=cache
  Type:			ClusterIP
  IP:			10.59.254.85
  Port:			redis	6379/TCP
  Endpoints:		10.56.0.7:6379 # <-- The pod
  Session Affinity:	None
  No events.

See the bit there called `Endpoints` and the IP next to it? That's the pod we
started earlier! Looks like everything is working. However, that's not a good
text - We know it's found the pod, and we know that the pod has port 6379 open
(thanks to the earlier liveness checks). However, is Redis actually working?

Well, we could query it with the Redis-cli tool. But wait - What do we query?
There is two things:

- The service IP
- The domain name

We're going to do the latter, as it's simpler, and reliable across clusters
and service creation. Kubernetes can run an additional DNS service - most
clusters have this enabled by default. The DNS service some information about the
service, and turns it into a domain name. The domain names are constructed as
follows:

.. Code::

  {pod-name}.{namespace}.svc.{cluster-domain}

The domain suffix is configured when the cluster is created. On GKE, mine was
`cluster.local` - To find yours, take a look at the options the kubelet was
started with, or consult the cluster manual.

In our case, this means our DNS entry will be

.. Code::

  cache.m1onk8s-littleman-co.svc.cluster.local

However, we don't need to enter all that. Kubernetes modifies the nameserver
resolution behaviour such that, within this namespace, any of the following
values are acceptable:

- `cache`
- `cache.m1onk8s-littleman-co`
- `cache.m1onk8s-littleman-co.svc`
- `cache.m1onk8s-littleman-co.svc.cluster.local`

Unfortunately, there's no way to connect directly to the service from inside
the cluster. However, we can create a short lived pod just to test the
connection [K01]_. We're going to use the same redis image as we're running
the server on, as it has the `redis-cli` tool, and is already on at least
one node.

.. Code:: bash

  $ kubectl run -i --tty redis --image=redis:3.2.1-alpine --restart=Never sh

.. Code::

  Waiting for pod m1onk8s-littleman-co/redis-2j2vx to be running, status is Pending, pod ready: false

  Hit enter for command prompt

.. Code:: bash

  # Hit enter

  # The prompt looks like '{dir} #'
  /data # redis-cli -h cache

.. Code::

  cache:6379>

Yeah! Looks like we're connected. Redis is up and running! You can just exit
that pod, and it'll be disposed of. Now we've got:

- MySQL
- PHP
- Nginx

The next simplest is MySQL, and is much the same as Redis. As before, we'll need
some persistent storage to back the database, so let's go ahead and create that
first.

.. Code:: bash

  $  gcloud compute disks create --size=10GB --zone=asia-east1-a m1onk8s-littleman-co-mysql-lib

We also need to specify a root password for our database. However, we don't want
to record that password in an unencrypted partition on disk, and we definitively
don't want to add it to Kubernetes files that are being stored in version
control. Enter: *secrets*:

  Objects of type secret are intended to hold sensitive information, such as
  passwords, OAuth tokens, and ssh keys. Putting this information in a secret is
  safer and more flexible than putting it verbatim in a pod definition or in a
  docker image.

We're going to use secrets to specify the environment variable
`MYSQL_ROOT_PASSWORD` to our MySQL container, and keep that secrets file
outside version control. Create a secrets definition file called
`40-mysql-env.secret.yml` with the following contents:

.. Code:: yaml

  ---
  # Generated by boilr at Sun, 24 Jul 2016 22:12:24 AEST
  apiVersion: "v1"
  kind: "Secret"
  metadata:
    name: "mysql-env"
    namespace: "m1onk8s-littleman-co"
  data:
    # These values are base64 encoded versions of the password.
    # TGIjxO8wbpL4RrfsCRzqQabCqdAi54sk
    mysql-root-password: "VEdJanhPOHdicEw0UnJmc0NSenFRYWJDcWRBaTU0c2sK"
    # root:VEdJanhPOHdicEw0UnJmc0NSenFRYWJDcWRBaTU0c2sK@localhost:3306/magento
    data-source-name: "cm9vdDpWRWRKYW5oUE9IZGljRXcwVW5KbWMwTlNlbkZSWVdKRGNXUkJhVFUwYzJzS0Bsb2NhbGhvc3Q6MzMwNi9tYWdlbnRvCg=="

.. container:: tip idea

  Pass is an excellent unix utility for managing and storing passwords if
  you're familiar with PGP keys (and if you're not, they're not too complicated
  to learn about)

.. container:: tip warning

  Don't use the above password. Seriously, just generate one::

    $ openssl rand -base64 32

  Also, don't store that file in your VCS.

Once you've created the file above, add it to Kubernetes:

.. Code:: bash

  $ kubectl apply -f 40-mysql-env.secret.yml

Next, we need to create the MySQL deployment (`50-database.dep.yml`).
It's much the same as the one earlier, except the new `env` directive.

.. container:: tip warning

  MySQL is chewing resources. I don't know how much it's going to need, so
  I'm just going to let it run for a day, and read up about how Kubernetes
  treats things that go outside their allocation.

.. Code:: yaml

  ---
  # Generated by boilr at Sun, 24 Jul 2016 21:20:46 AEST
  apiVersion: "extensions/v1beta1"
  kind: "Deployment"
  metadata:
    labels:
      application: "mysql"
      role: "database"
    name: "database"
    namespace: "m1onk8s-littleman-co"
  spec:
    replicas: 1
    selector:
      matchLabels:
        application: "mysql"
        role: "database"
    strategy:
      rollingUpdate:
        maxSurge: 1
        maxUnavailable: 1
      type: "RollingUpdate"
    template:
      metadata:
        labels:
          application: "mysql"
          role: "database"
      spec:
        volumes:
        - name: "m1onk8s-littleman-co-mysql-lib"
          gcePersistentDisk:
            pdName: "m1onk8s-littleman-co-mysql-lib"
            fsType: "ext4"
        containers:
        - name: "mysql"
          env:
          # Here's where we use the secret information we defined earlier.
          # Secrets can be consumed a few ways, such as in a filesystem or in
          # an environment variable. The Docker container we're using allows
          # us to specify the root password in an environment variable, so we'll
          # do that.
          - name: "MYSQL_ROOT_PASSWORD"
            valueFrom:
              secretKeyRef:
                name: "mysql-env"
                key: "mysql-root-password"
          image: "mysql:5.7.13"
          imagePullPolicy: "IfNotPresent"
          #resources:
          #  limits:
          #    cpu: "200m"
          #    memory: "128Mi"
         # #  requests:
         # #    cpu: "200m"
         #     memory: "128Mi"
          args:
          - "mysqld"
          - "--ignore-db-dir=lost+found"
          ports:
          - containerPort: 3306
            protocol: "TCP"
            name: "mysql"
          volumeMounts:
          - name: "m1onk8s-littleman-co-mysql-lib"
            readOnly: false
            mountPath: "/var/lib/mysql"
          livenessProbe:
            tcpSocket:
              port: 3306
            initialDelaySeconds: 5
            timeoutSeconds: 1
          readinessProbe:
            tcpSocket:
              port: 3306
            initialDelaySeconds: 5
            timeoutSeconds: 1
        - name: "exporter"
          env:
          - name: "DATA_SOURCE_NAME"
            valueFrom:
              secretKeyRef:
                name: "mysql-env"
                key: "data-source-name"
          image: "prom/mysqld-exporter:0.8.1"
          imagePullPolicy: "IfNotPresent"
          resoures:
            limits:
              cpu: "50m"
              memory: "4Mi"
            requests:
              cpu: "50m"
              memory: "4Mi"
          ports:
          - containerPort: 9104
            protocol: "TCP"
            name: "exporter"
          livenessProbe:
            # Todo: When I've looked at this more, change it to a httpget
            tcpSocket:
              port: 9104
            initialDelaySeconds: 5
            timeoutSeconds: 1
          readinessProbe:
            tcpSocket:
              port: 9104
            initialDelaySeconds: 5
            timeoutSeconds: 1
        restartPolicy: "Always"
        securityContext: {}

Referenecs
----------

I learned things during this too! I had previously never applied resource limits
for example.

.. [K01] http://kubernetes.io/docs/user-guide/kubectl/kubectl_run/
.. [KPOD] http://kubernetes.io/docs/user-guide/pods/
.. [KNS] http://kubernetes.io/docs/user-guide/namespaces/
.. [KDEP] http://kubernetes.io/docs/user-guide/deployments/

http://kubernetes.io/docs/admin/resourcequota/walkthrough/
http://kubernetes.io/docs/user-guide/managing-deployments/

.. _boilr: https://github.com/boilr
.. _Check out the namespace docs for more information.: http://kubernetes.io/docs/user-guide/namespaces/
.. _deployment: http://kubernetes.io/docs/user-guide/deployments/
.. _service: http://kubernetes.io/docs/user-guide/services/
.. _net.alpha.kubernetes.io/network-isolation: http://blog.kubernetes.io/2016/04/Kubernetes-Network-Policy-APIs.html
.. _the littleman.co GitHub: https://github.com/littlemanco/
.. _21zoo/redis_exporter: https://hub.docker.com/r/21zoo/redis_exporter/
.. _`Kubernetes`: http://kubernetes.io/
.. _`Docker`: https://www.docker.com/
.. _`Google Container Engine`: https://cloud.google.com/container-engine/
.. _`redis:3.2.1-alpine`: https://hub.docker.com/_/redis/
