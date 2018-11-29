# SRS - API
## Build instructions
### Installation requirements
Running the API requires a global `mongodb` installation, and it will save to a db titled `srs`. 

If you get `MongoNetworkError: failed to connect to server [localhost:27017] on first connect` then make sure that you have a local database instance running.

### Build commands
`yarn dev` starts the server in hot-reloading development mode. 

`yarn start` creates a complete local build of the server, then runs it in development mode. 

`yarn build` outputs a local build to a top-level `dist` directory.

`yarn prod` outputs a local build to a top-level `dist` directory, then runs the server in node.

`yarn test` runs the jest testing suite.

A future `yarn deploy` should push to heroku.

## Requirements
### Functional Specifications
* User authentication
* SuperMemo2 implementation (see below for data storage)
* Cards associated with user
    - GET next most pressing card
    - POST yes update
    - POST no update
* Record complete metrics 
    - Logging

### Database Specifications
* user
    - email
    - username
    - password
    - preferences
* card
    - content
    - answer
    - type
    - stack
    - imageUrl
* history
    - userId
    - cardId
    - nextDate (sort on this)

## API Reference
All routes are at {url}/api

* /
    - POST - create new user
        + username (String): new user's username
* /:user
    - GET - return next card 
    - POST /deck/:deckName - start deck in user history
    - POST /card/:cardId - yes or no for a card
        + remembered (boolean): card success or failure
