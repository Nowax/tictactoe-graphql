import { Database } from './Database'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { v4 as createUUID } from 'uuid'
import { GQLGame } from '../__typedefs/graphqlTypes'

export class FileDatabase implements Database {
  db: low.LowdbSync<any>

  constructor() {
    const adapter = new FileSync('db.json')
    this.db = low(adapter)
    this.db
      .defaults({
        games: [],
      })
      .write()
  }

  getGames = (): Promise<GQLGame[]> => {
    // @ts-ignore see README.md for details
    return this.db.get('games').value()
  }

  createGame = async (gameToCreate: GQLGame): Promise<Partial<GQLGame>> => {
    const game: GQLGame = {
      ...gameToCreate,
      id: createUUID(),
      timestamp: new Date().toUTCString(),
    }
    // @ts-ignore see README.md for details
    this.db.get('games').push(game).write()
    return game
  }

  getGameById = (id: string): Promise<GQLGame> => {
    // @ts-ignore see README.md for details
    const game = this.db.get('games').find({ id }).value()

    if (!game) {
      throw new Error('There is no such game')
    }

    return game
  }

  updateGame = async (gameToUpdate: GQLGame) => {
    // @ts-ignore see README.md for details
    const game = this.db.get('games').find({ id: gameToUpdate.id }).assign(gameToUpdate).write()
  }
}
