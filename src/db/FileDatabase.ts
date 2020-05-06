import { Database } from './Database'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { v4 as createUUID } from 'uuid'

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
  joinGame = async (joinInput: GQL.InputJoinGame) => {
    const { gameID } = joinInput
    // @ts-ignore see README.md for details
    const game = this.db.get('games').find({ gameID }).value()

    if (!game) {
      throw new Error('There is no such game')
    }

    const joinedGame: GQL.Game = {
      ...game,
      userId: createUUID(),
    }
    // @ts-ignore see README.md for details
    this.db.get('games').push(joinedGame).write()
    return joinedGame
  }

  getGames = async (): Promise<GQL.Game[]> => {
    // @ts-ignore see README.md for details
    return this.db.get('games').value()
  }

  createGame = async (gameInput: GQL.InputCreateGame): Promise<Partial<GQL.Game>> => {
    const game = {
      ...gameInput,
      id: createUUID(),
      timestamp: new Date().toUTCString(),
    }
    // @ts-ignore see README.md for details
    this.db.get('games').push(game).write()
    return game
  }

  getGameById = async (id: string): Promise<GQL.Game> => {
    // @ts-ignore see README.md for details
    const game = this.db.get('games').find({ id }).value()

    if (!game) {
      throw new Error('There is no such game')
    }

    return game
  }
}
