const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
require('dotenv').config();

// Database initialization
const db = require('./models');

const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');

const app = express();

const {ping} = require('./services/ollama');
// Middleware
app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/', indexRouter);
app.use('/chat', chatRouter);

// Sync database
db.sequelize.sync()
    .then(() => {
        return ping();
    })
    .then((isOllamaWorking) => {
        console.log('Database synchronized successfully');
        if (isOllamaWorking === true) {
            console.log('Ollama is working');
        }
    })
    .catch(err => {
        console.error('Failed to synchronize database:', err);
    });


module.exports = app;
