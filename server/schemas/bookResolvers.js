const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');

const bookResolvers = {
  Query: {
    books: async () => {
      return await Book.find({});
    },
  },
  Mutation: {
    saveBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: args.input } },
            { new: true }
          );

          return updatedUser;
        } catch (err) {
          throw new Error(err);
        }
      }
      throw new AuthenticationError('You need to be logged in to save a book.');
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { savedBooks: { bookId: args.bookId } } },
            { new: true }
          );

          return updatedUser;
        } catch (err) {
          throw new Error(err);
        }
      }
      throw new AuthenticationError('You need to be logged in to remove a book.');
    },
  },
};

module.exports = bookResolvers;