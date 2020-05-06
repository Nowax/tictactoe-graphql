import express from 'express'
import {
  ApolloServer,
  Config,
  GraphQLExtension,
  IExecutableSchemaDefinition,
} from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { makeExecutableSchema } from 'graphql-tools'

import { createServer } from 'http'
import compression from 'compression'
import cors from 'cors'

import expressPino from 'express-pino-logger'

import { Server } from 'http'
import { Logger } from 'pino'

export interface Options {
  logger: Logger
  serverExtensions: (() => GraphQLExtension)[]
  schema: IExecutableSchemaDefinition
}

export class ServerFactory {
  private options: Options

  constructor(options: Options) {
    this.options = options
  }

  create = (): Server => {
    const app = express()
    const server = new ApolloServer(this.getServerConfig())

    app.use('*', cors())
    app.use(compression())
    app.use(expressPino({ logger: this.options.logger }))
    server.applyMiddleware({ app, path: '/graphql' })

    const httpServer = createServer(app)
    server.installSubscriptionHandlers(httpServer)

    return httpServer
  }

  private getServerConfig = (): Config => ({
    schema: makeExecutableSchema(this.options.schema),
    playground: {
      settings: {
        'editor.theme': 'dark',
        'editor.cursorShape': 'line',
      },
    },
    validationRules: [depthLimit(7)],
    extensions: this.options.serverExtensions,
  })
}
