import { IResolvers } from 'graphql-tools'

const resolver: IResolvers = {
  Query: {
    helloworld (hi: any, args: any): string {
      console.log(hi)
      console.log(args)
      return 'Hello world'
    }
  }
}

export default resolver
