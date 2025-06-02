/**
 * Smart Home Service - Mock implementation
 * Provides smart home device control (to be implemented with actual API)
 */

class SmartHomeService {
  constructor() {
    this.serviceName = 'smartHome';
    this.devices = [
      { id: 'light1', name: 'Living Room Light', type: 'light', status: 'off', brightness: 0 },
      { id: 'light2', name: 'Bedroom Light', type: 'light', status: 'off', brightness: 0 },
      { id: 'thermostat1', name: 'Living Room Thermostat', type: 'thermostat', status: 'on', temperature: 72 }
    ];
  }

  /**
   * List all smart home devices
   * @returns {Array} List of devices
   */
  async listDevices() {
    return this.devices;
  }

  /**
   * Get status of a specific device
   * @param {string} deviceId - ID of the device
   * @returns {Object} Device status
   */
  async getDeviceStatus(deviceId) {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) {
      throw new Error('Device not found');
    }
    return device;
  }

  /**
   * Control a smart home device
   * @param {string} deviceId - ID of the device
   * @param {string} command - Command to execute (e.g., 'on', 'off', 'setBrightness')
   * @param {Object} params - Command parameters
   * @returns {Object} Updated device status
   */
  async controlDevice(deviceId, command, params = {}) {
    const deviceIndex = this.devices.findIndex(d => d.id === deviceId);
    if (deviceIndex === -1) {
      throw new Error('Device not found');
    }

    const device = {...this.devices[deviceIndex]};

    switch (command) {
      case 'on':
        device.status = 'on';
        if (device.type === 'light') device.brightness = 100;
        break;
      case 'off':
        device.status = 'off';
        if (device.type === 'light') device.brightness = 0;
        break;
      case 'setBrightness':
        if (device.type !== 'light') throw new Error('Not supported for this device type');
        device.brightness = params.brightness || 50;
        device.status = device.brightness > 0 ? 'on' : 'off';
        break;
      case 'setTemperature':
        if (device.type !== 'thermostat') throw new Error('Not supported for this device type');
        device.temperature = params.temperature || 72;
        break;
      default:
        throw new Error(`Unsupported command: ${command}`);
    }

    // Update device in the list
    this.devices[deviceIndex] = device;
    return device;
  }
}

module.exports = new SmartHomeService();
