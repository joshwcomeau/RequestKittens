## Note to Self

API is hosted through DigitalOcean, my account registered through my typical gmail address.
Server IP is 45.55.246.246, domain requestkittens.com registered through GoDaddy.

I've created a user on the droplet, reqkit, to handle the server.

#### Amazon S3
I'm using the 'aws-sdk' npm package for uploading to S3. The package requires that
your credentials (access key / secret) be stored in '~/.aws/credentials' with the following
structure:

```
  [default]
  aws_access_key_id = your access key id
  aws_secret_access_key = your secret key
```

#### Running the server

I'm running the server with the NPM package *Forever*. To run it, SSH into the server,
change user (su reqkit), CD into ~/RequestKittens, and run 'forever start server.js'.

I can view a list of running servers with 'forever list', and stop the server with
'forever stop 0'.

I can view the log paths with 'forever logs'. Ex. ~/.forever/amld.log


Temporary API key: 
  local:    67544bc49373a2970d670bf7160c27dd
  mongolab: 7d791ff16add503b2542c23afb3aeab0