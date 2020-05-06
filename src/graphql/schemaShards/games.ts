import { createGame, getGames } from '../../db'
import { gql } from 'apollo-server'
import { pubsub } from '../subscriptionManager'

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

export const games = {
  resolvers: {
    Query: {
      getGames: () => getGames(),
    },
    Mutation: {
      createGame: async (_root: any, { input }: GQL.MutationToCreateGameArgs, context: any) => {
        const game = await createGame(input)
        pubsub.publish('gameStateRefreshed', {
          gameStateRefreshed: game,
        })
        return game
      },
    },
    Subscription: {
      gameStateRefreshed: {
        subscribe: (_root: any, _args: any, _context: any) => {
          return pubsub.asyncIterator('gameStateRefreshed')
        },
      },
    },
  },
  typeDefs: [typeDefs],
}
