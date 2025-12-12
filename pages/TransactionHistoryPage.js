import { BasePage } from './BasePage.js';

/**
 * TransactionHistoryPage - Page Object for Transaction History
 * 
 * Handles all interactions related to viewing transaction history
 */
export class TransactionHistoryPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Verify Transaction History section is visible
   * @returns {Promise<boolean>} True if section is visible
   */
  async isTransactionHistorySectionVisible() {
    const { expect } = await import('@playwright/test');
    const section = this.getByRole('heading', { name: /📊 Transaction History/i });
    try {
      await expect(section).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get all transaction history text
   * @returns {Promise<string>} The history section text content
   */
  async getHistoryText() {
    return await this.getTextContent('[class*="history"], #history-section');
  }

  /**
   * Verify transaction amount in history
   * @param {string} amount - The amount to verify
   * @returns {Promise<boolean>} True if amount is found
   */
  async isTransactionAmountVisible(amount) {
    const { expect } = await import('@playwright/test');
    const historyAmount = this.locator('#history-section').getByText(new RegExp(amount));
    try {
      await expect(historyAmount.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify transaction type in history
   * @param {string} type - The transaction type to verify
   * @returns {Promise<boolean>} True if type is found
   */
  async isTransactionTypeVisible(type) {
    const { expect } = await import('@playwright/test');
    const typeElement = this.locator('#history-section').getByText(new RegExp(type, 'i'));
    try {
      await expect(typeElement.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify transaction is in history
   * @param {object} transactionData - Transaction data to verify
   * @param {string} transactionData.amount - Amount
   * @param {string} transactionData.type - Transaction type
   * @returns {Promise<boolean>} True if transaction is visible
   */
  async isTransactionVisible(transactionData) {
    const { amount, type } = transactionData;
    const amountVisible = await this.isTransactionAmountVisible(amount);
    const typeVisible = await this.isTransactionTypeVisible(type);
    return amountVisible && typeVisible;
  }

  /**
   * Get transaction rows count
   * @returns {Promise<number>} Count of transaction rows
   */
  async getTransactionRowsCount() {
    const rows = this.locator('#history-section').locator('div').filter({ has: this.page.getByText(/Transfer|Initial Balance|Deposit/) });
    return await rows.count();
  }

  /**
   * Verify at least one transaction exists
   * @returns {Promise<boolean>} True if transactions exist
   */
  async hasTransactions() {
    const { expect } = await import('@playwright/test');
    try {
      // Transactions are displayed as divs within the history section
      const transactionItems = this.locator('#history-section').locator('div').filter({ has: this.page.getByText(/Transfer|Initial Balance|Deposit/) });
      await expect(transactionItems.first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verify complete transaction history flow
   * @param {object} transactionData - Transaction data to verify
   * @returns {Promise<boolean>} True if all verifications pass
   */
  async verifyTransactionHistory(transactionData) {
    // Retry checks for a short period to allow the history to update
    const maxAttempts = 8;
    const delayMs = 1000;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      // Verify history section is visible
      const isSectionVisible = await this.isTransactionHistorySectionVisible();
      if (!isSectionVisible) {
        if (attempt === maxAttempts) throw new Error('Transaction History section not visible');
        await this.waitForTimeout(delayMs);
        continue;
      }

      // Verify transactions exist
      const hasTransactions = await this.hasTransactions();
      if (!hasTransactions) {
        if (attempt === maxAttempts) throw new Error('No transactions found in history');
        await this.waitForTimeout(delayMs);
        continue;
      }

      // Verify the specific transaction is visible
      const isTransactionVisible = await this.isTransactionVisible(transactionData);
      if (isTransactionVisible) return true;

      if (attempt === maxAttempts) {
        throw new Error(`Transaction with amount ${transactionData.amount} not found in history`);
      }

      await this.waitForTimeout(delayMs);
    }
    return false;
  }

  /**
   * Get recent transaction details
   * @returns {Promise<object>} Recent transaction details
   */
  async getRecentTransactionDetails() {
    const { expect } = await import('@playwright/test');
    const transactionItems = this.locator('#history-section').locator('div').filter({ has: this.page.getByText(/Transfer|Initial Balance|Deposit/) });
    try {
      await expect(transactionItems.first()).toBeVisible({ timeout: 5000 });
      const text = await transactionItems.first().textContent();
      return { text, visible: true };
    } catch {
      return { text: null, visible: false };
    }
  }
}
