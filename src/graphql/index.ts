import { mergeRawSchemas } from './utils/mergeRawSchemas'
import { schemaShards } from './schema-shards'
import { gql } from 'apollo-server'

export const rawSchema = mergeRawSchemas(
  {
    typeDefs: [
      // Empty schema for separated extension in each schema shard
      gql`
        type Query {
          _empty: String
        }

        type Mutation {
          _empty: String
        }

        type Subscription {
          _empty: String
        }
      `,
    ],
    resolvers: {},
  },
  schemaShards
)
