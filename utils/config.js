const fs = require('fs');
const path = require('path');

/**
 * Configuration Manager
 * Loads and manages configuration from config.json
 */
class ConfigManager {
  constructor() {
    try {
      // Read config.json from root directory
      const configPath = path.resolve(__dirname, '../config.json');
      
      const configData = fs.readFileSync(configPath, 'utf8');
      this.config = JSON.parse(configData);
    } catch (error) {
      console.error('Error loading config.json:', error.message);
      throw new Error('Failed to load configuration file: ' + error.message);
    }
  }

  /**
   * Get login URL
   * @returns {string} The login URL
   */
  getUrl() {
    return this.config.url;
  }

  /**
   * Get username
   * @returns {string} The username
   */
  getUsername() {
    return this.config.username;
  }

  /**
   * Get password
   * @returns {string} The password
   */
  getPassword() {
    return this.config.password;
  }

  /**
   * Get application name
   * @returns {string} The application name
   */
  getAppName() {
    return this.config.appName;
  }

  /**
   * Get banking URL
   * @returns {string} The banking URL
   */
  getBankingUrl() {
    return this.config.bankingUrl;
  }

  /**
   * Get page timeout
   * @returns {number} Page timeout in milliseconds
   */
  getPageTimeout() {
    return this.config.timeout.page;
  }

  /**
   * Get navigation timeout
   * @returns {number} Navigation timeout in milliseconds
   */
  getNavigationTimeout() {
    return this.config.timeout.navigation;
  }

  /**
   * Get element timeout
   * @returns {number} Element timeout in milliseconds
   */
  getElementTimeout() {
    return this.config.timeout.element;
  }

  /**
   * Get action timeout
   * @returns {number} Action timeout in milliseconds
   */
  getActionTimeout() {
    return this.config.timeout.action;
  }

  /**
   * Get login credentials object
   * @returns {object} Login credentials
   */
  getLoginCredentials() {
    return {
      username: this.config.username,
      password: this.config.password,
      appName: this.config.appName,
    };
  }

  /**
   * Get transaction data
   * @returns {object} Transaction data
   */
  getTransactionData() {
    return {
      amount: this.config.transaction.amount,
      toAccount: this.config.transaction.toAccount,
      description: this.config.transaction.description,
      type: this.config.transaction.type,
    };
  }

  /**
   * Get all timeouts
   * @returns {object} All timeout values
   */
  getAllTimeouts() {
    return this.config.timeout;
  }

  /**
   * Get entire configuration
   * @returns {object} Full configuration object
   */
  getConfig() {
    return this.config;
  }
}

// Export singleton instance
module.exports = {
  config: new ConfigManager(),
};
