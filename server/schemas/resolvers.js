const { AuthenticationError } = require("apollo-server-express");
//Importing User from the modules
const { User } = require("../models");
// Importing sighToken from utils
const { signToken } = require("../utils/auth");

//set the queires foe me and data errors
const resolvers = {
    Query: {
        me: async (parent, args, contex) => {
            if (AudioContext.user) {
                const userData = await User.findOne({ _id: AudioContext.user._id }).select(
                    "-__v -password"
                );
                return userData;
            };
            throw new AuthenticationError("Not logged in")
        },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError("Invalid credentials");
            }
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw new AuthenticationError("Invalid credentials");
            }
            const token = signToken(user);
            return { token, user };
        },

        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to be logged in!");
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError("You need to logged in!");
        },
    },
};
module.exports = resolvers;