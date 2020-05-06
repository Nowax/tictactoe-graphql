import { pubsub } from '../graphql/subscriptionManager'
import { Database } from '../db/Database'
import { Logger } from 'pino'

export class GameService {
  db: Database
  logger: Logger

  constructor(db: Database, logger: Logger) {
    this.db = db
    this.logger = logger
  }

  getGames = (): Promise<GQL.Game[]> => {
    return this.db.getGames()
  }

  createGame = async (
    _root: any,
    { input }: GQL.MutationToCreateGameArgs
  ): Promise<Partial<GQL.Game>> => {
    const game = await this.db.createGame(input)
    pubsub.publish('gameStateRefreshed', {
      gameStateRefreshed: game,
    })
    return game
  }

  subscribeToGameStateRefreshed = (
    _root: any,
    _args: any,
    _context: any
  ): AsyncIterator<unknown, any, undefined> => {
    return pubsub.asyncIterator('gameStateRefreshed')
  }
}
