## Linters

For linting purposes there is used `tslint` library. Whole configuration can be accessed from `tslint.json`. Rules for linter are defined explictely (no common rules standard has been used such as air-bnb or so). Tslint validation is part of precommit hook.

## Style

For styling purposes there is used `prettier` library. Whole configuration can be accessed from `.prettierrc` file. Prettier can be connected with auto-formart feature of many IDEs (recommneded). Prettier is also called as a hook command as a precommit.

## Logging

For logging purposes there is used `pino` library. By default it set to `DEBUG` level. `pino` seems to be good choice here, taking into account fact that overall complexity of the application is small. No need of more complex logging framework is needed here.

To log graphQL debug information from apollo-server itself, special basic logging extension has been implemented (see: `ApolloBasicLogging`).

For dev enviroment there is also installed `pino-prettier` which make easier to read provided logs. `pina-colada` prints less information from express server so in some cases it makes logs more readable.

For logging server's traffic the `express-pino-logger` is used which has been attached to express server. Logging benchmarks reports can be accessed [here](https://github.com/pinojs/express-pino-logger#benchmarks)
