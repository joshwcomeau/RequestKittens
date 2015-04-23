## Note to Self

API is hosted through DigitalOcean, my account registered through my typical gmail address.
Server IP is 45.55.246.246, domain requestkittens.com registered through GoDaddy.

I've created a user on the droplet, reqkit, to handle the server.


#### Running the server

I'm running the server with the NPM package *Forever*. To run it, SSH into the server,
change user (su reqkit), CD into ~/RequestKittens, and run 'forever start server.js'.

I can view a list of running servers with 'forever list', and stop the server with
'forever stop 0'.

I can view the log paths with 'forever logs'. Ex. ~/.forever/amld.log