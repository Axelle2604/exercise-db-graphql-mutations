const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema.js');

const app = express();

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }));

const server = app.listen(8000, () => {
  console.log(`Server started on port ${server.address().port}`);
});
