const { gql } = require('apollo-server-express');

// Import type definitions
const userTypeDefs = require('./userTypeDefs');
const bookTypeDefs = require('./bookTypeDefs');

// Import resolvers
const userResolvers = require('./userResolvers');
const bookResolvers = require('./bookResolvers');

// Combine type definitions and resolvers
const typeDefs = gql`
  ${userTypeDefs}
  ${bookTypeDefs}
`;

const resolvers = {
  ...userResolvers,
  ...bookResolvers,
};

module.exports = { typeDefs, resolvers };