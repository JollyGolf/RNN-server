const express = require('express'); 
const graphqlHTTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());

mongoose.connect('mongodb+srv://zhigamovsky:qwertykybcem@cluster0-mpgcc.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});
mongoose.connection.once('open', () => console.log('\nConnected to MongoDB\n'));
 
app.use('/graphql', graphqlHTTTP({
  schema: schema,
  graphiql: true
})).listen(4000, () => console.log('\nNow listening for requests on port 4000\n'));