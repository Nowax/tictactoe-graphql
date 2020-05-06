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
  }

  extend type Subscription {
    " called when a new move noticed in game "
    gameStateRefreshed: Game
  }

  " input to create a new game "
  input InputCreateGame {
    type: String
  }

  " input to join the existing game"
  input InputJoinGame {
    gameID: ID
  }

  type Game {
    id: ID
    userId: ID
    text: String
    timestamp: String
  }
`

export const createGames = (srv: GameService) => ({
  resolvers: {
    Query: {
      getGames: srv.getGames,
    },
    Mutation: {
      createGame: srv.createGame,
    },
    Subscription: {
      gameStateRefreshed: {
        subscribe: srv.subscribeToGameStateRefreshed,
      },
    },
  },
  typeDefs: [typeDefs],
})
