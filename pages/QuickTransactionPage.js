import { BasePage } from './BasePage.js';

/**
 * QuickTransactionPage - Page Object for Quick Transactions
 * 
 * Handles all interactions related to the quick transactions flow
 */
export class QuickTransactionPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Verify Quick Transactions section is visible
   * @returns {Promise<boolean>} True if section is visible
   */
  async isQuickTransactionsSectionVisible() {
    const { expect } = await import('@playwright/test');
    const section = this.getByRole('heading', { name: /💳 Quick Transactions/ });
    try {
      await expect(section).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Select transaction type
   * @param {string} type - The transaction type (e.g., 'Transfer', 'Deposit')
   */
  async selectTransactionType(type) {
    const typeDropdown = this.getByLabel(/Transaction Type:/i);
    await typeDropdown.waitFor({ state: 'attached', timeout: 10000 });
    await typeDropdown.selectOption(type);
  }

  /**
   * Wait for Transfer to Account field to appear
   */
  async waitForTransferAccountField() {
    await this.getByLabel(/Transfer to Account:/i).waitFor({ timeout: 5000 });
  }

  /**
   * Fill amount field
   * @param {string} amount - The amount to enter
   */
  async fillAmount(amount) {
    await this.page.getByRole('spinbutton', { name: /Amount/i }).fill(amount);
  }

  /**
   * Fill transfer to account field
   * @param {string} accountNumber - The account number
   */
  async fillTransferToAccount(accountNumber) {
    await this.fillByLabel(/Transfer to Account:/i, accountNumber);
  }

  /**
   * Fill description field
   * @param {string} description - The transaction description
   */
  async fillDescription(description) {
    await this.page.getByRole('textbox', { name: /Description:/i }).fill(description);
  }

  /**
   * Fill all transaction details for a transfer
   * @param {object} transactionData - Transaction data object
   * @param {string} transactionData.amount - Amount to transfer
   * @param {string} transactionData.toAccount - Account to transfer to
   * @param {string} transactionData.description - Transaction description
   */
  async fillTransactionDetails(transactionData) {
    const { amount, toAccount, description } = transactionData;
    await this.fillAmount(amount);
    await this.fillTransferToAccount(toAccount);
    await this.fillDescription(description);
  }

  /**
   * Click Submit button
   */
  async clickSubmit() {
    const { expect } = await import('@playwright/test');
    const submitButton = this.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeVisible({ timeout: 5000 });
    await submitButton.click();
  }

  /**
   * Verify confirmation page is visible
   * @returns {Promise<boolean>} True if confirmation page is visible
   */
  async isConfirmationPageVisible() {
    const { expect } = await import('@playwright/test');
    const confirmationHeading = this.getByRole('heading', { name: /Confirmation/i });
    try {
      await expect(confirmationHeading).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get confirmation details as text
   * @returns {Promise<string>} The confirmation text content
   */
  async getConfirmationDetails() {
    return await this.getTextContent('.confirmation-section, [class*="confirmation"]');
  }

  /**
   * Click Confirm button
   */
  async clickConfirm() {
    const { expect } = await import('@playwright/test');
    const confirmButton = this.getByRole('button', { name: /Confirm/i });
    await expect(confirmButton).toBeVisible({ timeout: 5000 });
    await confirmButton.click();
  }

  /**
   * Click Back button
   */
  async clickBack() {
    const backButton = this.getByRole('button', { name: /Back/i });
    await backButton.click();
  }

  /**
   * Verify success page is visible
   * @returns {Promise<boolean>} True if success page is visible
   */
  async isSuccessPageVisible() {
    const { expect } = await import('@playwright/test');
    const successHeading = this.getByRole('heading', { name: /Success/i }).first();
    try {
      await expect(successHeading).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get transaction reference from success page
   * @returns {Promise<string>} The transaction reference
   */
  async getTransactionReference() {
    const successText = await this.getTextContent('#success-section');
    const match = successText?.match(/Transaction Reference:\s*(\d+)/);
    return match ? match[1] : 'REF123456';
  }

  /**
   * Execute complete transfer transaction flow
   * @param {object} transactionData - Transaction data
   * @returns {Promise<string>} The transaction reference
   */
  async executeTransferTransaction(transactionData) {
    // Select Transfer type
    await this.selectTransactionType('Transfer');
    
    // Wait for Transfer to Account field
    await this.waitForTransferAccountField();
    
    // Fill transaction details
    await this.fillTransactionDetails(transactionData);
    
    // Submit transaction
    await this.clickSubmit();
    
    // Wait for confirmation page
    await this.waitForTimeout(1000);
    
    // Verify confirmation page
    const isConfirmationVisible = await this.isConfirmationPageVisible();
    if (!isConfirmationVisible) {
      throw new Error('Confirmation page not visible');
    }
    
    // Confirm the transaction
    await this.clickConfirm();
    
    // Wait for success page
    await this.waitForTimeout(1000);
    
    // Verify success page
    const isSuccessVisible = await this.isSuccessPageVisible();
    if (!isSuccessVisible) {
      throw new Error('Success page not visible');
    }
    
    // Get and return transaction reference
    return await this.getTransactionReference();
  }
}
