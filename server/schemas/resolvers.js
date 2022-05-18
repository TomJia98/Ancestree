const { AuthenticationError } = require("apollo-server-express");
const { User, Person } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLDateTime } = require("graphql-iso-date");

const customScalarResolver = {
  Date: GraphQLDateTime,
};
function alsoContains(a, b) {
  for (var i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
  return true;
}

function isEqual(a, b) {
  // If length is not equal
  if (a.length != b.length) return false;
  else {
    // Comparing each element of array
    for (var i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
    return true;
  }
}

const resolvers = {
  Query: {
    persons: async (parent, args, context) => {
      console.log(context.user);
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

    updatePerson: async (
      parent,
      { _ID, name, deathDate, birthday, parents, children, isClose },
      context
    ) => {
      const user = context.user;
      if (!user) {
        return new Error("No User is logged in");
      }
      const updatingPerson = await Person.findOne({
        _ID: _ID,
        createdBy: user._id,
      });

      if (updatingPerson) {
        if (isEqual(parents, updatingPerson.parents)) {
          //this runs if the two are the same
          const updatedPerson = await Person.findOneAndUpdate(
            { _ID: _ID },
            {
              name,
              deathDate,
              birthday,
              children,
              isClose,
            },
            { new: true }
          );
          return updatedPerson;
        } else if (
          !alsoContains(parents, updatingPerson.parents) &&
          parents >= 2
        ) {
          const updatedPerson = await Person.findOneAndUpdate(
            { _ID: _ID },
            {
              name,
              deathDate,
              birthday,
              parents,
              children,
              isClose,
            },
            { new: true }
          );
          return updatedPerson;
        }
      } else {
        return new Error("cannot find person");
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
    login: async (parent, { email, password }, context) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user with this email found!");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect password!");
      }

      const token = signToken(user);
      return { token, user };
    },
  },
};

module.exports = { resolvers, customScalarResolver };

// {
//   "data": {
//     "persons": [
//       {
//         "_id": "6284b654dccd1e12c2b140b7",
//         "name": "Jeff"
//       },
//       {
//         "_id": "6284bc2ec33d5e3289c25406",
//         "name": "sam"
//       },
//       {
//         "_id": "6284bc4ac33d5e3289c25408",
//         "name": "samie"
//       },
//       {
//         "_id": "6284bc60c33d5e3289c2540a",
//         "name": "samieeee"
//       }
//     ]
//   }
// }
