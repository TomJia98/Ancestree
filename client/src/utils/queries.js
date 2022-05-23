import { gql } from "@apollo/client";

export const QUERY_PERSONS = gql`
  query Persons {
    persons {
      _id
      name
      deathDate
      birthday
      createdBy
      parents
      children
      isClose
      isLinked
    }
  }
`;

export const QUERY_SINGLE_PERSON = gql`
  query singleProfile($personId: ID!) {
    person(personId: $personId) {
      _id
      name
      birthday
      createdBy
      parents
      children
      isClose
      isLinked
    }
  }
`;

export const QUERY_USERS = gql`
  query users {
    User {
      _id
      name
      email
      person
    }
  }
`;
