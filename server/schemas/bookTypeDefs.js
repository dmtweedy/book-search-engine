const { gql } = require('apollo-server-express');

const bookTypeDefs = gql`
  type Book {
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
  type Query {
    books(searchTerm: String!): [Book]
  }
  type Mutation {
    saveBook(input: BookInput!): Book
    removeBook(bookId: ID!): Book 
  }
  input BookInput {
    # Define the fields for the input type
    title: String
    authors: [String]
    description: String
    image: String
    link: String
  }
`;

module.exports = bookTypeDefs;