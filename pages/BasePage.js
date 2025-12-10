/**
 * BasePage - Common page actions and utilities
 * 
 * This class contains common methods shared across all pages
 * including waiting for elements, clicking, filling, etc.
 */
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   * @param {string} url - The URL to navigate to
   * @param {object} options - Navigation options (waitUntil, etc.)
   */
  async goto(url, options = {}) {
    await this.page.goto(url, options);
  }

  /**
   * Set default page timeout
   * @param {number} timeout - Timeout in milliseconds
   */
  setDefaultTimeout(timeout) {
    this.page.setDefaultTimeout(timeout);
  }

  /**
   * Set default navigation timeout
   * @param {number} timeout - Timeout in milliseconds
   */
  setDefaultNavigationTimeout(timeout) {
    this.page.setDefaultNavigationTimeout(timeout);
  }

  /**
   * Wait for a specific timeout
   * @param {number} ms - Milliseconds to wait
   */
  async waitForTimeout(ms) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Get the current page URL
   * @returns {string} The current URL
   */
  getPageUrl() {
    return this.page.url();
  }

  /**
   * Get page title
   * @returns {string} The page title
   */
  async getPageTitle() {
    return this.page.title();
  }

  /**
   * Fill text in a textbox by role
   * @param {string} name - The name/label of the field
   * @param {string} value - The value to fill
   * @param {object} options - Additional options
   */
  async fillTextByRole(name, value, options = {}) {
    const textbox = this.page.getByRole('textbox', { name });
    await textbox.waitFor({ state: 'visible', timeout: 15000 });
    await textbox.fill(value, { ...options, timeout: 15000 });
  }

  /**
   * Fill text in a field by label
   * @param {string|RegExp} label - The label of the field
   * @param {string} value - The value to fill
   * @param {object} options - Additional options
   */
  async fillByLabel(label, value, options = {}) {
    const field = this.page.getByLabel(label);
    await field.waitFor({ state: 'visible', timeout: 15000 });
    await field.fill(value, { ...options, timeout: 15000 });
  }

  /**
   * Select an option from a dropdown by label
   * @param {string|RegExp} label - The label of the dropdown
   * @param {string} value - The value to select
   * @param {object} options - Additional options
   */
  async selectOptionByLabel(label, value, options = {}) {
    const dropdown = this.page.getByLabel(label);
    await dropdown.selectOption(value, options);
  }

  /**
   * Click a button by role
   * @param {string} name - The name of the button
   * @param {object} options - Additional options
   */
  async clickButtonByRole(name, options = {}) {
    const button = this.page.getByRole('button', { name });
    await button.click(options);
  }

  /**
   * Click a link by role
   * @param {string|RegExp} name - The name of the link
   * @param {object} options - Additional options
   */
  async clickLinkByRole(name, options = {}) {
    await this.page.getByRole('link', { name }).click(options);
  }

  /**
   * Click an element by locator
   * @param {string} selector - The CSS/XPath selector
   * @param {object} options - Additional options
   */
  async clickBySelector(selector, options = {}) {
    await this.page.locator(selector).click(options);
  }

  /**
   * Get text content by element
   * @param {string} selector - The selector
   * @returns {Promise<string>} The text content
   */
  async getTextContent(selector) {
    return await this.page.locator(selector).textContent();
  }

  /**
   * Wait for element to be visible
   * @param {string|RegExp} selector - The selector or text pattern
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector) {
    await this.page.locator(selector).waitFor({ state: 'visible' });
  }

  /**
   * Check if element is visible
   * @param {string|RegExp} selector - The selector
   * @returns {Promise<boolean>} True if visible
   */
  async isElementVisible(selector) {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible' });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get role-based locator
   * @param {string} role - The role (button, link, heading, etc.)
   * @param {object} options - Options for the role
   * @returns {Locator} The locator
   */
  getByRole(role, options = {}) {
    return this.page.getByRole(role, options);
  }

  /**
   * Get locator by text pattern
   * @param {string|RegExp} text - The text pattern
   * @returns {Locator} The locator
   */
  getByText(text) {
    return this.page.getByText(text);
  }

  /**
   * Get locator by label
   * @param {string|RegExp} label - The label
   * @returns {Locator} The locator
   */
  getByLabel(label) {
    return this.page.getByLabel(label);
  }

  /**
   * Get generic locator
   * @param {string} selector - The selector
   * @returns {Locator} The locator
   */
  locator(selector) {
    return this.page.locator(selector);
  }
}
