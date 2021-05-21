import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema } from 'graphql'

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
   type RandomDie {
     numSides: Int!
     rollOnce: Int!
     roll(numRolls: Int!): [Int],
   }

   type Query {
     getDie(numSides: Int): RandomDie
   }
`)

interface INumRolls {
  numRolls: number
}

interface INumSides {
  numSides: number
}

interface IRandomDie {
  numSides: number
  rollOnce: () => number
  roll: (args: INumRolls) => number[]
}

class RandomDie implements IRandomDie {
  numSides: number
  constructor (numSides: number) {
    this.numSides = numSides
  }

  rollOnce (): number {
    return 1 + Math.floor(Math.random() * this.numSides)
  }

  roll ({ numRolls }: INumRolls): number[] {
    const output = []
    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce())
    }
    return output
  }
}

// The root provides a resolver function for each API endpoint
const root = {
  getDie: ({ numSides }: INumSides) => {
    return new RandomDie(numSides || 6)
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('Running a graphQL API server at http://localhost:4000')
})
