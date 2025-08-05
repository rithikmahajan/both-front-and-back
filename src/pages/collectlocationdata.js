/**
 * Location Data Collection Module
 * 
 * This module handles all location data collection functionality
 * including geolocation services, IP-based location detection, 
 * user location preferences, privacy controls, and location analytics.
 * 
 * Features:
 * - Real-time geolocation tracking
 * - IP-based location detection
 * - Location history management
 * - Privacy and consent controls
 * - Location-based analytics
 * - Data export/import functionality
 * - Location accuracy settings
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ==============================
// CONSTANTS
// ==============================

const LOCATION_ACCURACY_LEVELS = {
  HIGH: 'high',        // GPS accuracy
  MEDIUM: 'medium',    // Network accuracy
  LOW: 'low',          // IP-based accuracy
  DISABLED: 'disabled' // No location tracking
};

const LOCATION_DATA_TYPES = {
  GPS_COORDINATES: 'gpsCoordinates',
  IP_LOCATION: 'ipLocation',
  WIFI_LOCATION: 'wifiLocation',
  CELLULAR_LOCATION: 'cellularLocation',
  TIMEZONE: 'timezone',
  ADDRESS: 'address',
  COUNTRY: 'country',
  REGION: 'region',
  CITY: 'city'
};

const COLLECTION_METHODS = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
  ON_REQUEST: 'onRequest',
  PERIODIC: 'periodic'
};

const PRIVACY_LEVELS = {
  EXACT: 'exact',           // Exact coordinates
  APPROXIMATE: 'approximate', // Rounded to nearest km
  CITY_LEVEL: 'cityLevel',   // City level only
  COUNTRY_LEVEL: 'countryLevel', // Country level only
  ANONYMOUS: 'anonymous'     // No location data
};

const DEFAULT_LOCATION_SETTINGS = {
  collectionEnabled: false,
  accuracyLevel: LOCATION_ACCURACY_LEVELS.MEDIUM,
  collectionMethod: COLLECTION_METHODS.ON_REQUEST,
  privacyLevel: PRIVACY_LEVELS.CITY_LEVEL,
  retentionPeriod: 30, // days
  shareWithThirdParties: false,
  anonymizeData: true,
  enableLocationHistory: false,
  enableAnalytics: true,
  backgroundTracking: false,
  frequencyMinutes: 60,
  radiusMeters: 100,
  consentTimestamp: null,
  lastUpdated: null
};

// ==============================
// LOCATION DATA COLLECTION CLASS
// ==============================

class LocationDataCollector {
  constructor() {
    this.settings = { ...DEFAULT_LOCATION_SETTINGS };
    this.locationHistory = [];
    this.currentLocation = null;
    this.watchId = null;
    this.analyticsData = {};
    this.consentRecords = [];
    this.isTracking = false;
  }

  /**
   * Initialize the location data collector
   */
  async initialize() {
    try {
      await this.loadSettings();
      await this.loadLocationHistory();
      this.setupEventListeners();
      
      if (this.settings.collectionEnabled && this.settings.collectionMethod === COLLECTION_METHODS.AUTOMATIC) {
        await this.startLocationTracking();
      }
      
      console.log('Location Data Collector initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Location Data Collector:', error);
    }
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    try {
      const savedSettings = localStorage.getItem('locationDataSettings');
      if (savedSettings) {
        this.settings = { ...DEFAULT_LOCATION_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading location settings:', error);
    }
  }

  /**
   * Save settings to storage
   */
  async saveSettings() {
    try {
      this.settings.lastUpdated = new Date().toISOString();
      localStorage.setItem('locationDataSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving location settings:', error);
    }
  }

  /**
   * Load location history from storage
   */
  async loadLocationHistory() {
    try {
      const savedHistory = localStorage.getItem('locationDataHistory');
      if (savedHistory) {
        this.locationHistory = JSON.parse(savedHistory);
        this.cleanupExpiredData();
      }
    } catch (error) {
      console.error('Error loading location history:', error);
    }
  }

  /**
   * Save location history to storage
   */
  async saveLocationHistory() {
    try {
      localStorage.setItem('locationDataHistory', JSON.stringify(this.locationHistory));
    } catch (error) {
      console.error('Error saving location history:', error);
    }
  }

  /**
   * Update location settings
   */
  updateSettings(newSettings) {
    const oldSettings = { ...this.settings };
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.recordConsentChange(newSettings);
    
    // Handle tracking state changes
    if (oldSettings.collectionEnabled !== this.settings.collectionEnabled) {
      if (this.settings.collectionEnabled) {
        this.startLocationTracking();
      } else {
        this.stopLocationTracking();
      }
    }
  }

  /**
   * Record consent change
   */
  recordConsentChange(settings) {
    const consentRecord = {
      timestamp: new Date().toISOString(),
      settings: { ...settings },
      ipAddress: this.getUserIPAddress(),
      userAgent: navigator.userAgent,
      changeType: settings.collectionEnabled ? 'granted' : 'revoked'
    };
    
    this.consentRecords.push(consentRecord);
    this.saveConsentRecords();
  }

  /**
   * Save consent records
   */
  saveConsentRecords() {
    try {
      localStorage.setItem('locationDataConsent', JSON.stringify(this.consentRecords));
    } catch (error) {
      console.error('Error saving consent records:', error);
    }
  }

  /**
   * Start location tracking
   */
  async startLocationTracking() {
    if (!this.settings.collectionEnabled || this.isTracking) return;

    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      // Request permission
      const permission = await this.requestLocationPermission();
      if (permission !== 'granted') {
        throw new Error('Location permission denied');
      }

      const options = this.getGeolocationOptions();
      
      if (this.settings.collectionMethod === COLLECTION_METHODS.PERIODIC || 
          this.settings.backgroundTracking) {
        // Start watching position
        this.watchId = navigator.geolocation.watchPosition(
          (position) => this.handleLocationSuccess(position),
          (error) => this.handleLocationError(error),
          options
        );
      } else {
        // Get current position once
        navigator.geolocation.getCurrentPosition(
          (position) => this.handleLocationSuccess(position),
          (error) => this.handleLocationError(error),
          options
        );
      }

      this.isTracking = true;
      console.log('Location tracking started');
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      this.handleLocationError(error);
    }
  }

  /**
   * Stop location tracking
   */
  stopLocationTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.isTracking = false;
    console.log('Location tracking stopped');
  }

  /**
   * Request location permission
   */
  async requestLocationPermission() {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state;
      }
      return 'granted'; // Assume granted if permissions API not available
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return 'denied';
    }
  }

  /**
   * Get geolocation options based on settings
   */
  getGeolocationOptions() {
    const accuracyMap = {
      [LOCATION_ACCURACY_LEVELS.HIGH]: { enableHighAccuracy: true, timeout: 30000, maximumAge: 60000 },
      [LOCATION_ACCURACY_LEVELS.MEDIUM]: { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
      [LOCATION_ACCURACY_LEVELS.LOW]: { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    };

    return accuracyMap[this.settings.accuracyLevel] || accuracyMap[LOCATION_ACCURACY_LEVELS.MEDIUM];
  }

  /**
   * Handle successful location retrieval
   */
  async handleLocationSuccess(position) {
    const locationData = await this.processLocationData(position);
    this.currentLocation = locationData;
    
    if (this.settings.enableLocationHistory) {
      this.addToLocationHistory(locationData);
    }
    
    if (this.settings.enableAnalytics) {
      this.updateAnalytics(locationData);
    }
    
    // Trigger location update event
    this.dispatchLocationEvent('locationUpdate', locationData);
  }

  /**
   * Handle location retrieval errors
   */
  handleLocationError(error) {
    let errorMessage = 'Unknown location error';
    
    switch (error.code || error.message) {
      case error.PERMISSION_DENIED || 'Location permission denied':
        errorMessage = 'Location access denied by user';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information unavailable';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out';
        break;
      default:
        errorMessage = error.message || 'Location error occurred';
    }
    
    console.error('Location error:', errorMessage);
    this.dispatchLocationEvent('locationError', { error: errorMessage, code: error.code });
    
    // Try fallback methods
    this.tryFallbackLocation();
  }

  /**
   * Process and privacy-filter location data
   */
  async processLocationData(position) {
    const { latitude, longitude, accuracy, altitude, heading, speed } = position.coords;
    const timestamp = new Date(position.timestamp).toISOString();
    
    let processedData = {
      timestamp,
      accuracy,
      source: 'gps',
      collectedAt: new Date().toISOString()
    };

    // Apply privacy filtering
    switch (this.settings.privacyLevel) {
      case PRIVACY_LEVELS.EXACT:
        processedData = {
          ...processedData,
          latitude,
          longitude,
          altitude,
          heading,
          speed
        };
        break;
        
      case PRIVACY_LEVELS.APPROXIMATE:
        processedData = {
          ...processedData,
          latitude: this.roundCoordinate(latitude, 3), // ~111m accuracy
          longitude: this.roundCoordinate(longitude, 3),
          altitude: altitude ? Math.round(altitude / 10) * 10 : null
        };
        break;
        
      case PRIVACY_LEVELS.CITY_LEVEL:
        processedData = {
          ...processedData,
          latitude: this.roundCoordinate(latitude, 1), // ~11km accuracy
          longitude: this.roundCoordinate(longitude, 1)
        };
        break;
        
      case PRIVACY_LEVELS.COUNTRY_LEVEL:
        // Only store country-level data
        processedData = {
          ...processedData,
          country: await this.getCountryFromCoordinates(latitude, longitude)
        };
        break;
        
      case PRIVACY_LEVELS.ANONYMOUS:
        // No coordinate data, only metadata
        processedData = {
          timestamp,
          source: 'gps',
          collectedAt: new Date().toISOString()
        };
        break;
    }

    return processedData;
  }

  /**
   * Round coordinates for privacy
   */
  roundCoordinate(coord, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.round(coord * factor) / factor;
  }

  /**
   * Add location data to history
   */
  addToLocationHistory(locationData) {
    this.locationHistory.push(locationData);
    
    // Limit history size (keep last 1000 entries)
    if (this.locationHistory.length > 1000) {
      this.locationHistory = this.locationHistory.slice(-1000);
    }
    
    this.saveLocationHistory();
  }

  /**
   * Try fallback location methods
   */
  async tryFallbackLocation() {
    try {
      // Try IP-based location
      const ipLocation = await this.getIPBasedLocation();
      if (ipLocation) {
        this.handleLocationSuccess({
          coords: ipLocation,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Fallback location methods failed:', error);
    }
  }

  /**
   * Get IP-based location
   */
  async getIPBasedLocation() {
    try {
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          accuracy: 10000, // IP location is typically less accurate
          city: data.city,
          region: data.region,
          country: data.country_name,
          source: 'ip'
        };
      }
    } catch (error) {
      console.error('IP-based location failed:', error);
    }
    return null;
  }

  /**
   * Get country from coordinates (reverse geocoding)
   */
  async getCountryFromCoordinates(lat, lng) {
    try {
      // This would typically use a geocoding service
      // For demo purposes, return a placeholder
      return 'Unknown Country';
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Unknown Country';
    }
  }

  /**
   * Update analytics data
   */
  updateAnalytics(locationData) {
    if (!this.analyticsData.totalLocations) {
      this.analyticsData.totalLocations = 0;
    }
    
    this.analyticsData.totalLocations++;
    this.analyticsData.lastLocation = locationData;
    this.analyticsData.lastUpdated = new Date().toISOString();
    
    // Calculate distance traveled if we have previous location
    if (this.locationHistory.length > 0) {
      const lastLocation = this.locationHistory[this.locationHistory.length - 1];
      if (lastLocation.latitude && lastLocation.longitude && 
          locationData.latitude && locationData.longitude) {
        const distance = this.calculateDistance(
          lastLocation.latitude, lastLocation.longitude,
          locationData.latitude, locationData.longitude
        );
        
        if (!this.analyticsData.totalDistance) {
          this.analyticsData.totalDistance = 0;
        }
        this.analyticsData.totalDistance += distance;
      }
    }
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  /**
   * Convert degrees to radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Dispatch location events
   */
  dispatchLocationEvent(eventType, data) {
    const event = new CustomEvent(`locationData${eventType}`, {
      detail: data
    });
    window.dispatchEvent(event);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.settings.backgroundTracking === false) {
        this.stopLocationTracking();
      } else if (!document.hidden && this.settings.collectionEnabled) {
        this.startLocationTracking();
      }
    });
  }

  /**
   * Clean up expired location data
   */
  cleanupExpiredData() {
    if (!this.settings.retentionPeriod) return;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.settings.retentionPeriod);
    
    this.locationHistory = this.locationHistory.filter(location => 
      new Date(location.collectedAt) > cutoffDate
    );
    
    this.saveLocationHistory();
  }

  /**
   * Export location data
   */
  exportData(format = 'json') {
    const exportData = {
      settings: this.settings,
      locationHistory: this.locationHistory,
      currentLocation: this.currentLocation,
      analyticsData: this.analyticsData,
      consentRecords: this.consentRecords,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'csv':
        return this.convertLocationsToCsv(this.locationHistory);
      case 'gpx':
        return this.convertToGpx(this.locationHistory);
      default:
        return exportData;
    }
  }

  /**
   * Convert locations to CSV format
   */
  convertLocationsToCsv(locations) {
    if (locations.length === 0) return '';
    
    const headers = ['timestamp', 'latitude', 'longitude', 'accuracy', 'source'];
    const csvData = locations.map(location => 
      headers.map(header => location[header] || '').join(',')
    );
    
    return [headers.join(','), ...csvData].join('\n');
  }

  /**
   * Convert locations to GPX format
   */
  convertToGpx(locations) {
    const gpxHeader = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="LocationDataCollector">
  <trk>
    <name>Location History</name>
    <trkseg>`;
    
    const gpxFooter = `    </trkseg>
  </trk>
</gpx>`;
    
    const trackPoints = locations
      .filter(location => location.latitude && location.longitude)
      .map(location => 
        `      <trkpt lat="${location.latitude}" lon="${location.longitude}">
        <time>${location.timestamp}</time>
      </trkpt>`
      ).join('\n');
    
    return gpxHeader + '\n' + trackPoints + '\n' + gpxFooter;
  }

  /**
   * Import location data
   */
  importData(data) {
    try {
      const importedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (importedData.settings) {
        this.settings = { ...DEFAULT_LOCATION_SETTINGS, ...importedData.settings };
        this.saveSettings();
      }
      
      if (importedData.locationHistory) {
        this.locationHistory = importedData.locationHistory;
        this.saveLocationHistory();
      }
      
      if (importedData.consentRecords) {
        this.consentRecords = importedData.consentRecords;
        this.saveConsentRecords();
      }
      
      return true;
    } catch (error) {
      console.error('Error importing location data:', error);
      return false;
    }
  }

  /**
   * Clear all location data
   */
  clearAllData() {
    this.locationHistory = [];
    this.currentLocation = null;
    this.analyticsData = {};
    this.consentRecords = [];
    
    this.stopLocationTracking();
    
    localStorage.removeItem('locationDataHistory');
    localStorage.removeItem('locationDataConsent');
    localStorage.removeItem('locationDataSettings');
    
    this.saveLocationHistory();
    this.saveConsentRecords();
  }

  /**
   * Get location data summary
   */
  getDataSummary() {
    return {
      isTrackingEnabled: this.settings.collectionEnabled,
      isCurrentlyTracking: this.isTracking,
      totalLocations: this.locationHistory.length,
      currentLocation: this.currentLocation,
      lastUpdated: this.settings.lastUpdated,
      privacyLevel: this.settings.privacyLevel,
      retentionPeriod: this.settings.retentionPeriod,
      analyticsEnabled: this.settings.enableAnalytics,
      totalDistance: this.analyticsData.totalDistance || 0
    };
  }

  /**
   * Get privacy compliance status
   */
  getPrivacyCompliance() {
    return {
      hasConsent: this.consentRecords.length > 0,
      consentTimestamp: this.settings.consentTimestamp,
      dataMinimization: this.settings.privacyLevel !== PRIVACY_LEVELS.EXACT,
      dataRetention: this.settings.retentionPeriod <= 365,
      thirdPartySharing: !this.settings.shareWithThirdParties,
      anonymization: this.settings.anonymizeData,
      userControl: true // User has control over all settings
    };
  }

  /**
   * Get current location (one-time request)
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      const options = this.getGeolocationOptions();
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const locationData = await this.processLocationData(position);
            resolve(locationData);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }

  /**
   * Get user IP address (helper method)
   */
  getUserIPAddress() {
    // This would typically be obtained from a server-side API
    return 'xxx.xxx.xxx.xxx';
  }
}

// ==============================
// REACT HOOK FOR LOCATION DATA
// ==============================

export const useLocationData = () => {
  const [collector] = useState(() => new LocationDataCollector());
  const [settings, setSettings] = useState(DEFAULT_LOCATION_SETTINGS);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCollector = async () => {
      try {
        setIsLoading(true);
        await collector.initialize();
        setSettings(collector.settings);
        setCurrentLocation(collector.currentLocation);
        setIsTracking(collector.isTracking);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCollector();

    // Setup event listeners
    const handleLocationUpdate = (event) => {
      setCurrentLocation(event.detail);
    };

    const handleLocationError = (event) => {
      setError(event.detail.error);
    };

    window.addEventListener('locationDataLocationUpdate', handleLocationUpdate);
    window.addEventListener('locationDataLocationError', handleLocationError);

    return () => {
      window.removeEventListener('locationDataLocationUpdate', handleLocationUpdate);
      window.removeEventListener('locationDataLocationError', handleLocationError);
      collector.stopLocationTracking();
    };
  }, [collector]);

  const updateSettings = useCallback((newSettings) => {
    collector.updateSettings(newSettings);
    setSettings(collector.settings);
    setIsTracking(collector.isTracking);
  }, [collector]);

  const startTracking = useCallback(async () => {
    try {
      await collector.startLocationTracking();
      setIsTracking(collector.isTracking);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [collector]);

  const stopTracking = useCallback(() => {
    collector.stopLocationTracking();
    setIsTracking(collector.isTracking);
  }, [collector]);

  const getCurrentLocation = useCallback(async () => {
    try {
      const location = await collector.getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [collector]);

  const exportData = useCallback((format = 'json') => {
    return collector.exportData(format);
  }, [collector]);

  const importData = useCallback((data) => {
    const success = collector.importData(data);
    if (success) {
      setSettings(collector.settings);
      setCurrentLocation(collector.currentLocation);
    }
    return success;
  }, [collector]);

  const clearAllData = useCallback(() => {
    collector.clearAllData();
    setSettings(collector.settings);
    setCurrentLocation(null);
    setIsTracking(false);
  }, [collector]);

  const getDataSummary = useCallback(() => {
    return collector.getDataSummary();
  }, [collector]);

  const getPrivacyCompliance = useCallback(() => {
    return collector.getPrivacyCompliance();
  }, [collector]);

  return {
    settings,
    currentLocation,
    isTracking,
    isLoading,
    error,
    updateSettings,
    startTracking,
    stopTracking,
    getCurrentLocation,
    exportData,
    importData,
    clearAllData,
    getDataSummary,
    getPrivacyCompliance,
    collector
  };
};

// ==============================
// EXPORTS
// ==============================

export {
  LocationDataCollector,
  LOCATION_ACCURACY_LEVELS,
  LOCATION_DATA_TYPES,
  COLLECTION_METHODS,
  PRIVACY_LEVELS,
  DEFAULT_LOCATION_SETTINGS
};

export default LocationDataCollector;
