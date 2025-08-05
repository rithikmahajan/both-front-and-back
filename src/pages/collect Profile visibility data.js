/**
 * Profile Visibility Data Collection Module
 * 
 * This module handles all profile visibility data collection functionality
 * including data gathering, privacy controls, analytics, and user consent management.
 * 
 * Features:
 * - User profile data collection
 * - Privacy preference management
 * - Data analytics and insights
 * - Consent management
 * - Data export/import functionality
 * - Real-time visibility tracking
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ==============================
// CONSTANTS
// ==============================

const VISIBILITY_LEVELS = {
  PUBLIC: 'public',
  FRIENDS: 'friends',
  PRIVATE: 'private',
  CUSTOM: 'custom'
};

const DATA_COLLECTION_TYPES = {
  BASIC_INFO: 'basicInfo',
  ACTIVITY_DATA: 'activityData',
  INTERACTION_DATA: 'interactionData',
  PREFERENCE_DATA: 'preferenceData',
  LOCATION_DATA: 'locationData',
  DEVICE_DATA: 'deviceData'
};

const CONSENT_STATUS = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PENDING: 'pending',
  REVOKED: 'revoked'
};

const DEFAULT_PROFILE_VISIBILITY_SETTINGS = {
  collectBasicInfo: true,
  collectActivityData: false,
  collectInteractionData: true,
  collectPreferenceData: true,
  collectLocationData: false,
  collectDeviceData: false,
  visibilityLevel: VISIBILITY_LEVELS.FRIENDS,
  dataRetentionPeriod: 365, // days
  anonymizeData: false,
  shareWithThirdParties: false,
  enableAnalytics: true,
  consentTimestamp: null,
  lastUpdated: null
};

// ==============================
// PROFILE VISIBILITY DATA COLLECTION CLASS
// ==============================

class ProfileVisibilityDataCollector {
  constructor() {
    this.settings = { ...DEFAULT_PROFILE_VISIBILITY_SETTINGS };
    this.collectedData = {};
    this.consentRecords = [];
    this.analyticsData = {};
  }

  /**
   * Initialize the profile visibility data collection
   */
  async initialize() {
    try {
      await this.loadSettings();
      await this.loadCollectedData();
      this.setupEventListeners();
      console.log('Profile Visibility Data Collector initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Profile Visibility Data Collector:', error);
    }
  }

  /**
   * Load settings from storage
   */
  async loadSettings() {
    try {
      const savedSettings = localStorage.getItem('profileVisibilitySettings');
      if (savedSettings) {
        this.settings = { ...DEFAULT_PROFILE_VISIBILITY_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Error loading profile visibility settings:', error);
    }
  }

  /**
   * Save settings to storage
   */
  async saveSettings() {
    try {
      this.settings.lastUpdated = new Date().toISOString();
      localStorage.setItem('profileVisibilitySettings', JSON.stringify(this.settings));
    } catch (error) {
      console.error('Error saving profile visibility settings:', error);
    }
  }

  /**
   * Load collected data from storage
   */
  async loadCollectedData() {
    try {
      const savedData = localStorage.getItem('profileVisibilityData');
      if (savedData) {
        this.collectedData = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading collected profile visibility data:', error);
    }
  }

  /**
   * Save collected data to storage
   */
  async saveCollectedData() {
    try {
      localStorage.setItem('profileVisibilityData', JSON.stringify(this.collectedData));
    } catch (error) {
      console.error('Error saving collected profile visibility data:', error);
    }
  }

  /**
   * Update profile visibility settings
   */
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
    this.recordConsentChange(newSettings);
  }

  /**
   * Record consent change
   */
  recordConsentChange(settings) {
    const consentRecord = {
      timestamp: new Date().toISOString(),
      settings: { ...settings },
      ipAddress: this.getUserIPAddress(),
      userAgent: navigator.userAgent
    };
    
    this.consentRecords.push(consentRecord);
    this.saveConsentRecords();
  }

  /**
   * Save consent records
   */
  saveConsentRecords() {
    try {
      localStorage.setItem('profileVisibilityConsent', JSON.stringify(this.consentRecords));
    } catch (error) {
      console.error('Error saving consent records:', error);
    }
  }

  /**
   * Collect basic profile information
   */
  collectBasicInfo(userInfo) {
    if (!this.settings.collectBasicInfo) return;

    const basicInfo = {
      userId: userInfo.id,
      username: userInfo.username,
      email: this.settings.anonymizeData ? this.anonymizeEmail(userInfo.email) : userInfo.email,
      profilePicture: userInfo.profilePicture,
      joinDate: userInfo.joinDate,
      lastLogin: new Date().toISOString(),
      collectedAt: new Date().toISOString()
    };

    this.collectedData.basicInfo = basicInfo;
    this.saveCollectedData();
  }

  /**
   * Collect activity data
   */
  collectActivityData(activityInfo) {
    if (!this.settings.collectActivityData) return;

    const activityData = {
      pageViews: activityInfo.pageViews || [],
      timeSpent: activityInfo.timeSpent || {},
      featuresUsed: activityInfo.featuresUsed || [],
      searchQueries: this.settings.anonymizeData ? 
        this.anonymizeSearchQueries(activityInfo.searchQueries) : 
        activityInfo.searchQueries || [],
      clickEvents: activityInfo.clickEvents || [],
      collectedAt: new Date().toISOString()
    };

    if (!this.collectedData.activityData) {
      this.collectedData.activityData = [];
    }
    this.collectedData.activityData.push(activityData);
    this.saveCollectedData();
  }

  /**
   * Collect interaction data
   */
  collectInteractionData(interactionInfo) {
    if (!this.settings.collectInteractionData) return;

    const interactionData = {
      likes: interactionInfo.likes || [],
      comments: interactionInfo.comments || [],
      shares: interactionInfo.shares || [],
      follows: interactionInfo.follows || [],
      messages: this.settings.anonymizeData ? 
        this.anonymizeMessages(interactionInfo.messages) : 
        interactionInfo.messages || [],
      collectedAt: new Date().toISOString()
    };

    if (!this.collectedData.interactionData) {
      this.collectedData.interactionData = [];
    }
    this.collectedData.interactionData.push(interactionData);
    this.saveCollectedData();
  }

  /**
   * Collect preference data
   */
  collectPreferenceData(preferenceInfo) {
    if (!this.settings.collectPreferenceData) return;

    const preferenceData = {
      theme: preferenceInfo.theme,
      language: preferenceInfo.language,
      notifications: preferenceInfo.notifications,
      privacy: preferenceInfo.privacy,
      accessibility: preferenceInfo.accessibility,
      contentPreferences: preferenceInfo.contentPreferences || [],
      collectedAt: new Date().toISOString()
    };

    this.collectedData.preferenceData = preferenceData;
    this.saveCollectedData();
  }

  /**
   * Collect location data
   */
  collectLocationData(locationInfo) {
    if (!this.settings.collectLocationData) return;

    const locationData = {
      country: locationInfo.country,
      region: locationInfo.region,
      city: this.settings.anonymizeData ? null : locationInfo.city,
      timezone: locationInfo.timezone,
      coordinates: this.settings.anonymizeData ? null : locationInfo.coordinates,
      collectedAt: new Date().toISOString()
    };

    if (!this.collectedData.locationData) {
      this.collectedData.locationData = [];
    }
    this.collectedData.locationData.push(locationData);
    this.saveCollectedData();
  }

  /**
   * Collect device data
   */
  collectDeviceData() {
    if (!this.settings.collectDeviceData) return;

    const deviceData = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      collectedAt: new Date().toISOString()
    };

    this.collectedData.deviceData = deviceData;
    this.saveCollectedData();
  }

  /**
   * Get analytics data
   */
  getAnalyticsData() {
    if (!this.settings.enableAnalytics) return null;

    return {
      totalDataPoints: this.getTotalDataPoints(),
      collectionFrequency: this.getCollectionFrequency(),
      dataTypes: this.getCollectedDataTypes(),
      privacyScore: this.calculatePrivacyScore(),
      lastActivity: this.getLastActivityDate(),
      retentionStatus: this.getRetentionStatus()
    };
  }

  /**
   * Export collected data
   */
  exportData(format = 'json') {
    const exportData = {
      settings: this.settings,
      collectedData: this.collectedData,
      consentRecords: this.consentRecords,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      case 'csv':
        return this.convertToCSV(exportData);
      default:
        return exportData;
    }
  }

  /**
   * Import data
   */
  importData(data) {
    try {
      const importedData = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (importedData.settings) {
        this.settings = { ...DEFAULT_PROFILE_VISIBILITY_SETTINGS, ...importedData.settings };
        this.saveSettings();
      }
      
      if (importedData.collectedData) {
        this.collectedData = importedData.collectedData;
        this.saveCollectedData();
      }
      
      if (importedData.consentRecords) {
        this.consentRecords = importedData.consentRecords;
        this.saveConsentRecords();
      }
      
      return true;
    } catch (error) {
      console.error('Error importing profile visibility data:', error);
      return false;
    }
  }

  /**
   * Clear all collected data
   */
  clearAllData() {
    this.collectedData = {};
    this.consentRecords = [];
    this.saveCollectedData();
    this.saveConsentRecords();
    localStorage.removeItem('profileVisibilityData');
    localStorage.removeItem('profileVisibilityConsent');
  }

  /**
   * Get data summary
   */
  getDataSummary() {
    return {
      totalDataPoints: this.getTotalDataPoints(),
      dataTypes: this.getCollectedDataTypes(),
      lastUpdated: this.settings.lastUpdated,
      consentStatus: this.getConsentStatus(),
      retentionPeriod: this.settings.dataRetentionPeriod,
      anonymized: this.settings.anonymizeData
    };
  }

  // ==============================
  // UTILITY METHODS
  // ==============================

  getTotalDataPoints() {
    let count = 0;
    Object.values(this.collectedData).forEach(data => {
      if (Array.isArray(data)) {
        count += data.length;
      } else if (typeof data === 'object' && data !== null) {
        count += 1;
      }
    });
    return count;
  }

  getCollectedDataTypes() {
    return Object.keys(this.collectedData);
  }

  getConsentStatus() {
    if (this.consentRecords.length === 0) return CONSENT_STATUS.PENDING;
    const lastRecord = this.consentRecords[this.consentRecords.length - 1];
    return lastRecord.settings.collectBasicInfo ? CONSENT_STATUS.GRANTED : CONSENT_STATUS.DENIED;
  }

  getLastActivityDate() {
    const dates = [];
    Object.values(this.collectedData).forEach(data => {
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.collectedAt) dates.push(new Date(item.collectedAt));
        });
      } else if (data && data.collectedAt) {
        dates.push(new Date(data.collectedAt));
      }
    });
    return dates.length > 0 ? new Date(Math.max(...dates)) : null;
  }

  calculatePrivacyScore() {
    let score = 100;
    if (this.settings.collectActivityData) score -= 15;
    if (this.settings.collectLocationData) score -= 20;
    if (this.settings.collectDeviceData) score -= 10;
    if (this.settings.shareWithThirdParties) score -= 25;
    if (!this.settings.anonymizeData) score -= 15;
    return Math.max(0, score);
  }

  getRetentionStatus() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.settings.dataRetentionPeriod);
    
    const expiredData = [];
    Object.entries(this.collectedData).forEach(([type, data]) => {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          if (item.collectedAt && new Date(item.collectedAt) < cutoffDate) {
            expiredData.push({ type, index, date: item.collectedAt });
          }
        });
      } else if (data && data.collectedAt && new Date(data.collectedAt) < cutoffDate) {
        expiredData.push({ type, date: data.collectedAt });
      }
    });
    
    return {
      hasExpiredData: expiredData.length > 0,
      expiredItems: expiredData,
      retentionPeriod: this.settings.dataRetentionPeriod
    };
  }

  anonymizeEmail(email) {
    if (!email) return '';
    const [username, domain] = email.split('@');
    const anonymizedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${anonymizedUsername}@${domain}`;
  }

  anonymizeSearchQueries(queries) {
    if (!Array.isArray(queries)) return [];
    return queries.map(query => {
      if (typeof query === 'string') {
        return query.replace(/\b\w{3,}\b/g, word => word.charAt(0) + '*'.repeat(word.length - 1));
      }
      return query;
    });
  }

  anonymizeMessages(messages) {
    if (!Array.isArray(messages)) return [];
    return messages.map(message => ({
      ...message,
      content: message.content ? '[ANONYMIZED]' : '',
      timestamp: message.timestamp
    }));
  }

  getUserIPAddress() {
    // This would typically be obtained from a server-side API
    return 'xxx.xxx.xxx.xxx';
  }

  getCollectionFrequency() {
    const dates = [];
    Object.values(this.collectedData).forEach(data => {
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.collectedAt) dates.push(new Date(item.collectedAt));
        });
      }
    });
    
    if (dates.length < 2) return 'insufficient_data';
    
    dates.sort((a, b) => a - b);
    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      intervals.push(dates[i] - dates[i - 1]);
    }
    
    const avgInterval = intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
    const avgDays = avgInterval / (1000 * 60 * 60 * 24);
    
    if (avgDays < 1) return 'multiple_per_day';
    if (avgDays < 7) return 'daily';
    if (avgDays < 30) return 'weekly';
    return 'monthly';
  }

  convertToCSV(data) {
    // Basic CSV conversion - would need more sophisticated implementation for complex nested data
    const headers = Object.keys(data);
    const values = Object.values(data).map(value => 
      typeof value === 'object' ? JSON.stringify(value) : value
    );
    return [headers.join(','), values.join(',')].join('\n');
  }

  setupEventListeners() {
    // Setup event listeners for automatic data collection
    if (this.settings.collectActivityData) {
      window.addEventListener('beforeunload', () => {
        this.collectActivityData({
          timeSpent: { [window.location.pathname]: Date.now() - this.pageLoadTime },
          pageViews: [window.location.pathname]
        });
      });
      
      this.pageLoadTime = Date.now();
    }
  }

  /**
   * Check if data collection is enabled for a specific type
   */
  isCollectionEnabled(dataType) {
    switch (dataType) {
      case DATA_COLLECTION_TYPES.BASIC_INFO:
        return this.settings.collectBasicInfo;
      case DATA_COLLECTION_TYPES.ACTIVITY_DATA:
        return this.settings.collectActivityData;
      case DATA_COLLECTION_TYPES.INTERACTION_DATA:
        return this.settings.collectInteractionData;
      case DATA_COLLECTION_TYPES.PREFERENCE_DATA:
        return this.settings.collectPreferenceData;
      case DATA_COLLECTION_TYPES.LOCATION_DATA:
        return this.settings.collectLocationData;
      case DATA_COLLECTION_TYPES.DEVICE_DATA:
        return this.settings.collectDeviceData;
      default:
        return false;
    }
  }

  /**
   * Get privacy compliance status
   */
  getPrivacyCompliance() {
    return {
      hasConsent: this.consentRecords.length > 0,
      dataMinimization: this.calculateDataMinimizationScore(),
      transparency: this.getTransparencyScore(),
      userControl: this.getUserControlScore(),
      dataRetention: this.settings.dataRetentionPeriod <= 365,
      anonymization: this.settings.anonymizeData
    };
  }

  calculateDataMinimizationScore() {
    const enabledTypes = Object.values(DATA_COLLECTION_TYPES).filter(type => 
      this.isCollectionEnabled(type)
    );
    return Math.max(0, 100 - (enabledTypes.length * 15));
  }

  getTransparencyScore() {
    // Score based on how transparent the data collection is
    let score = 0;
    if (this.settings.consentTimestamp) score += 25;
    if (this.consentRecords.length > 0) score += 25;
    if (!this.settings.shareWithThirdParties) score += 25;
    if (this.settings.enableAnalytics) score += 25;
    return score;
  }

  getUserControlScore() {
    // Score based on user control over their data
    let score = 0;
    if (this.settings.dataRetentionPeriod <= 365) score += 20;
    if (this.settings.anonymizeData) score += 20;
    if (!this.settings.shareWithThirdParties) score += 20;
    if (this.settings.visibilityLevel !== VISIBILITY_LEVELS.PUBLIC) score += 20;
    score += 20; // Base score for having control options
    return score;
  }
}

// ==============================
// REACT HOOK FOR PROFILE VISIBILITY
// ==============================

export const useProfileVisibilityData = () => {
  const [collector] = useState(() => new ProfileVisibilityDataCollector());
  const [settings, setSettings] = useState(DEFAULT_PROFILE_VISIBILITY_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeCollector = async () => {
      try {
        setIsLoading(true);
        await collector.initialize();
        setSettings(collector.settings);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeCollector();
  }, [collector]);

  const updateSettings = useCallback((newSettings) => {
    collector.updateSettings(newSettings);
    setSettings(collector.settings);
  }, [collector]);

  const collectData = useCallback((dataType, data) => {
    switch (dataType) {
      case DATA_COLLECTION_TYPES.BASIC_INFO:
        collector.collectBasicInfo(data);
        break;
      case DATA_COLLECTION_TYPES.ACTIVITY_DATA:
        collector.collectActivityData(data);
        break;
      case DATA_COLLECTION_TYPES.INTERACTION_DATA:
        collector.collectInteractionData(data);
        break;
      case DATA_COLLECTION_TYPES.PREFERENCE_DATA:
        collector.collectPreferenceData(data);
        break;
      case DATA_COLLECTION_TYPES.LOCATION_DATA:
        collector.collectLocationData(data);
        break;
      case DATA_COLLECTION_TYPES.DEVICE_DATA:
        collector.collectDeviceData();
        break;
      default:
        console.warn('Unknown data collection type:', dataType);
    }
  }, [collector]);

  const exportData = useCallback((format = 'json') => {
    return collector.exportData(format);
  }, [collector]);

  const importData = useCallback((data) => {
    return collector.importData(data);
  }, [collector]);

  const clearAllData = useCallback(() => {
    collector.clearAllData();
    setSettings(collector.settings);
  }, [collector]);

  const getDataSummary = useCallback(() => {
    return collector.getDataSummary();
  }, [collector]);

  const getAnalyticsData = useCallback(() => {
    return collector.getAnalyticsData();
  }, [collector]);

  const getPrivacyCompliance = useCallback(() => {
    return collector.getPrivacyCompliance();
  }, [collector]);

  return {
    settings,
    updateSettings,
    collectData,
    exportData,
    importData,
    clearAllData,
    getDataSummary,
    getAnalyticsData,
    getPrivacyCompliance,
    isLoading,
    error,
    collector
  };
};

// ==============================
// EXPORTS
// ==============================

export {
  ProfileVisibilityDataCollector,
  VISIBILITY_LEVELS,
  DATA_COLLECTION_TYPES,
  CONSENT_STATUS,
  DEFAULT_PROFILE_VISIBILITY_SETTINGS
};

export default ProfileVisibilityDataCollector;
