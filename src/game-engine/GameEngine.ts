import { GQLWinnerType } from '../__typedefs/graphqlTypes'

export class GameEngine {
  isMoveValid = (newState: string, stateHistory: string[], validMarker: string): boolean => {
    const previousState: string = stateHistory[stateHistory.length - 1]

    if (previousState.length !== newState.length) {
      return false
    }

    let diff = ''
    let isViolatingPreviousState = false
    previousState.split('').forEach((val, i) => {
      if (val !== newState.charAt(i)) {
        if (val !== 'X' && val !== 'O') {
          diff += newState.charAt(i)
        } else {
          isViolatingPreviousState = true
        }
      }
    })

    return !isViolatingPreviousState && diff === validMarker
  }

  makeValidAIMove = (stateHistory: string[]): string => {
    const previousState: string = stateHistory[stateHistory.length - 1]
    while (true) {
      const index = Math.floor(Math.random() * 8)
      if (previousState[index] === '.') {
        return (
          previousState.substr(0, index) +
          'X' +
          previousState.substr(index + 1, previousState.length)
        )
      }
    }
  }

  evaluateWinner = (state: string): GQLWinnerType => {
    for (let i = 0; i < 3; i++) {
      if (this.isVerticalWin(state, i)) {
        return this.matchWinner(state[i])
      }
    }

    for (let i = 0; i < 9; i += 3) {
      if (this.isHorizontalWin(state, i)) {
        return this.matchWinner(state[i])
      }
    }

    if (this.isBackslashWin(state) || this.isSlashWin(state)) {
      return this.matchWinner(state[4])
    }

    for (let i = 0; i < 9; i++) {
      if (state[i] === '.') {
        return GQLWinnerType.NONE
      }
    }

    return GQLWinnerType.DRAW
  }

  private isVerticalWin(state: string, i: number): boolean {
    return state[i] === state[i + 3] && state[i] === state[i + 6] && state[i] !== '.'
  }

  private isHorizontalWin(state: string, i: number): boolean {
    return state[i] === state[i + 1] && state[i] === state[i + 2] && state[i] !== '.'
  }

  private isBackslashWin(state: string): boolean {
    return state[0] === state[4] && state[0] === state[8] && state[0] !== '.'
  }

  private isSlashWin(state: string): boolean {
    return state[2] === state[4] && state[2] === state[6] && state[2] !== '.'
  }

  private matchWinner(mark: string): GQLWinnerType {
    if (mark === 'X') {
      return GQLWinnerType.Xs
    } else if (mark === 'O') {
      return GQLWinnerType.Os
    } else {
      throw new Error("Engine's winner algorithm internal error")
    }
  }
}
