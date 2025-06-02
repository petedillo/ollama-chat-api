/**
 * Weather Service - Mock implementation
 * Provides weather information (to be implemented with actual API)
 */

class WeatherService {
  constructor() {
    this.serviceName = 'weather';
  }

  /**
   * Get current weather information
   * @param {string} location - The location to get weather for
   * @returns {Object} Weather information
   */
  async getWeather(location = 'current') {
    // Mock implementation - would be replaced with actual API call
    return {
      location: location === 'current' ? 'New York' : location,
      temperature: 72,
      condition: 'Sunny',
      humidity: 45,
      windSpeed: 5,
      timestamp: new Date()
    };
  }

  /**
   * Get weather forecast
   * @param {string} location - The location to get forecast for
   * @param {number} days - Number of days for forecast
   * @returns {Array} Weather forecast array
   */
  async getForecast(location = 'current', days = 5) {
    // Mock implementation
    const forecast = [];
    for (let i = 0; i < days; i++) {
      forecast.push({
        day: i + 1,
        temperature: 70 + Math.floor(Math.random() * 10),
        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
        timestamp: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
      });
    }
    return forecast;
  }
}

module.exports = new WeatherService();
