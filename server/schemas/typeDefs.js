// Importing gql from the Apollo
const { gql } = require("apollo-server-express");
const typeDefs = gql`
# declaring type book with it values
type Book {
    authors: [String]
    description: String
    bookId: String!
    image: String
    link: String
    title: String!
}
# declaring type User with it value
type User {
    _id: ID
    username: String!
    email: String!
    bookCount: Int
    saveBook: [Book]
}
# declaring type Auth with it values
type Auth {
    token: ID!
    user: User
}
# declaring Save book input with it values
input SaveBookInput {
    authors: [String]
    title: String
    decsription: String
    bookId: String
    image: String
    link: String
}
# declaring me to the user
type Query {
    me: User
}
# declaring the mutation types
type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: SaveBookInput): User
    removeBook(bookId: String!): User
}

`;
module.exports = typeDefs;