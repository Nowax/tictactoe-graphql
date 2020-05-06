import pino from 'pino'
import { ServerFactory } from './server/serverFactory'
import { ApolloBasicLogger } from './logging/ApolloBasicLogger'
import { rawSchema } from './graphql'

const PORT = process.env.PORT || 3000
const LOG_LEVEL: string = process.env.LOG_LEVEL || 'info'
const logger = pino({ level: LOG_LEVEL })

const httpServer = new ServerFactory({
  logger,
  serverExtensions: [() => new ApolloBasicLogger({ logger })],
  schema: rawSchema,
}).create()

httpServer.listen({ port: PORT }, (): void =>
  logger.info(`\n🚀      GraphQL is now running on http://localhost:3000/graphql`)
)
