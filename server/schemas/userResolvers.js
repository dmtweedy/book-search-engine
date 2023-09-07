const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const userResolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('savedBooks');

        return userData;
      }
      throw new AuthenticationError('You need to be logged in to see this information.');
    },
  },
  Mutation: {
    login: async (parent, args) => {
      try {
        const user = await User.findOne({ $or: [{ username: args.email }, { email: args.email }] });
        if (!user) {
          throw new AuthenticationError('No user found with this email/username');
        }

        const correctPw = await user.isCorrectPassword(args.password);
        if (!correctPw) {
          throw new AuthenticationError('Incorrect password');
        }

        const token = signToken(user);
        return { token, user };
      } catch (err) {
        throw new Error(err);
      }
    },
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user);
        return { token, user };
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  User: {
    savedBooks: async (parent) => {
      const savedBooks = await User.findOne({ _id: parent._id }).populate('savedBooks');
      return savedBooks.savedBooks;
    },
  },
};

module.exports = userResolvers;