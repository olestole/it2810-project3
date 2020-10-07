import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String!
    cats: [Cat!]!
    age: Int!
    ingredients(ingredient: String): String!
    yo: String!
  }

  type Cat {
    id: ID!
    name: String!
  }

  type Mutation {
    createCat(name: String!): Cat!
  }
`;