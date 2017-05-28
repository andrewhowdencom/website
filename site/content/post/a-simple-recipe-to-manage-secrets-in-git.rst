---
title: "A simple recipe to manage secrets in version control (git)"
description: "Bake yourself a lovely project with git, git-crypt, pgp and envsubst"
date: "28 May 17 16:00 +0100"
---

==========================================================
A simple recipe to manage secrets in version control (git)
==========================================================

WHY WOULD YOU DO THIS
---------------------

So, I think a centralised model of secret management (such as Hashicorps Vault) is a superior model, as it allows

- Audit Trails
- Easy revocation and rotation of credentials
- A canonical place to view secrets, and manage ACLs
- Ongoing improvements in "security posture" (or, less breaking over time)

However, that requires a certain level of infrastructure (running vault, and having the procedures in place to manage
service outages and other maintenance). So, a reasonable intermediary as this infrastructure is being set up is below.

Recipe
------

Ingredients
'''''''''''

You will need:

- `git`_
- `git-crypt`_
- `GnuPG`_
- `envsubst`_

.. _git: https://git-scm.com/
.. _git-crypt: https://www.agwa.name/projects/git-crypt/
.. _GnuPG: https://gnupg.org/
.. _envsubst: https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html

Instructions
''''''''''''

First, let's start by creating an empty git repo

.. code:: bash

    mkdir -p /tmp/foo
    cd /tmp/foo
    git init .

Next, we need to initialize `git-crypt`. `git-crypt` is the magic behind this type of secret management. It
transparently encrypts resources in version control based on a .gitattributes file. We'll be using GnuPG as our
identity provider; `git-crypt` also supports a shared symmetric key but my recommendation is "use PGP". It's handy
for a bunch of other stuff anyway. If you're new to PGP, check out the following link to get started:

https://help.github.com/articles/generating-a-new-gpg-key/

Once you've done that, come back here.

...

Okay, let's continue! Let's initialise git-crypt

.. code:: bash

    git-crypt init

    # Generating key...

We also need to add our key the repository so that resources will be encrypted with it. Please note: this key will
need to be trusted!

.. code:: bash

    export YOUR_EMAIL="totallylegit@andrewhowden.com" # Replace with the email for your PGP key
    git-crypt add-gpg-user ${YOUR_EMAIL}

    # [master (root-commit) ccaef5f] Add 1 git-crypt collaborator
    # 2 files changed, 3 insertions(+)
    # create mode 100644 .git-crypt/.gitattributes
    # create mode 100644 .git-crypt/keys/default/0/THIS_WILL_BE_YOUR_KEY_ID.gpg

We can now encrypt things in version control! Let's create a simple secret as an example. We'll create a file called
`.env`. This file can be consumed by several credential managers, such as:

- envsubst
- `dotenv (ruby)`_
- `dotenv (php)`_

.. _dotenv (ruby): https://github.com/bkeepers/dotenv
.. _dotenv (php): https://github.com/vlucas/phpdotenv

This file is a simple key => value pairing, fashioned after other environment files (for example `/etc/environment`).
On my development machine, `/etc/environment` looks like:

.. code::

    COMPOSER_HOME=/opt/composer

Let's create this file

.. code:: bash

    echo 'MYSQL_PASSWORD="this-is-a-totally-secure-mysql-password"' > .env

However, the file is not encrypted just yet. `git-crypt` works by using a `git-attribute` hook to encrypt the files as
they're being committed. So, we need to create a `.gitattributes` file.

.. code:: bash

    echo ".env filter=git-crypt diff=git-crypt" > .gitattributes

You can read more about git attributes here:

- https://git-scm.com/docs/gitattributes

Now, we can stage those files:

.. code:: bash

    # Note: You'll notice that my staged summary looks a little different than normal. I use a git plugin called "scmpuff"
    # to add numbered shortcuts to my git files. It's excellent, and recommend you take a look:
    #
    # https://github.com/mroth/scmpuff

    git add .env .gitattributes

    # On branch: master  |  [*] => $e*
    #
    ➤ Changes to be committed
    #
    #       new file:  [1] .env
    #       new file:  [2] .gitattributes
    #

Once they're staged, we can verify that file is to be encrypted:

.. code:: bash

    git-crypt status -e
    #    encrypted: .env

Aaand commit!

.. code:: bash

    # Just ignore the bit about "all keys". It will make sense shortly.

    git commit -F - <<EOF
    Added encrypted database information to .env

    Previously, this repository was initialised with git-crypt, allowing
    secret information to be stored securely. This commit adds the
    connecton information for the production database endpoint to the
    repository in the .env file, as well as .gitattributes indicating that
    this file should be encrypted.

    All keys are allowed access to this file.
    EOF

That's it! That file is encrypted, and only you can decrypted it. But don't trust me, let's sanity check it:

.. code:: bash

    cat .env
    MYSQL_PASSWORD="this-is-a-totally-secure-mysql-password"

    # AAH WHAT THIS ISNT ENCRYPTED YOU DECEIVED ME!

Don't panic! git-crypt works by encrypting files *as they commit*. You usually won't see the encrypted file unless
the repository is "locked". You can do this manually:

.. code:: bash

    git-crypt lock
    cat .env

    # GITCRYPT��X�f�{gL�#�@K>���Ox��s܊��WhE�g
    #                                           �i����
    # �j��9�Q�2�|f�R�Z�Ğ��

    # Ahh much better

Or, you can verify this by cloning the repository again and verifying that it's locked by default

.. code:: bash

    # Unlock your current repository, so we can sanity check it still clones the encrypted version from a decrypted
    # repo
    git-crypt unlock

    # Clone the current repo to a new dir. There's no special magic here.
    git clone /tmp/foo /tmp/bar

    # Cloning into '/tmp/bar'...
    # done.

    # Cat the file
    cat .env

    # GITCRYPT��X�f�{gL�#�@K>���Ox��s܊��WhE�g
    #                                           �i����
    # �j��9�Q�2�|f�R�Z�Ğ��

Perfect! It appears to be encrypted. Let's clean up, and go back to our previous repo:

.. code:: bash

    cd /tmp/foo
    rm -rf /tmp/bar

If you're using one of the aforementioned packages, such as dotenv for either ruby or php, you can stop here. However,
the vast majority of applications do not have support for environment configuration. So, we use envsubst to polyfill
these applications by generating the "secret" configuration with a template file, and the .env file.

Let's use Magento's local.xml as an example:

.. code:: bash

    mkdir -p etc/magento
    cd etc/magento
    wget https://raw.githubusercontent.com/OpenMage/magento-mirror/magento-1.9/app/etc/local.xml.template

`cat` that file yourself, so you can see the contents. I'm not going to print them inline, as it's long, and I don't
want to.

.. code:: bash

    cat local.xml.template
    # It's a bunch of XML with placeholders that look like "{{value}}"

We're deliberately not going to explore what all of these values mean, and which ones should be secret. Instead,
we're just going to pretend that the rest is all filled out, and that `{{db_pass}}` and `{{key}}` are secret. So,
we need to generate a .env file similar to the one from earlier:

.. code:: bash

    # If you copy paste this, be careful not to copy the linebreak after the last EOF.
    # See https://stackoverflow.com/questions/2953081/how-can-i-write-a-here-doc-to-a-file-in-bash-script
    cat << EOF > .env
    KEY="329896ae9dc8eb488dfd5f9d7d25b08f"
    DB_PASS="totallysecurepassword"
    EOF

Next, we have to modify the `local.xml.template` file to be in the format that `envsubst` expects. Basically, it uses
placeholders that look like `$VARIABLE_NAME`, like bash.

.. code:: bash

    # This replaces {{whatever}} with $WHATEVER
    sed --in-place 's/{{key}}/$KEY/' local.xml.template
    sed --in-place 's/{{db_pass}}/$DB_PASS/' local.xml.template

That's it! Now, we can generate our local.xml file with the secret information:

.. code:: bash

    # Broadly, this does a few things:
    #   cat local.xml.template        # Read the file from local.xml.template into stdout
    #   eval $(cat .env | xargs)      # Read .env into stdout, and convert it into a sting of the form
    #                                 #   'FOO="bar" BAZ="herp" envsubst'. eval then executes that as a bash command
    cat local.xml.template | eval "$(cat .env | xargs) envsubst" > local.xml

That's it! Our local.xml is generated, and filled with the appropriate information. To be safe, we should add that file
to .gitignore:

.. code:: bash

    echo "local.xml" > .gitignore

Commit it

.. code:: bash

    git add local.xml.template .env .gitignore
    git commit -F - <<EOF
    Add local.xml.template, encrypted .env

    This commit stores the local.xml used in the production environment,
    but without the secret information, as local.xml.template. The secret
    information is stored in a .env file and encrypted by git-crypt.
    The encryption signal is handled by the .gitattributes file in the top
    level of the repository.
    EOF

    # [master b1517a9] Add local.xml.template, encrypted .env
    #  3 files changed, 67 insertions (+)
    #  create mode 100644 etc/magento/.env
    #  create mode 100644 etc/magento/.gitignore
    #  create mode 100644 etc/magento/local.xml.template

That's it! Protip: It's a good idea to comment how to generate the template file *in* the template file, so your
colleagues can understand what's going on. Or, point them here. ;)

Handling CI/CD
--------------

If you're using CI/CD it's quite often that you will need to be able some form of secret in order to build or deploy
the application. If you are doing so, my recommendation is that you generate a PGP key pair on the build server, and
encrypt the resources with CIs private key. If you're unsure how to do this, see

https://help.github.com/articles/generating-a-new-gpg-key/

Primitive ACLs
--------------

`git-crypt` can be used to encrypt secrets that should only be visible by certain users, such as robot accounts used by
the build service. Check out the documentation here:

https://github.com/AGWA/git-crypt/blob/master/doc/multiple_keys.md
