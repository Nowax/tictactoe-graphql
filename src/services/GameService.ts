import { pubsub } from '../graphql/subscriptionManager'
import { Database } from '../db/Database'
import { Logger } from 'pino'
import { v4 as createUUID } from 'uuid'
import {
  MutationToCreateGameArgs,
  GQLGame,
  GQLGameStatus,
  MutationToJoinGameArgs,
  MutationToMakeMoveArgs,
  GQLGameType,
  GQLMarkType,
  GQLPlayer,
  GQLInputMakeMove,
  GQLWinnerType,
  QueryToGetGameArgs,
} from '../__typedefs/graphqlTypes'
import { GameEngine } from '../game-engine/GameEngine'

export class GameService {
  db: Database
  logger: Logger
  engine: GameEngine

  constructor(db: Database, logger: Logger, engine: GameEngine) {
    this.db = db
    this.logger = logger
    this.engine = engine
  }

  getGames = (): Promise<GQLGame[]> => {
    this.logger.debug('Starting handling getGames request')
    return this.db.getGames()
  }

  getGame = (_root: any, { gameID }: QueryToGetGameArgs): Promise<GQLGame> => {
    this.logger.debug('Starting handling getGame request')
    return this.db.getGameById(gameID)
  }

  createGame = (_root: any, { input }: MutationToCreateGameArgs): Promise<Partial<GQLGame>> => {
    this.logger.debug('Starting handling createGame request')

    const game: GQLGame = {
      ...input,
      stateHistory: ['.........'],
      status: GQLGameStatus.NEW,
    }

    return this.db.createGame(game)
  }

  joinGame = async (_root: any, { input }: MutationToJoinGameArgs): Promise<GQLPlayer> => {
    this.logger.debug('Starting handling joinGame request')
    const game = await this.db.getGameById(input.gameID)

    let p: GQLPlayer

    if (!game.playerO) {
      p = { id: createUUID(), mark: GQLMarkType.O }
      game.playerO = p
    } else if (!game.playerX && game.type === GQLGameType.MULTIPLAYER) {
      p = { id: createUUID(), mark: GQLMarkType.X }
      game.playerX = p
    } else {
      throw new Error(
        'All seats has been already taken in game: ' +
          input.gameID +
          ' or game type is not supported'
      )
    }

    this.db.updateGame(game)
    this.logger.debug('created player ' + p.mark)

    return p
  }

  makeMove = async (_root: any, { input }: MutationToMakeMoveArgs): Promise<GQLGame> => {
    this.logger.debug('Starting handling makeMove request')

    let game = await this.db.getGameById(input.gameID)

    game = this.makePlayerMove(game, input)
    game = this.tryMakeAIMove(game)

    game.status =
      game.winner === GQLWinnerType.NONE ? GQLGameStatus.STARTED : GQLGameStatus.FINISHED
    this.db.updateGame(game)

    pubsub.publish('gameStateRefreshed', {
      gameStateRefreshed: game,
    })
    return game
  }

  subscribeToGameStateRefreshed = (): AsyncIterator<unknown, any, undefined> => {
    this.logger.debug('Starting handling subscribeToGameStateRefreshed request')
    return pubsub.asyncIterator('gameStateRefreshed')
  }

  private makePlayerMove = (game: GQLGame, input: GQLInputMakeMove): GQLGame => {
    const player = this.recognizePlayer(game, input)

    if (!this.canPerformMove(game)) {
      throw new Error('Game either cannot be stared yet or it has been already finished')
    }

    if (player.id === game.latestMovePlayerID) {
      throw new Error('It is not player ' + player.id + ' turn.')
    }

    if (!this.engine.isMoveValid(input.newState, game.stateHistory, player.mark)) {
      throw new Error('Move is not valid')
    }

    game.winner = this.engine.evaluateWinner(input.newState)
    game.latestMovePlayerID = input.userID
    game.stateHistory.push(input.newState)

    return game
  }

  private tryMakeAIMove = (game: GQLGame): GQLGame => {
    if (game.type === GQLGameType.SINGLEPLAYER && game.winner === GQLWinnerType.NONE) {
      const newState = this.engine.makeValidAIMove(game.stateHistory)
      this.logger.debug('New state from AI: ' + newState + ', game: ' + game.id)
      game.winner = this.engine.evaluateWinner(newState)
      game.latestMovePlayerID = 'AI'
      game.stateHistory.push(newState)
    }
    return game
  }

  private recognizePlayer = (game: GQLGame, input: GQLInputMakeMove): GQLPlayer => {
    let player: GQLPlayer

    if (input.userID === game.playerO?.id) {
      player = game.playerO!
    } else if (input.userID === game.playerX?.id) {
      player = game.playerX!
    } else {
      throw new Error('Player ' + input.userID + ' has not joined game ' + input.gameID)
    }

    this.logger.debug('New move from player: ' + player.id + ' ' + player.mark)
    return player
  }

  private canPerformMove = (game: GQLGame): boolean => {
    const isReadyToStartSinglePlayerGame =
      game.status === GQLGameStatus.NEW && game.playerO && game.type === GQLGameType.SINGLEPLAYER

    const isReadyToStartMultiPlayerGame =
      game.status === GQLGameStatus.NEW &&
      game.playerO &&
      game.playerX &&
      game.type === GQLGameType.MULTIPLAYER

    const isGameAlreadyStarted = game.status === GQLGameStatus.STARTED

    return isReadyToStartSinglePlayerGame || isReadyToStartMultiPlayerGame || isGameAlreadyStarted
  }
}
