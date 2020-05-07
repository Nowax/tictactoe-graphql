import { ServerFactory } from './server/ServerFactory'
import { ApolloBasicLogger } from './logging/ApolloBasicLogger'
import { rawSchema } from './graphql'
import { logger } from './logging/Logger'

const PORT = process.env.PORT || 3000

const httpServer = new ServerFactory({
  logger,
  serverExtensions: [() => new ApolloBasicLogger({ logger })],
  schema: rawSchema,
}).create()

httpServer.listen({ port: PORT }, (): void =>
  logger.info(`\n🚀      GraphQL is now running on http://localhost:${PORT}/graphql`)
)
