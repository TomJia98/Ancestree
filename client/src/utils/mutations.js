import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser(
    $name: String!
    $email: String!
    $password: String!
    $birthday: String!
  ) {
    addUser(
      name: $name
      email: $email
      password: $password
      birthday: $birthday
    ) {
      token
      User {
        _id
        name
      }
    }
  }
`;

export const ADD_PERSON = gql`
  mutation addPerson(
    $name: String!
    $deathDate: String
    $birthday: String
    $parents: [String]
    $children: [String]
    $isClose: Boolean!
  ) {
    addPerson(
      name: $name
      deathDate: $deathDate
      birthday: $birthday
      parents: $parents
      children: $children
      isClose: $isClose
    ) {
      name
      deathDate
      birthday
      createdBy
      parents
      children
      isClose
    }
  }
`;

export const UPDATE_PERSON = gql`
  mutation updatePerson(
    $_ID: ID!
    $name: String!
    $deathDate: String
    $birthday: String
    $parents: [String]
    $children: [String]
    $isClose: Boolean!
  ) {
    updatePerson(
      _ID: $_ID
      name: $name
      deathDate: $deathDate
      birthday: $birthday
      parents: $parents
      children: $children
      isClose: $isClose
    ) {
      name
      deathDate
      birthday
      parents
      children
      isClose
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const DELETE_PERSON = gql`
  mutation deletePerson($_ID: ID!) {
    deletePerson(_ID: $_ID) {
      String
    }
  }
`;
