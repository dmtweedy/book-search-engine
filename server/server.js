const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { typeDefs, resolvers } = require('./schemas');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use((req, res, next) => {
    console.log(`Received request for: ${req.url}`);
    next();
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start(); // Ensure the Apollo Server is started

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  server.applyMiddleware({ app, path: '/graphql' });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  app.get('*.js', (req, res, next) => {
    res.type('application/javascript');
    next();
  });

  app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

  app.use(routes);

  db.once('open', () => {
    app.listen(PORT, () => console.log(`🌍 Now listening on http://localhost:${PORT}`));
  });
}

startServer();