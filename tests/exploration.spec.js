import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';

const { config } = require('../utils/config.js');

/**
 * Exploration Test - Discover tab names and structure
 * This test explores the banking app to find tabs and their selectors
 */
test.only('EXPLORATION: Discover Tab Names and Selectors', async ({ page }) => {
  console.log('\n🔍 Starting exploration of tab names...\n');

  // Set page timeouts
  page.setDefaultTimeout(config.getPageTimeout());
  page.setDefaultNavigationTimeout(config.getNavigationTimeout());

  // Initialize page objects
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // Get configuration data
  const loginCredentials = config.getLoginCredentials();

  // Navigate and login
  console.log('📝 Step 1: Navigating to login page...');
  await loginPage.navigateTo(config.getUrl());
  console.log('✓ Navigated to login page');

  console.log('📝 Step 2: Logging in...');
  await loginPage.login(
    loginCredentials.username,
    loginCredentials.password,
    loginCredentials.appName
  );
  console.log('✓ Login successful');

  // Wait for home page to load
  console.log('📝 Step 3: Waiting for home page...');
  await homePage.waitForHomePageLoad();
  console.log('✓ Home page loaded');

  // LIVE EXPLORATION: Discover all tabs
  console.log('\n🔎 DISCOVERING TAB STRUCTURE:\n');

  // Method 1: Get all button elements (tabs are likely buttons based on snapshot)
  console.log('\n📌 Method 1: Looking for button elements (likely tabs)...');
  try {
    const buttons = await page.locator('button').all();
    console.log(`✓ Found ${buttons.length} total button elements`);
    
    for (let i = 0; i < buttons.length; i++) {
      const btnText = await buttons[i].textContent();
      const isVisible = await buttons[i].isVisible();
      if (btnText && btnText.trim().length > 0 && btnText.trim().length < 50 && isVisible) {
        console.log(`  Button ${i + 1}: "${btnText.trim()}"`);
      }
    }
  } catch (e) {
    console.log('ℹ️ Error exploring buttons:', e.message);
  }

  // Take screenshot for visual inspection
  console.log('\n📸 Taking screenshot for visual inspection...');
  await page.screenshot({ path: 'exploration-screenshot.png', fullPage: true });
  console.log('✓ Screenshot saved as exploration-screenshot.png');

  // Get page structure details
  console.log('\n📊 PAGE STRUCTURE DETAILS:');
  console.log(`  URL: ${page.url()}`);
  console.log(`  Title: ${await page.title()}`);

  // List all clickable elements
  console.log('\n🔗 CLICKABLE ELEMENTS (first 15):');
  try {
    const clickables = await page.locator('a, button, [role="button"], [onclick]').all();
    const uniqueClickables = new Set();
    
    for (let i = 0; i < Math.min(clickables.length, 15); i++) {
      const text = await clickables[i].textContent();
      const tag = await clickables[i].evaluate(el => el.tagName);
      if (text && text.trim()) {
        uniqueClickables.add(`${tag}: "${text.trim()}"`);
      }
    }
    
    Array.from(uniqueClickables).forEach(item => console.log(`  • ${item}`));
  } catch (e) {
    console.log('ℹ️ Error exploring clickables:', e.message);
  }

  console.log('\n✅ Exploration complete. Use the information above to create the test.\n');
});
