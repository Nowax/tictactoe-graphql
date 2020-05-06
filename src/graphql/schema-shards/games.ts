import { gql } from 'apollo-server'
import { GameService } from '../../services/GameService'

const typeDefs = gql`
  extend type Query {
    " get all games "
    getGames: [Game]
  }

  extend type Mutation {
    " create a new game "
    createGame(input: InputCreateGame!): Game

    " join the existing game "
    joinGame(input: InputJoinGame!): PlayerToken
  }

  extend type Subscription {
    " called when a new move noticed in game "
    gameStateRefreshed: Game
  }

  " input to create a new game "
  input InputCreateGame {
    type: GameType!
  }

  " input to join the existing game"
  input InputJoinGame {
    gameID: ID!
  }

  type Game {
    id: ID
    type: GameType!
    timestamp: String

    playerOneID: ID
    playerTwoID: ID
    status: GameStatus
    latestMovePlayerID: ID
    state: String
  }

  type PlayerToken {
    id: ID
  }

  enum GameStatus {
    NEW
    STARTED
    FINISHED
  }

  enum GameType {
    SINGLEPLAYER
    MULTIPLAYER
  }
`

export const createGames = (srv: GameService) => ({
  resolvers: {
    Query: {
      getGames: srv.getGames,
    },
    Mutation: {
      createGame: srv.createGame,
      joinGame: srv.joinGame,
    },
    Subscription: {
      gameStateRefreshed: {
        subscribe: srv.subscribeToGameStateRefreshed,
      },
    },
  },
  typeDefs: [typeDefs],
})
