import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import { v4 as createUUID } from 'uuid'

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({
  games: [],
}).write()

export async function joinGame(joinInput: GQL.InputJoinGame) {
  const { gameID } = joinInput
  // @ts-ignore
  const game = db.get('games').find({ gameID }).value()

  if (!game) {
    throw new Error('There is no such game')
  }

  const joinedGame: GQL.Game = {
    ...game,
    userId: createUUID(),
  }

  db.get('games').push(joinedGame).write()
  return joinedGame
}

export async function getGames(): Promise<GQL.Game[]> {
  // @ts-ignore
  return db.get('games').value()
}

export async function createGame(gameInput: GQL.InputCreateGame): Promise<Partial<GQL.Game>> {
  const game = {
    ...gameInput,
    id: createUUID(),
    timestamp: new Date().toUTCString(),
  }
  db.get('games').push(game).write()
  return game
}
