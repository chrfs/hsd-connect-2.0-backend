## HSD CONNECT Backend

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

HSDConnect is a Plattform to find Projects and Collaborations within the HSD University.
The architecture is splitted into two seperate parts, this is the API and builds on KoaJS as Web-Framework, MongoDB as document based Database and MongooseJS as ODM.

### Get started:

#### Install dependencies:

`npm install`

#### Create the environment config `config/env.mjs`

- Copy the exiting files, remove `example.` of the filename.
- Customize the configs for your needs.
- Keep in mind to update the example configs, if you decide to add some properties into your config files.
- Do not push sensitive credentials of any kind into the repo(!).

## Scripts

| Name         | Description                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| `start:prod` | Is dedicated for production purposes and starts the server.                                               |
| `build`      | Builds the typescript files and creates/overwrites the `/dist` folder content and runs tslint at the end. |
| `start:dev`  | Is only for development purposes and starts nodemon with typescript in watch mode.                        |
| `unit:test`  | Runs the mocha unit tests                                                                                 |
| `prettier`   | Runs prettier with standardjs configured                                                                  |
| `test`       | Runs tests using Jest test runner                                                                         |
| `tslint`     | Runs tslint with the `tsconfig.json` and `tslint.json` configs                                            |
| `lint:stage` | Configured with a git hook on commit and starts `prettier`, `tslint` and `unit:test` scripts              |

#### Authentification

Authentification is based on JWT. Authentication required route are behind an `ensureAuthentification` midleware which checks the jwt `authToken` received in the request header using Bearer-Authorization: `Authorization: Bearer <authToken>`.

#### Documentation

For more information about the API visit the documentation: https://documenter.getpostman.com/view/5718203/RzZ1qNRD
