import { createGames } from './games'
import { mergeRawSchemas } from '../utils/mergeRawSchemas'
import { ServicesFactory } from '../../services/ServicesFactory'
import { FileDatabase } from '../../db/FileDatabase'
import { logger } from '../../logging/Logger'

const factory = new ServicesFactory(new FileDatabase(), logger)

const games = createGames(factory.createGameService())

// Here all schema shards can be merge into one
export const schemaShards = mergeRawSchemas(games)
