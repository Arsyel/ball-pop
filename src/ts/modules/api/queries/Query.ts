import { gql } from "graphql-request";

export const getBooksQuery = gql`
  query GetBooks {
    books {
      id
      name
      author {
        name
        id
      }
    }
  }
`;

export const addBookMutation = gql`
  mutation AddBook ($name: String!, $genre: String!, $authorId: ID!) {
    addBook (name: $name, genre: $genre, authorId: $authorId) {
      id
      name
    }
  }
`;