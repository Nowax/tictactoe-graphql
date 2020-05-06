import { games } from './games'
import { mergeRawSchemas } from '../utils/mergeRawSchemas'

// Here all schema shards can be merge into one
export const schemaShards = mergeRawSchemas(games)
