const express = require('express');
const router = express.Router();
const { sequelize } = require('../models'); // Assuming your Sequelize models are in a models directory

/* GET home page. */
router.get('/', async function(req, res, next) {
  try {
    // Get database information
    const dbInfo = {
      name: sequelize.config.database,
      dialect: sequelize.options.dialect,
      host: sequelize.config.host
    };
    
    // Return JSON response
    res.json({
      message: "Welcome to the API",
      status: "Server is running",
      database: dbInfo,
      timestamp: new Date()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;