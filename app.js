const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Database initialization
const db = require('./models');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const chatRouter = require('./routes/chat');

const app = express();

// Middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', chatRouter);

// Sync database
db.sequelize.sync()
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch(err => {
    console.error('Failed to synchronize database:', err);
  });

module.exports = app;
