import { GameService } from './GameService'
import { Database } from '../db/Database'
import { Logger } from 'pino'

export class ServicesFactory {
  db: Database
  logger: Logger

  constructor(db: Database, logger: Logger) {
    this.db = db
    this.logger = logger
  }

  createGameService = (): GameService => new GameService(this.db, this.logger)
}
