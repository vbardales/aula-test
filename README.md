AULA test
===============

An express-based REST API about songs

# Stack
## Main Stack
ExpressJS
Bluebird
Lodash

## Build Stack
Babel
Nodemon

## Test Stack
Mocha
Chai
Sinon
Eslint

# Improvements

- add real loggers, not console.log (`.eslintrc` `no-console` rule must be set to mandatory error)
- handle CORS
- handle HTTP cache (no-cache headers, ...)
- add better handling of headers (RESTv3 and v4)
- better SSL handling
- swagger, documentation on routes, eventually order on routes
- handle promises in express
- add service break if resources are unavailable at the start of a route
