export interface Database {
  joinGame(joinInput: GQL.InputJoinGame): Promise<GQL.Game>
  getGames(): Promise<GQL.Game[]>
  getGameById(id: string): Promise<GQL.Game>
  createGame(gameInput: GQL.InputCreateGame): Promise<Partial<GQL.Game>>
}
