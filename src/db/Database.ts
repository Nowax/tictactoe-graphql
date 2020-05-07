import { GQLGame } from '../__typedefs/graphqlTypes'

export interface Database {
  getGames(): Promise<GQLGame[]>
  getGameById(id: string): Promise<GQLGame>
  createGame(gameInput: GQLGame): Promise<Partial<GQLGame>>
  updateGame(gameToUpdate: GQLGame): void
}
