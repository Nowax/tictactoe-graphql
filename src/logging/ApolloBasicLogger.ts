import { DocumentNode, print } from 'graphql'
import { GraphQLResponse, EndHandler } from 'graphql-extensions'
import { Logger } from 'pino'
import { Request } from 'apollo-server-env'

interface Options {
  logger: Logger
}

export class ApolloBasicLogger {
  private logger: Logger
  constructor(o: Options) {
    this.logger = o.logger
  }

  requestDidStart = (o: {
    request: Pick<Request, 'url' | 'method' | 'headers'>
    queryString?: string
    parsedQuery?: DocumentNode
    operationName?: string
    variables?: { [key: string]: any }
  }): EndHandler => {
    const query = o.queryString || (o.parsedQuery ? print(o.parsedQuery) : null)
    const { method, headers, url } = o.request
    this.logger.debug({
      method,
      headers,
      url,
      operation: o.operationName,
      query,
      variables: o.variables,
    })

    return (...errors) => {
      if (errors.length) {
        this.logger.error({ errors })
      }
    }
  }

  willSendResponse = (o: { graphqlResponse: GraphQLResponse }) => {
    this.logger.debug({ response: o.graphqlResponse })
  }
}
