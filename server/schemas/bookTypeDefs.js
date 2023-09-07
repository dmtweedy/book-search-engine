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
`;

module.exports = bookTypeDefs;