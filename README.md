# Abstract

`Tic-Tac-Toe` application is a project which shows some simple usage of GraphQL in node.js apps.

## Usage

To run app locally:

```bash
npm run dev
```

In development mode there is enabled GraphQL's playground UI from which you can get information about schema. After starting the application locally, visit `http://localhost:3000/graphql` to reach it.

# Design

## Application structure

App has been structured to separate different part of functionality in modules. The most crucial modularization is connected with GraphQL schema. It was done based on suggestion from apollo team and the whole explanation can be reached [here](https://www.apollographql.com/blog/modularizing-your-graphql-schema-code-d7f71d5ed5f2).

## Schema

Design schema the "schema first" approach has been selected. Schema's models must be defined as separate schema's shard (using `gql` tags) and based on that typedefs and actual schema files are generated.

To generate typedefs you need to first start application:

```bash
npm run dev
```

Then you can call command:

```bash
npm run generate-typedefs
```

which is equivalent to:

```bash
npx graphql-cli get-schema && graphql-schema-typescript --namespace=GQL --global=true --typePrefix='' generate-ts --output=src/__typedefs/graphqlTypes.d.ts src/__typedefs
```

It basically retrieves schema from graphql server and saves it to predefined place (`get-schema` part). Then based on retrieved schema it generated typedefs (`graphql-schema-typescript` part).

Predefined configuration can be reached from file: `.graphqlconfig`

## Functionality

All required functionalities had been implemented. However, there is still need to improvement especially in AI part and part when it is used. `GameService` class requires some refactoring to make it less coupled to all game engine and business logic.

## Authentication

There is no authentication integrated with the app (even simple dummy token checks). Reason: this approach simplifies app design.

## Database

For development purpose `lowdb` databases has been used. This allow to create databases in json file. Database has got abstract interface so in production environment `lowdb` can be easily change to some more sophisticated solution.

Disclaimer: There are problem with `lowdb` types that why `@tslint-ignore` has been used. In enterprise development it would require resolving this problem with proper type, e.g. implementing them explicitly.

# Configuration

## Testing

For test `jest` framework has been used. Currently there are only UT for engine part. Integration test would be very helpful here, however because of lack of time (deadline not negotiable again) it had to be skipped.

To run test call command:

```bash
npn run test
```

alternatively:

```bash
npn run test:watch
```

## Docker

Application has been dockerized with multi-stage docker's image approach. There are separate commands to build production or development images.

For production use command:

```bash
npm run docker:prod
```

For production use command:

```bash
npm run docker:dev
```

To run created images as docker process use commands:

```bash
docker run -p 3000:3000 ttt-prod
```

for production and:

```bash
docker run -p 3000:3000 ttt-dev
```

for development image.

Disclaimer: There is still place for improvement in production docker image:

1. npm ci should install only production modules. This however requires some more tweaking with modules version.
2. possibly smaller alpine image of node can be used as last build stage thank what we could reduce size in final production's image.

## Linters

For linting purposes there is used `tslint` library. Whole configuration can be accessed from `tslint.json`. Rules for linter are defined explicitly (no common rules standard has been used such as air-bnb or so). Tslint validation is part of precommit hook.

## Style

For styling purposes there is used `prettier` library. Whole configuration can be accessed from `.prettierrc` file. Prettier can be connected with auto-format feature of many IDEs (recommended). Prettier is also called as a hook command as a precommit.

## Logging

For logging purposes there is used `pino` library. By default it set to `DEBUG` level. `pino` seems to be good choice here, taking into account fact that overall complexity of the application is small. No need of more complex logging framework is needed here.

To log graphQL debug information from apollo-server itself, special basic logging extension has been implemented (see: `ApolloBasicLogging`).

For dev environment there is also installed `pino-prettier` which make easier to read provided logs.

For logging server's traffic the `express-pino-logger` is used which has been attached to express server. Logging benchmarks reports can be accessed [here](https://github.com/pinojs/express-pino-logger#benchmarks)
