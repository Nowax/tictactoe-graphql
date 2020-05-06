import { pubsub } from '../graphql/subscriptionManager'
import { Database } from '../db/Database'
import { Logger } from 'pino'
import { v4 as createUUID } from 'uuid'

export class GameService {
  db: Database
  logger: Logger

  constructor(db: Database, logger: Logger) {
    this.db = db
    this.logger = logger
  }

  getGames = (): Promise<GQL.Game[]> => {
    this.logger.debug('Starting handling getGames request')
    return this.db.getGames()
  }

  createGame = async (
    _root: any,
    { input }: GQL.MutationToCreateGameArgs
  ): Promise<Partial<GQL.Game>> => {
    this.logger.debug('Starting handling createGame request')
    const game = await this.db.createGame(input)
    pubsub.publish('gameStateRefreshed', {
      gameStateRefreshed: game,
    })
    return game
  }

  joinGame = async (
    _root: any,
    { input }: GQL.MutationToJoinGameArgs
  ): Promise<Partial<GQL.PlayerToken>> => {
    this.logger.debug('Starting handling joinGame request')
    const game = await this.db.getGameById(input.gameID)

    const token: GQL.PlayerToken = { id: createUUID() }

    if (!game.playerOneID) {
      game.playerOneID = token.id
    } else if (!game.playerTwoID && game.type?.valueOf() === 'MULTIPLAYER') {
      game.playerTwoID = token.id
    } else {
      throw new Error(
        'All seats has been already taken in game: ' +
          input.gameID +
          ' or game type is not supported'
      )
    }

    this.db.updateGame(game)

    return token
  }

  subscribeToGameStateRefreshed = (
    _root: any,
    _args: any,
    _context: any
  ): AsyncIterator<unknown, any, undefined> => {
    this.logger.debug('Starting handling subscribeToGameStateRefreshed request')
    return pubsub.asyncIterator('gameStateRefreshed')
  }
}
