/**
 * Services Index - This file exports all available services
 * Each service should implement a consistent interface for integration
 */

const weatherService = require('./weather');
const mediaService = require('./media');
const smartHomeService = require('./smartHome');

module.exports = {
  weatherService,
  mediaService,
  smartHomeService
};
