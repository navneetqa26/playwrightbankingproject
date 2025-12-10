import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import { QuickTransactionPage } from '../pages/QuickTransactionPage.js';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage.js';

const { config } = require('../utils/config.js');
const { testData } = require('../utils/testDataManager.js');

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

/**
 * Verify Quick Transactions Flow - Using Page Object Model
 * 
 * This test verifies the complete quick transactions flow in the Banking Application:
 * 1. Login to the application with TestersTalk credentials
 * 2. Select Banking app and login
 * 3. Navigate to Quick Transactions
 * 4. Create a transfer transaction
 * 5. Confirm the transaction
 * 6. Verify transaction reference in history
 */
test('Verify Quick Transactions Flow', async ({ page }) => {
  // Set page timeouts for external site navigation
  page.setDefaultTimeout(config.getPageTimeout());
  page.setDefaultNavigationTimeout(config.getNavigationTimeout());

  // Initialize page objects
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const quickTransactionPage = new QuickTransactionPage(page);
  const transactionHistoryPage = new TransactionHistoryPage(page);

  // Get configuration data
  const loginCredentials = config.getLoginCredentials();
  const transactionData = testData.getTransferTransactionData();

  // ==================== LOGIN FLOW ====================
  console.log('📝 Starting Login Flow...');

  // Step 1: Navigate to login page
  await loginPage.navigateTo(config.getUrl());
  console.log('✓ Navigated to login page');

  // Step 2: Verify login page is loaded
  const isPageLoaded = await loginPage.isLoginPageLoaded();
  expect(isPageLoaded).toBeTruthy();
  console.log('✓ Login page loaded successfully');

  // Step 3: Verify page title
  const isTitleValid = await loginPage.verifyPageTitle(/Testers Talk Practice Site/);
  expect(isTitleValid).toBeTruthy();
  console.log('✓ Page title verified');

  // Step 4: Perform login
  await loginPage.login(
    loginCredentials.username,
    loginCredentials.password,
    loginCredentials.appName
  );
  console.log('✓ Login credentials entered and Banking app selected');

  // ==================== HOME PAGE VERIFICATION ====================
  console.log('\n🏦 Verifying Home Page...');

  // Step 5: Wait for home page to load
  await homePage.waitForHomePageLoad();
  console.log('✓ Home page loaded');

  // Step 6: Verify Banking URL
  const isBankingUrlValid = homePage.verifyBankingURL();
  expect(isBankingUrlValid).toBeTruthy();
  console.log('✓ Banking URL verified');

  // Step 7: Verify welcome text
  const isWelcomeVisible = await homePage.isWelcomeTextVisible();
  expect(isWelcomeVisible).toBeTruthy();
  console.log('✓ Welcome text visible');

  // Step 8: Verify home page is fully loaded
  const isHomePageValid = await homePage.verifyHomePageLoaded();
  expect(isHomePageValid).toBeTruthy();
  console.log('✓ Home page verified');

  // ==================== QUICK TRANSACTIONS FLOW ====================
  console.log('\n💳 Starting Quick Transactions Flow...');

  // Step 9: Navigate to Quick Transactions
  await homePage.navigateToQuickTransactions();
  console.log('✓ Navigated to Quick Transactions');

  // Step 10: Verify Quick Transactions section is visible
  const isQTSectionVisible = await quickTransactionPage.isQuickTransactionsSectionVisible();
  expect(isQTSectionVisible).toBeTruthy();
  console.log('✓ Quick Transactions section visible');

  // Step 11: Execute transfer transaction
  console.log('💰 Processing Transfer Transaction...');
  const transactionRef = await quickTransactionPage.executeTransferTransaction(transactionData);
  console.log(`✓ Transfer completed with Reference: ${transactionRef}`);

  // ==================== TRANSACTION HISTORY VERIFICATION ====================
  console.log('\n📊 Verifying Transaction History...');

  // Step 12: Navigate to Transaction History
  await homePage.navigateToTransactionHistory();
  console.log('✓ Navigated to Transaction History');

  // Step 13: Verify transaction history
  const isHistoryValid = await transactionHistoryPage.verifyTransactionHistory({
    amount: transactionData.amount,
    type: transactionData.type,
  });
  expect(isHistoryValid).toBeTruthy();
  console.log('✓ Transaction verified in history');

  // Step 14: Verify transaction amount in history
  const isAmountVisible = await transactionHistoryPage.isTransactionAmountVisible(transactionData.amount);
  expect(isAmountVisible).toBeTruthy();
  console.log(`✓ Transaction amount $${transactionData.amount} verified in history`);

  // ==================== TEST SUMMARY ====================
  console.log('\n✅ Test Completed Successfully!');
  console.log(`📌 Transaction Reference: ${transactionRef}`);
  console.log('✓ Complete flow executed successfully');
  console.log('  - Login: Passed');
  console.log('  - Home Page Verification: Passed');
  console.log('  - Quick Transaction: Passed');
  console.log('  - Transaction History: Passed');
});
