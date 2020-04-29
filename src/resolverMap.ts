import { IResolvers } from 'graphql-tools'

export const resolverMap: IResolvers = {
  Query: {
    helloWorld(_: void, args: void): string {
      return `👋 Hello world! 👋`
    },
  },
}
