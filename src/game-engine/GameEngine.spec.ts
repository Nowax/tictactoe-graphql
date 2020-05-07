import { GameEngine } from './GameEngine'
import { GQLWinnerType } from '../__typedefs/graphqlTypes'

describe('Game Engine Suite move validation', () => {
  let engine: GameEngine

  beforeEach(() => {
    engine = new GameEngine()
  })

  it('should validate positively a first move', () => {
    // Given
    const newState: string = '......X..'
    const stateHistory: string[] = ['.........']
    const playerMarker: string = 'X'
    // When/Then
    expect(engine.isMoveValid(newState, stateHistory, playerMarker)).toEqual(true)
  })

  it('should not allow state with different number of cells', () => {
    // Given
    const newState: string = '.X'
    const stateHistory: string[] = ['........X']
    const playerMarker: string = 'X'
    // When/Then
    expect(engine.isMoveValid(newState, stateHistory, playerMarker)).toEqual(false)
  })

  it('should not allow same field make a first move', () => {
    // Given
    const newState: string = '........X'
    const stateHistory: string[] = ['........X']
    const playerMarker: string = 'X'
    // When/Then
    expect(engine.isMoveValid(newState, stateHistory, playerMarker)).toEqual(false)
  })

  it('should not allow field taken by opponent', () => {
    // Given
    const newState: string = '........O'
    const stateHistory: string[] = ['........X']
    const playerMarker: string = 'X'
    // When/Then
    expect(engine.isMoveValid(newState, stateHistory, playerMarker)).toEqual(false)
  })

  it("should not allow following opponent's move with clearing some previous one", () => {
    // Given
    const newState: string = '......O.O'
    const stateHistory: string[] = ['......OX.']
    const playerMarker: string = 'X'
    // When/Then
    expect(engine.isMoveValid(newState, stateHistory, playerMarker)).toEqual(false)
  })

  it('should not allow clearing previous', () => {
    // Given
    const newState: string = '......O.O'
    const stateHistory: string[] = ['......OXO']
    const playerMarker: string = 'X'
    // When/Then
    expect(engine.isMoveValid(newState, stateHistory, playerMarker)).toEqual(false)
  })

  it("should allow following opponent's move", () => {
    // Given
    const newState: string = '......OXO'
    const stateHistory: string[] = ['......OX.']
    const playerMarker: string = 'O'
    // When/Then
    expect(engine.isMoveValid(newState, stateHistory, playerMarker)).toEqual(true)
  })
})

describe('Game Engine Suite win check', () => {
  let engine: GameEngine

  beforeEach(() => {
    engine = new GameEngine()
  })

  it('should validate positively vertical first column', () => {
    // Given
    const state: string = 'XXX......'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively vertical first column - opposite mark check', () => {
    // Given
    const state: string = 'OOO......'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Os)
  })

  it('should validate positively vertical second column', () => {
    // Given
    const state: string = '...XXX...'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively vertical third column', () => {
    // Given
    const state: string = '......XXX'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively horizontal first row', () => {
    // Given
    const state: string = 'X..X..X..'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively horizontal second row', () => {
    // Given
    const state: string = '.X..X..X.'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively horizontal third row', () => {
    // Given
    const state: string = '..X..X..X'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively slash win', () => {
    // Given
    const state: string = '..X.X.X..'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively backslash win', () => {
    // Given
    const state: string = 'X...X...X'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.Xs)
  })

  it('should validate positively draw', () => {
    // Given
    const state: string = 'OOXXOOOXX'
    // when
    const winner = engine.evaluateWinner(state)
    // Then
    expect(winner).toEqual(GQLWinnerType.DRAW)
  })
})
