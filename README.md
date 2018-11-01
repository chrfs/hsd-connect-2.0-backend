## HSD CONNECT Backend

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

HSDConnect is a Plattform to find Projects and Collaborations within the HSD University. The architecture is splitted into two seperate parts, this is the API backend of the system and builds on KoaJS as Web-Framework, MongoDB as document based Database and MongooseJS as ODM. The CodeGuidlines are strict standardJS.

### Get started:

##### Install dependencies:

`npm install`

##### Create the environment config `config/env.mjs` and the `docker-compose.dev.yml` 
* Therefore copy the exiting files, remove `example.` of the filename.
* Customize the configs for your needs, if neccassary.
* Keep in mind to update the example configs, if you decide to add some properties into your config files.
* Do not push sensitive credentials of any kind into the repo or somewhere else, unless it is production.

### Start Server:

`npm run dev`

## Scripts

##### dev

`npm run dev`

The `dev`script is only for development purposes and starts a nodemon service along with liting and eslint for all `mjs` files.

##### prettify

`npm run prettify`

The `prettify`script is only for development purposes and starts prettier with standard configured for all `mjs` files.

##### start

`npm start`

The `start`script is dedicated for production purposes and starts the server including all nodejs services.

#### Authentification
Authentification is based on JsonWebToken´s, therefore every authenticated client stores a authentication token. Every authentifacation required route stands behind an `ensureAuthentification` midleware and checks the authToken reveiced in the Header-information like the following: `Authorizazion: barer <authToken>`.


#### Documentation
For more information about the API visit the documentation: https://documenter.getpostman.com/view/5718203/RzZ1qNRD
