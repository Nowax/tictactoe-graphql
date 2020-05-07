import { gql } from 'apollo-server'
import { GameService } from '../../services/GameService'

const typeDefs = gql`
  extend type Query {
    " get all games "
    getGames: [GamePublicInfo]
  }

  extend type Mutation {
    " create a new game "
    createGame(input: InputCreateGame!): Game

    " join the existing game "
    joinGame(input: InputJoinGame!): Player

    " make move in specific game "
    makeMove(input: InputMakeMove!): GamePublicInfo
  }

  extend type Subscription {
    " called when a new move noticed in game "
    gameStateRefreshed: GamePublicInfo
  }

  " input to create a new game "
  input InputCreateGame {
    type: GameType!
  }

  " input to join the existing game"
  input InputJoinGame {
    gameID: ID!
  }

  " input to make move in existing game "
  input InputMakeMove {
    gameID: ID!
    userID: ID!
    newState: String!
  }

  type Game {
    id: ID
    type: GameType!
    timestamp: String
    winner: WinnerType
    stateHistory: [String!]!
    status: GameStatus!

    playerX: Player
    playerO: Player
    latestMovePlayerID: ID
  }

  type GamePublicInfo {
    id: ID
    type: GameType!
    timestamp: String
    winner: WinnerType
    stateHistory: [String!]!
    status: GameStatus!
  }

  type Player {
    id: ID!
    mark: MarkType!
  }

  enum WinnerType {
    NONE
    Xs
    Os
    DRAW
  }

  enum MarkType {
    X
    O
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
      makeMove: srv.makeMove,
    },
    Subscription: {
      gameStateRefreshed: {
        subscribe: srv.subscribeToGameStateRefreshed,
      },
    },
  },
  typeDefs: [typeDefs],
})
