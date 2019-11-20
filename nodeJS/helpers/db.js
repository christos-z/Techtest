//Just a simple DB script, to persist user data.
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ users: [], sessions: [] }).write()

  const findUser = (userName) => db.get('users').find({userName}).value();

  const createUser = (userName, passwordHash, salt) => db.get('users')
    .push({ userName, hashedPassword: passwordHash, salt: salt})
    .write()

  const createSession = (userName, sessionId) => db.get('sessions')
    .push({ userName, sessionId})
    .write()

module.exports = { findUser, createUser, createSession };

