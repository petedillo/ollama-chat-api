const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
const { ping } = require('../services/ollama');

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    // Get database information
    const dbInfo = {
      name: sequelize.config.database,
      dialect: sequelize.options.dialect,
      host: sequelize.config.host
    };

    // Check Ollama status
    const ollamaStatus = await ping();

    // Return JSON response
    res.json({
      message: "Welcome to the API",
      status: "Server is running",
      database: dbInfo,
      ollama: ollamaStatus ? "Ollama is working" : "Ollama is not reachable",
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
