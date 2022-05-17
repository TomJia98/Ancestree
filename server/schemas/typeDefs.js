const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type User {
    _id: ID!
    name: String
    email: String
    password: String
    person: Person!
  }

  type Person {
    _id: ID!
    name: String
    deathDate: Date
    birthday: Date
    createdBy: [ID!]
    parents: [Person]
    children: [Person]
    isClose: Boolean!
    isLinked: Boolean!
  }

  type Auth {
    token: ID!
    profile: User
  }

  type Query {
    persons: [Person]!
    person(personId: ID!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      deathDate: Date!
      birthday: Date!
      createdBy: [ID!]
      parents: [ID!]
      children: [ID!]
      isClose: Boolean!
    ): Auth

    addUser(
      name: String!
      email: String!
      password: String!
      birthday: Date
    ): Auth

    login(email: String!, password: String!): Auth
  }
`;
// removeUser(deleteAll: Boolean!): Auth // get this working at a later date

module.exports = typeDefs;
