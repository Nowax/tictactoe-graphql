import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import depthLimit from 'graphql-depth-limit'
import { createServer } from 'http'
import compression from 'compression'
import cors from 'cors'
import { schema } from './schema'

import pino from 'pino'
import expressPino from 'express-pino-logger'
import { ApolloBasicLogger } from './logging/ApolloBasicLogger'

const PORT = process.env.PORT || 3000
const LOG_LEVEL: string = process.env.LOG_LEVEL || 'info'

const logger = pino({ level: LOG_LEVEL })

const app = express()

const server = new ApolloServer({
  schema,
  validationRules: [depthLimit(7)],
  extensions: [() => new ApolloBasicLogger({ logger })],
})

app.use('*', cors())
app.use(compression())
app.use(expressPino({ logger }))
server.applyMiddleware({ app, path: '/graphql' })

const httpServer = createServer(app)
httpServer.listen({ port: PORT }, (): void =>
  logger.info(`\n🚀      GraphQL is now running on http://localhost:3000/graphql`)
)
