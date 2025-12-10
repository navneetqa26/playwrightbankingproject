import { BasePage } from './BasePage.js';

/**
 * LoginPage - Page Object for login functionality
 * 
 * Handles all interactions related to the login page
 */
export class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  /**
   * Navigate to the login page
   * @param {string} url - The login page URL
   */
  async navigateTo(url) {
    await this.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Verify login page is loaded
   * @returns {Promise<boolean>} True if login page title is visible
   */
  async isLoginPageLoaded() {
    try {
      const { expect } = await import('@playwright/test');
      await expect(this.page).toHaveURL(/Testers-Talk-Practice-Site/, { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Enter username
   * @param {string} username - The username to enter
   */
  async enterUsername(username) {
    await this.fillTextByRole('Username', username, { timeout: 5000 });
  }

  /**
   * Enter password
   * @param {string} password - The password to enter
   */
  async enterPassword(password) {
    await this.fillTextByRole('Password', password, { timeout: 5000 });
  }

  /**
   * Select application from dropdown
   * @param {string} appName - The application name to select
   */
  async selectApplication(appName) {
    await this.selectOptionByLabel('App Name:', appName);
  }

  /**
   * Click the Login button
   */
  async clickLogin() {
    await this.clickButtonByRole('Login');
  }

  /**
   * Perform login with credentials
   * @param {string} username - The username
   * @param {string} password - The password
   * @param {string} appName - The application name
   */
  async login(username, password, appName) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.selectApplication(appName);
    await this.clickLogin();
  }

  /**
   * Verify page title contains expected text
   * @param {RegExp} titlePattern - The title pattern to verify
   */
  async verifyPageTitle(titlePattern) {
    const title = await this.getPageTitle();
    return titlePattern.test(title);
  }
}
