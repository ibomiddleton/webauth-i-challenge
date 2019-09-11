const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const db = require('../database/dbConfig.js');

const server = express();

const KnexSessionStore = connectSessionKnex(session);

const sessionConfig = {
    name: 'not a session',
    // THIS SHOULD NOT BE HARD CODED IN
    secret: 'okay it actually is a session but dont tell',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
      httpOnly: true // the cant access via js
    },
    resave: false,
    saveUninitialized: false,
    // where do we store our sessions?
    store: new KnexSessionStore({
      knex: db,
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true,
      clearInterval: 1000 * 60 * 60
    })
  }

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.json({ api: 'up' });
});

module.exports = server;