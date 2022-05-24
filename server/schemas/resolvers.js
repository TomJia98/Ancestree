const { AuthenticationError } = require("apollo-server-express");
const { User, Person } = require("../models");
const { signToken } = require("../utils/auth");
const { GraphQLDateTime } = require("graphql-iso-date");

const customScalarResolver = {
  Date: GraphQLDateTime,
};

// function alsoContains(a, b) {
//   for (var i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
//   return true;
// }

// function isEqual(a, b) {
//   // If length is not equal
//   if (a.length != b.length) return false;
//   else {
//     // Comparing each element of array
//     for (var i = 0; i < a.length; i++) if (a[i] != b[i]) return false;
//     return true;
//   }
// }
//old functions, might be used later

const resolvers = {
  Query: {
    persons: async (parent, args, context) => {
      console.log(context.user);
      console.log("---------------------------- contxt.usr");
      const userId = context.user._id;
      if (!userId) {
        return new Error("user is not logged in");
      }
      return await Person.find({ createdBy: userId });
    },
    person: async (parent, { personId }) => {
      console.log(personId);
      const person = await Person.findById(personId);
      console.log(person);
      return person;
    },
    users: async (parent, args, context) => {
      const users = await User.find();
      return users;
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
      if (parents) {
        if (parents.length > 2) {
          return new Error("cant have more than 2 parents");
        }
      }
      try {
        const newPerson = await Person.create({
          name,
          deathDate,
          birthday,
          parents,
          children,
          isClose,
          isLinked: false,
          createdBy: user._id,
        });

        return newPerson;
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    updateRelations: async (parent, { _ID, children, parents }) => {
      try {
        const updatingPerson = await Person.findById({ _id: _ID });
        if (updatingPerson.parents.length < 2 && parents) {
          const updatePerson = await Person.findByIdAndUpdate(
            { _id: _ID },
            {
              $push: { parents: parents, children: children },
            },
            { new: true }
          );
          return updatePerson;
        }
      } catch (e) {
        console.log(e);
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
      if (parents) {
        if (parents.length > 2) {
          return new Error("cant have more than 2 parents");
        }
      }

      const updatingPerson = await Person.findOne({
        _id: _ID,
        createdBy: user._id,
      });

      if (updatingPerson) {
        //this runs if the two are the same
        const updatedPerson = await Person.findOneAndUpdate(
          { _id: _ID },
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
        console.log(updatedPerson + `person ${updatingPerson.name}`);
        return updatedPerson;
      } else {
        return new Error("cannot find person");
      }
    },
    addUser: async (parent, { name, email, password, birthday }, context) => {
      try {
        console.log("creating new user named " + name);
        const newPerson = await Person.create({
          name,
          birthday,
          isLinked: true,
          isClose: false,
        });
        console.log(newPerson._id);
        const id = newPerson._id.toString();
        console.log(id);

        const user = await User.create({
          name,
          email,
          password,
          person: id,
        });
        const userId = user._id.toString();

        const updatedPerson = await Person.findByIdAndUpdate(
          { _id: newPerson._id },
          { createdBy: [userId] },
          { new: true }
        );
        console.log(updatedPerson);
        const token = signToken(user);

        return { token, user };
      } catch (err) {
        console.log(err);
        return err;
      }
    },

    deletePerson: async (parent, { _ID }, context) => {
      const user = context.user;
      if (!user) {
        return new Error("user not logged in!");
      }
      const findPerson = await Person.findOne({ _id: _ID });
      if (findPerson.children.length === 0 && findPerson.parents.length === 0) {
        await findOneAndDelete({ _id: _ID });
        return `${findPerson.name} has been deleted with all traces`;
      } else if (
        findPerson.children.length === 0 &&
        findPerson.parents.length !== 0
      ) {
        const parents = findPerson.parents;
        console.log(parents);
        for (let i = 0; i < parents.length; i++) {
          await Person.findOneAndUpdate(
            { _id: parents[i] },
            {
              $pull: {
                children: { _id: _ID },
              },
            }
          ); //go through the selected person to delete and scrub them from their parents children array
        }
        return `${findPerson.name} has been deleted with all traces`;
      } else if (findPerson.children.length !== 0) {
        await Person.findOneAndUpdate({
          name: "",
          deathDate: "",
          birthday: "",
          isclose: false,
          isLinked: false,
        });
        return `${findPerson.name}'s details have been removed, but links kept intact`;
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
