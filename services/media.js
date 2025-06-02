/**
 * Media Service - Mock implementation
 * Provides media player functionality (to be implemented with actual API)
 */

class MediaService {
  constructor() {
    this.serviceName = 'media';
    this.isPlaying = false;
    this.currentTrack = null;
    this.volume = 50;
    this.playlist = [
      { id: '1', title: 'Sample Track 1', artist: 'Artist 1', duration: 180 },
      { id: '2', title: 'Sample Track 2', artist: 'Artist 2', duration: 240 },
      { id: '3', title: 'Sample Track 3', artist: 'Artist 3', duration: 200 }
    ];
  }

  /**
   * List available media
   * @returns {Array} List of media items
   */
  async listMedia() {
    // Mock implementation - would connect to actual media library
    return this.playlist;
  }

  /**
   * Play a media item
   * @param {string} mediaId - ID of the media to play
   * @returns {Object} Status information
   */
  async play(mediaId) {
    const track = this.playlist.find(item => item.id === mediaId);
    if (!track) {
      throw new Error('Media not found');
    }
    
    this.isPlaying = true;
    this.currentTrack = track;
    
    return {
      status: 'playing',
      track: this.currentTrack
    };
  }

  /**
   * Pause playback
   * @returns {Object} Status information
   */
  async pause() {
    this.isPlaying = false;
    return {
      status: 'paused',
      track: this.currentTrack
    };
  }

  /**
   * Get current playback status
   * @returns {Object} Status information
   */
  async getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume
    };
  }
}

module.exports = new MediaService();
