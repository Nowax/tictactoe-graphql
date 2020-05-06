export interface Database {
  getGames(): Promise<GQL.Game[]>
  getGameById(id: string): Promise<GQL.Game>
  createGame(gameInput: GQL.InputCreateGame): Promise<Partial<GQL.Game>>
  updateGame(gameToUpdate: GQL.Game): void
}
