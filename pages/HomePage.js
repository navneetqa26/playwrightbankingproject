import { BasePage } from './BasePage.js';

/**
 * HomePage - Page Object for Banking Application Home page
 * 
 * Handles all interactions related to the home page after login
 */
export class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Wait for Banking app to load
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForHomePageLoad() {
    const pageHeader = this.getByRole('heading', { name: /🏦 Sample Banking Application/ });
    await pageHeader.waitFor({ state: 'visible' });
  }

  /**
   * Verify page header is visible
   * @returns {Promise<boolean>} True if header is visible
   */
  async isPageHeaderVisible() {
    const pageHeader = this.getByRole('heading', { name: /🏦 Sample Banking Application/ });
    return await this.isElementVisible(pageHeader);
  }

  /**
   * Verify Banking URL is loaded
   */
  async verifyBankingURL() {
    const url = this.getPageUrl();
    return url.includes('Banking-Project-Demo.html');
  }

  /**
   * Verify welcome text is visible
   * @returns {Promise<boolean>} True if welcome text is visible
   */
  async isWelcomeTextVisible() {
    const welcomeText = this.getByText('Welcome to the Testers Talk Banking Application');
    try {
      await welcomeText.waitFor({ state: 'visible' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Navigate to Quick Transactions
   */
  async navigateToQuickTransactions() {
    await this.clickLinkByRole(/💳 Quick Transactions/);
  }

  /**
   * Navigate to Transaction History
   */
  async navigateToTransactionHistory() {
    await this.clickLinkByRole(/📊 Transaction History/);
  }

  /**
   * Navigate to Account Management
   */
  async navigateToAccountManagement() {
    await this.clickLinkByRole(/💰 Account Management/);
  }

  /**
   * Verify home page is fully loaded with all verifications
   */
  async verifyHomePageLoaded() {
    await this.waitForHomePageLoad();
    const urlValid = this.verifyBankingURL();
    const welcomeVisible = await this.isWelcomeTextVisible();
    return urlValid && welcomeVisible;
  }

  /**
   * Get page header text
   * @returns {Promise<string>} The header text
   */
  async getPageHeaderText() {
    return await this.getTextContent('heading');
  }

  /**
   * Click logout button
   */
  async logout() {
    await this.clickLinkByRole('Logout');
  }
}
