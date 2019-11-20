const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors') 

const { findUser, createUser, createSession } = require('./helpers/db');
const { saltHashPassword, passTheSalt, generateSession } = require('./helpers/cypto')

var signUp = {
  createUser: function ({userName, password, confirmPassword}) {
    if(password.length >=6 && password === confirmPassword) {
      var dbUser = findUser(userName);
      if(!dbUser) {
        var hashedPassword = saltHashPassword(password);
        try {
          createUser(userName, hashedPassword.passwordHash, hashedPassword.salt);
          return true;
        } catch {
          throw new Error('UNKNOWN')
        }
      } else {
        throw new Error('USER_EXISTS');
      }
    }
    throw new Error('INVALID_PASSWORD');
  }
};

var login = {
  login: function ({userName, password}) {
    var dbUser = findUser(userName);
    if(dbUser) {
      const saltedPassword = passTheSalt(password, dbUser.salt)
      if(saltedPassword.passwordHash == dbUser.hashedPassword) {
        const sessionId = generateSession();
        createSession(userName, sessionId)
        return sessionId;
      }
    } 
    throw new Error('INVALID_CREDENTIALS');
  }
};

var app = express();
app.use(cors()); //To prevent cross origin issues
app.listen(4000);


app.use('/signup', graphqlHTTP({
  schema: buildSchema(`type Query { createUser(userName: String!, password: String!, confirmPassword: String!): Boolean }`),
  rootValue: signUp,
  graphiql: false,
}));

app.use('/login', graphqlHTTP({
  schema: buildSchema(`type Query { login(userName: String!, password: String!): String }`),
  rootValue: login,
  graphiql: false,
}));
