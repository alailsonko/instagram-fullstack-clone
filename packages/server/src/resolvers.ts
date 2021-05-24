import { IResolvers } from 'graphql-tools'

const resolver: IResolvers = {
  Query: {
    helloworld (_: any, args: any): string {
      console.log(args)
      return 'Hello world'
    }
  }
}

export default resolver
