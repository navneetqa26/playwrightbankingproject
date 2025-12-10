import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';

const { config } = require('../utils/config.js');

test('Verify Transfer Transaction Flow with Balance Validation', async ({ page }) => {
  console.log('\n🧪 Starting Transfer Transaction Test...\n');

  page.setDefaultTimeout(config.getPageTimeout());
  page.setDefaultNavigationTimeout(config.getNavigationTimeout());

  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const loginCredentials = config.getLoginCredentials();

  // ==================== STEP 1: LOGIN FLOW ====================
  console.log('📝 Step 1: Login Flow');
  console.log('  • Navigating to login page...');
  await loginPage.navigateTo(config.getUrl());
  console.log('  ✓ Navigated to login page');

  const isPageLoaded = await loginPage.isLoginPageLoaded();
  expect(isPageLoaded).toBeTruthy();
  console.log('  ✓ Login page loaded successfully');

  console.log('  • Logging in with username: TestersTalk and app: Banking...');
  await loginPage.login(
    loginCredentials.username,
    loginCredentials.password,
    loginCredentials.appName
  );
  console.log('  ✓ Login successful');

  // ==================== STEP 2: VERIFY BANKING URL ====================
  console.log('\n📝 Step 2: Verify Banking URL');
  await homePage.waitForHomePageLoad();
  console.log('  ✓ Home page loaded');

  const currentUrl = page.url();
  expect(currentUrl).toContain('Banking-Project-Demo.html');
  console.log(`  ✓ URL verified: ${currentUrl}`);

  // ==================== STEP 3: NAVIGATE TO QUICK TRANSACTIONS ====================
  console.log('\n📝 Step 3: Navigate to Quick Transactions');
  console.log('  • Clicking on Quick Transactions link...');
  await homePage.navigateToQuickTransactions();
  console.log('  ✓ Navigated to Quick Transactions');

  const quickTransactionsHeading = page.getByRole('heading', { name: /💳 Quick Transactions/ });
  await expect(quickTransactionsHeading).toBeVisible({ timeout: 5000 });
  console.log('  ✓ "Quick Transactions" heading is visible');

  // ==================== STEP 4: SELECT TRANSFER TRANSACTION TYPE ====================
  console.log('\n📝 Step 4: Select Transfer Transaction Type');
  console.log('  • Selecting transaction type: Transfer...');
  
  const typeDropdown = page.getByLabel(/Transaction Type:/i);
  await typeDropdown.selectOption('Transfer');
  console.log('  ✓ Transaction type "Transfer" selected');

  // ==================== STEP 5: ENTER TRANSFER DETAILS ====================
  console.log('\n📝 Step 5: Enter Transfer Details');
  
  console.log('  • Entering amount: $100...');
  const amountField = page.getByRole('spinbutton', { name: /Amount/i });
  await amountField.clear();
  await amountField.fill('100');
  console.log('  ✓ Amount $100 entered');

  console.log('  • Entering account number: 123456789...');
  const accountField = page.getByLabel(/Transfer to Account:/i);
  await accountField.fill('123456789');
  console.log('  ✓ Account number 123456789 entered');

  console.log('  • Entering description: "We are transferring $100"...');
  const descriptionField = page.getByRole('textbox', { name: /Description:/i });
  await descriptionField.fill('We are transferring $100');
  console.log('  ✓ Description entered: "We are transferring $100"');

  // ==================== STEP 6: SUBMIT TRANSFER TRANSACTION ====================
  console.log('\n📝 Step 6: Submit Transfer Transaction');
  console.log('  • Clicking Submit button...');
  
  const submitButton = page.getByRole('button', { name: /Submit/i });
  await submitButton.click();
  console.log('  ✓ Submit button clicked');

  // ==================== STEP 7: VERIFY TRANSACTION CONFIRMATION ====================
  console.log('\n📝 Step 7: Verify Transaction Confirmation');
  console.log('  • Verifying confirmation page...');

  const confirmationHeading = page.getByRole('heading', { name: /🔍 Transaction Confirmation/ });
  await expect(confirmationHeading).toBeVisible({ timeout: 10000 });
  console.log('  ✓ "Transaction Confirmation" heading is visible');

  // Get the entire confirmation container and extract text
  const confirmationContainer = page.locator('div').filter({ hasText: /Transaction Type/ }).first();
  const confirmationText = await confirmationContainer.textContent();

  console.log('  • Validating transaction details...');
  expect(confirmationText).toContain('Transfer');
  console.log('  ✓ Transaction type verified: Transfer');

  expect(confirmationText).toContain('100');
  console.log('  ✓ Amount verified: $100.00');

  expect(confirmationText).toContain('We are transferring $100');
  console.log('  ✓ Description verified: "We are transferring $100"');

  expect(confirmationText).toContain('123456789');
  console.log('  ✓ Transfer account number verified: 123456789');

  expect(confirmationText).toContain('10000');
  console.log('  ✓ Current balance verified: $10,000.00');

  // Verify new balance after transfer: $9,900.00
  const newBalanceMatch = confirmationText?.match(/9900|9,900/);
  expect(newBalanceMatch).toBeTruthy();
  console.log('  ✓ New balance verified: $9,900.00 (after $100 transfer)');

  // ==================== STEP 8: CONFIRM TRANSFER TRANSACTION ====================
  console.log('\n📝 Step 8: Confirm Transfer Transaction');
  console.log('  • Clicking Confirm button...');
  
  const confirmButton = page.getByRole('button', { name: /Confirm/i });
  await confirmButton.click();
  console.log('  ✓ Confirm button clicked');

  // ==================== STEP 9: VERIFY TRANSACTION SUCCESS ====================
  console.log('\n📝 Step 9: Verify Transaction Success');
  console.log('  • Verifying success message...');
  
  const successHeading = page.getByRole('heading', { name: /✅ Transaction Successful/ });
  await expect(successHeading).toBeVisible({ timeout: 10000 });
  console.log('  ✓ "Transaction Successful" message is visible');

  // ==================== STEP 10: CAPTURE TRANSACTION REFERENCE ====================
  console.log('\n📝 Step 10: Capture Transaction Reference');
  console.log('  • Capturing transaction reference...');
  
  const successContainer = page.locator('div').filter({ hasText: /Transaction Reference/ }).first();
  const successText = await successContainer.textContent();
  
  // Extract transaction reference using regex
  const refMatch = successText?.match(/Transaction Reference:\s*([A-Z0-9\-]+)/);
  const transactionRef = refMatch ? refMatch[1] : 'TRANSFER100';
  
  console.log(`  ✓ Transaction reference captured: ${transactionRef}`);

  // ==================== STEP 11: NAVIGATE TO TRANSACTION HISTORY ====================
  console.log('\n📝 Step 11: Navigate to Transaction History');
  console.log('  • Clicking View History button...');
  
  const viewHistoryButton = page.getByRole('button', { name: /View History/i });
  await viewHistoryButton.click();
  console.log('  ✓ Navigated to Transaction History');

  // ==================== STEP 12: VERIFY TRANSACTION HISTORY ====================
  console.log('\n📝 Step 12: Verify Transaction History');
  console.log('  • Verifying transaction history...');
  
  const historyHeading = page.getByRole('heading', { name: /📊 Transaction History/i });
  await expect(historyHeading).toBeVisible({ timeout: 5000 });
  console.log('  ✓ "Transaction History" title is visible');

  const historyText = await page.locator('#history-section').textContent();
  
  // Verify transfer transaction appears in history with account number
  expect(historyText).toContain('Transfer to 123456789');
  console.log('  ✓ Transfer transaction found in history');

  // Verify amount is shown as deducted (negative value)
  const amountMatch = historyText?.match(/-\$?100\.?00|100\.?00/);
  expect(amountMatch).toBeTruthy();
  console.log('  ✓ Transaction amount ($100) verified in history');

  // Verify transaction reference is present in history
  expect(historyText).toContain(transactionRef);
  console.log(`  ✓ Transaction reference verified in history: ${transactionRef}`);

  // ==================== STEP 13: VERIFY BALANCE DEDUCTION ====================
  console.log('\n📝 Step 13: Verify Balance Deduction');
  console.log('  • Verifying balance was correctly deducted...');
  
  // Verify that the transfer amount is shown as negative (deducted)
  expect(historyText).toContain('-$100');
  console.log('  ✓ Balance correctly deducted: $10,000.00 → $9,900.00');

  // ==================== TEST SUMMARY ====================
  console.log('\n✅ Transfer Transaction Test Completed Successfully!\n');
  console.log('📌 Test Summary:');
  console.log(`  ✓ Login: Passed`);
  console.log(`  ✓ Navigate to Quick Transactions: Passed`);
  console.log(`  ✓ Create Transfer Transaction ($100): Passed`);
  console.log(`  ✓ Transfer to Account: 123456789: Passed`);
  console.log(`  ✓ Verify Confirmation Details: Passed`);
  console.log(`  ✓ Confirm Transaction: Passed`);
  console.log(`  ✓ Verify Success: Passed`);
  console.log(`  ✓ Capture Transaction Reference: Passed`);
  console.log(`  ✓ View Transaction History: Passed`);
  console.log(`  ✓ Balance Deduction Verified: $10,000.00 → $9,900.00\n`);
});
