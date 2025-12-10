const fs = require('fs');
const path = require('path');

/**
 * Test Data Manager
 * Loads and manages test data from JSON files
 */
class TestDataManager {
  constructor() {
    try {
      // Read Transfer_TestData.json from test-data directory
      const testDataPath = path.resolve(__dirname, '../test-data/Transfer_TestData.json');
      
      const testDataContent = fs.readFileSync(testDataPath, 'utf8');
      this.testData = JSON.parse(testDataContent);
    } catch (error) {
      console.error('Error loading test data:', error.message);
      throw new Error('Failed to load test data file: ' + error.message);
    }
  }

  /**
   * Get transfer transaction test data
   * @returns {object} Transfer transaction data
   */
  getTransferTransactionData() {
    return this.testData.transferTransaction;
  }

  /**
   * Get large transfer test data
   * @returns {object} Large transfer data
   */
  getLargeTransferData() {
    return this.testData.largeTransfer;
  }

  /**
   * Get small transfer test data
   * @returns {object} Small transfer data
   */
  getSmallTransferData() {
    return this.testData.smallTransfer;
  }

  /**
   * Get transfer data by name
   * @param {string} dataName - The name of the transfer data set
   * @returns {object} Transfer data
   */
  getTransferDataByName(dataName) {
    if (!this.testData[dataName]) {
      throw new Error(`Transfer data set '${dataName}' not found in Transfer_TestData.json`);
    }
    return this.testData[dataName];
  }

  /**
   * Get all transfer test data
   * @returns {object} All transfer data
   */
  getAllTransferData() {
    return this.testData;
  }

  /**
   * Get specific field from transfer data
   * @param {string} dataName - The name of the transfer data set
   * @param {string} field - The field to retrieve
   * @returns {any} Field value
   */
  getTransferDataField(dataName, field) {
    const data = this.getTransferDataByName(dataName);
    if (!data[field]) {
      throw new Error(`Field '${field}' not found in transfer data set '${dataName}'`);
    }
    return data[field];
  }
}

// Export singleton instance
module.exports = {
  testData: new TestDataManager(),
};
