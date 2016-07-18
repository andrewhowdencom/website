===============================================
Provisioning a cheap, CoreOS Kubernetes cluster
===============================================

Kubernetes is a cluster management tool that scales out to 100's of nodes comfortably, is failure tolerant, and very
nice to work with. However, I'm a developer who's just playing around with Kubernetes, and I'm not made of cash. 
Therefore, this is going to explode how we can get some of the characteristics of a larger Kubernetes cluster, 
as cheaply as possible. 

.. Warning::

  This is me creating a cluster I can essentially mess around with. If you're creating a production cluster, you 
  need to think about this a lot more. Or, use Google Container Engine.

Notes
-----

This blog post clearly isn't finished yet. Why make it public you ask? Because I quite often start and forget things, 
and I work under the notion getting something up is better then getting nothing up. 

However, that aside, some notes:
- Should create each node in a different failure domain (zone)

Requirements
------------

- The cluster must tolerate a node failure
- The cluster must tolerate a master failure

Initial Design
--------------

"Kubernetes" comprises of a series of binaries that each play a different role. Below is a table of the ones I feel like
mentioning

=================== ==================================================================
Name                Role
------------------- ------------------------------------------------------------------
etcd                A key value store, that holds the entire state of the cluster
kube-apiserver      The canonical point of reference for the rest of the stack
kube-proxy          A daemon that watches kube-apiserver and updates iptables with routes
kube-scheduler      A daemon that tells which node to run a given pod
kubelet             A daemon that runs pods on a node
Flannel             An overlay network that provides pods IPs
Calico              A network routing thing, that creates the routes between pods.
=================== ==================================================================

As you may have noticed, all components except etcd are stateless. This is good - it means so long as we look after etcd 
and the leader election process of the apiserver, calico master and etcd master are all good, the cluster will survive the 
master death.

You further might have noticed, some of my knowledge around this is unclear. If it gets clearer, I'll be sure to update 
this post.

Cost
----

I'm currently paying ~25 per month for a n1-standard-1 single node cluster with GKE. So, to come close to that, I'm going
to have to have a 3 node f1-micro cluster. Sure hope Kubernetes is efficient!

Technology
----------

OS: CoreOS
Stack: Hyperkube

Yup. That's it. 

Getting Started
---------------

Inspired by a recent video with Kelsey Hightower, we're going to user Packer to create the images and Terraform to provision
the cluster. So, onto creating the image.

There are no workers here
"""""""""""""""""""""""""

In order to survive node death reliably, we probably should have 5 masters (so if one dies, 4 can achieve consensus). However, 
I'm cheap, and only willing to pay for three nodes total. 

That means, nodes are going to have to act as both masters *and* workers.

Getting into Packer
"""""""""""""""""""

Safe to say, I have no idea what I'm doing. Might end up rewriting this. In fact, this concludes today's writing. 

I'm going to get some sleep, and read up on Packer (hopefully not simultaneously).

