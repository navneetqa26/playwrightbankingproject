import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';

const { config } = require('../utils/config.js');

// Configure test to run only on chromium with increased timeout
test.use({ actionTimeout: 10000 });

/**
 * Verify Tab Names in Home Page
 * 
 * This test verifies that the home page displays the correct tabs:
 * 1. Login to the application with TestersTalk credentials
 * 2. Verify home page loads successfully
 * 3. Verify "Transfers" tab is visible
 * 4. Verify "Bill Payments" tab is visible
 * 5. Verify both tabs are clickable
 */
test('Verify Tab Names in Homepage', async ({ page }) => {
  console.log('🧪 Starting Tab Verification Test...');
  
  // Set page timeouts for external site navigation
  page.setDefaultTimeout(config.getPageTimeout());
  page.setDefaultNavigationTimeout(config.getNavigationTimeout());

  // Initialize page objects
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // Get configuration data
  const loginCredentials = config.getLoginCredentials();

  // ==================== LOGIN FLOW ====================
  console.log('📝 Step 1: Login Flow');
  
  // Navigate to login page
  await loginPage.navigateTo(config.getUrl());
  console.log('✓ Navigated to login page');

  // Perform login
  await loginPage.login(
    loginCredentials.username,
    loginCredentials.password,
    loginCredentials.appName
  );
  console.log('✓ Login successful');

  // ==================== HOME PAGE VERIFICATION ====================
  console.log('\n📝 Step 2: Home Page Verification');

  // Wait for home page to load
  await homePage.waitForHomePageLoad();
  console.log('✓ Home page loaded');

  // Verify home page is fully loaded
  const isHomePageValid = await homePage.verifyHomePageLoaded();
  expect(isHomePageValid).toBeTruthy();
  console.log('✓ Home page verified');

  // ==================== TAB VERIFICATION ====================
  console.log('\n📝 Step 3: Tab Names Verification');

  // Verify "Transfers" tab is visible
  console.log('\n🔍 Verifying "Transfers" tab...');
  const transfersTabLocator = page.getByRole('button', { name: 'Transfers' });
  await expect(transfersTabLocator).toBeVisible();
  console.log('✓ "Transfers" tab is visible');

  // Verify "Transfers" tab is enabled
  await expect(transfersTabLocator).toBeEnabled();
  console.log('✓ "Transfers" tab is enabled');

  // Get the text content of Transfers tab
  const transfersTabText = await transfersTabLocator.textContent();
  expect(transfersTabText?.trim()).toBe('Transfers');
  console.log(`✓ "Transfers" tab text confirmed: "${transfersTabText?.trim()}"`);

  // Verify "Bill Payments" tab is visible
  console.log('\n🔍 Verifying "Bill Payments" tab...');
  const billPaymentsTabLocator = page.getByRole('button', { name: 'Bill Payments' });
  await expect(billPaymentsTabLocator).toBeVisible();
  console.log('✓ "Bill Payments" tab is visible');

  // Verify "Bill Payments" tab is enabled
  await expect(billPaymentsTabLocator).toBeEnabled();
  console.log('✓ "Bill Payments" tab is enabled');

  // Get the text content of Bill Payments tab
  const billPaymentsTabText = await billPaymentsTabLocator.textContent();
  expect(billPaymentsTabText?.trim()).toBe('Bill Payments');
  console.log(`✓ "Bill Payments" tab text confirmed: "${billPaymentsTabText?.trim()}"`);

  // ==================== CLICK VERIFICATION ====================
  console.log('\n📝 Step 4: Tab Click Verification');

  // Verify Transfers tab is clickable
  console.log('\n🔍 Verifying Transfers tab is clickable...');
  await expect(transfersTabLocator).toHaveAttribute('onclick', /.*/);
  console.log('✓ "Transfers" tab has click handler');

  // Verify Bill Payments tab is clickable
  console.log('\n🔍 Verifying Bill Payments tab is clickable...');
  await expect(billPaymentsTabLocator).toHaveAttribute('onclick', /.*/);
  console.log('✓ "Bill Payments" tab has click handler');

  // ==================== TEST SUMMARY ====================
  console.log('\n✅ Tab Verification Test Completed Successfully!');
  console.log('📌 Verified Tabs:');
  console.log('  ✓ Transfers');
  console.log('  ✓ Bill Payments');
  console.log('✓ Both tabs are visible and enabled');
});
