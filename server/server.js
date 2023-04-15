const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
// Importing ApolloServer
const { ApolloServer } = require("apollo-server-express");

// Importing authMiddeleware
const { authMiddleware } = require("./utils/auth");

// Importing Schemas
const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

//Importing the server middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
