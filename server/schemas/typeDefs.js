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
    parents: [String]
    children: [String]
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
    users: [User]
  }

  type Mutation {
    addPerson(
      name: String!
      deathDate: Date
      birthday: Date
      createdBy: [ID]
      parents: [String]
      children: [String]
      isClose: Boolean!
    ): Auth

    updatePerson(
      _ID: ID!
      name: String
      deathDate: Date
      birthday: Date
      parents: [String]
      children: [String]
      isClose: Boolean
    ): Person

    addUser(
      name: String!
      email: String!
      password: String!
      birthday: Date
    ): Auth

    login(email: String!, password: String!): Auth
  }
`;
// removeUser(deleteAll: Boolean!): Auth
// get this working at a later date

module.exports = typeDefs;
