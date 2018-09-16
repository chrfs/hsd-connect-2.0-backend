# HSD CONNECT Backend

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

HSDConnect is a Plattform to find Projects and Collaborations within the HSD University. This is the
API backend of the system and builds on KoaJS as HTTP-Handler, MongoDB as documentbased database and MongooseJS as ODM. The CodeGuidlines are strict standardJS.

## Get started:

### Install dependencies:

`npm install`

### Start Server:

`npm run dev`

## Scripts

### dev

`npm run dev`

#### The `dev`script is only for development purposes and starts a nodemon service along with liting and eslint for all `mjs` files.

### prettify

`npm run prettify`

#### The `prettify`script is only for development purposes and starts prettier with standard configured for all `mjs` files.

`npm start`

#### The `start`script is dedicated for production purposes and starts the server including all nodejs services.

## Authentification

#### Authentification is based on JsonWebToken´s, therefore every authenticated client stores a authentication token. Every authentifacation required route stands behind an `ensureAuthentification` midleware and checks the authToken reveiced in the Header-information like the following: `Authorizazion: barer <authToken>`.
