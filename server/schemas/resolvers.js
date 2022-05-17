const { AuthenticationError } = require("apollo-server-express");
const { User, Person } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLDateTime } = require("graphql-iso-date");

const customScalarResolver = {
  Date: GraphQLDateTime,
};

const resolvers = {
  Query: {
    persons: async (parent, args, context) => {
      const userId = context.user._id;
      if (!userId) {
        return new Error("user is not logged in");
      }
      return Person.find({ createdBy: userId });
    },
    person: async (parent, { personId }) => {
      return Person.findOne({ _id: personId });
    },
  },
  Mutation: {
    addPerson: async (
      parent,
      { name, deathDate, birthday, parents, children, isClose },
      context
    ) => {
      const user = context.user;
      if (!user) {
        return new Error("user is not logged in");
      }
      try {
        await Person.create({
          name,
          deathDate,
          birthday,
          parents,
          children,
          isClose,
          isLinked: false,
          createdBy: user._id,
        });
        const token = signToken(user);

        return { token, user };
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    addUser: async (parent, { name, email, password, birthday }, context) => {
      try {
        const newPerson = await Person.create({
          name,
          birthday,
          isLinked: true,
          isClose: false,
        });
        const user = await User.create({
          name,
          email,
          password,
          person: { _id: newPerson._id },
        });

        const token = signToken(user);

        return { token, user };
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    login: async (parent, { email }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await profile.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = { resolvers, customScalarResolver };
