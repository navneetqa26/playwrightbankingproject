import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { HomePage } from '../pages/HomePage.js';
import { TransactionHistoryPage } from '../pages/TransactionHistoryPage.js';

const { config } = require('../utils/config.js');

// Do not use explicit waits in this test — rely on Playwright auto-waiting and expect assertions

test('Bill Payments - Electricity (end-to-end)', async ({ page }) => {
  // keep this test short and readable; rely on Playwright auto-waits and clear locators
  page.setDefaultTimeout(config.getPageTimeout());
  page.setDefaultNavigationTimeout(config.getNavigationTimeout());

  const loginPage = new LoginPage(page);

  await loginPage.navigateTo(config.getUrl());
  await Promise.all([
    page.waitForURL(/Banking-Project-Demo.html/),
    loginPage.login('TestersTalk', 'TestersTalk', 'Banking')
  ]);

  // Open Bill Payments
  await page.getByRole('button', { name: 'Bill Payments' }).click();
  await expect(page.getByRole('heading', { name: '💳 Bill Payments' }).first()).toBeVisible();

  // Fill form (straightforward selectors)
  await page.getByRole('combobox', { name: /Bill Type/i }).selectOption('Electricity');
  await page.getByPlaceholder('Enter service provider name').fill('Local counsil');
  const acct = page.getByPlaceholder('Enter account or reference number');
  if (await acct.count()) await acct.fill('123456789');
  else await page.locator('#billAccountNumber').first().fill('123456789');
  await page.getByRole('spinbutton', { name: /Amount/i }).fill('1200');

  // Payment method (simple attempt; ignore if markup differs)
  try {
    await page.getByRole('combobox', { name: /Payment Method/i }).selectOption({ label: 'Savings Account' });
  } catch {}

  // Submit and (if shown) confirm the payment
  await page.getByRole('button', { name: 'Submit' }).click();

  // Some variants show a Confirmation step before success — click Confirm if present
  const confirmHeading = page.getByRole('heading', { name: /Confirmation|Bill Payment Confirmation|Confirm Payment/i }).first();
  if (await confirmHeading.count()) {
    await expect(confirmHeading).toBeVisible();
    await page.getByRole('button', { name: 'Confirm' }).click();
  }

  // Now wait for the success heading
  await expect(page.getByRole('heading', { name: /Bill Payment Successful|Payment Successful|Bill Payment Completed/i }).first()).toBeVisible();

  // Capture reference (simple scan of body text)
  const bodyText = await page.locator('body').textContent();
  const paymentRef = (bodyText && (bodyText.match(/TXN[-A-Z0-9\-]+/i) || bodyText.match(/REF[-A-Z0-9\-]+/i)))?.[0] || null;

  // View history and verify
  await page.getByRole('button', { name: 'View History' }).click();
  await expect(page.getByRole('heading', { name: /Transaction History/i }).first()).toBeVisible();
  const historyText = await page.locator('#transactionHistory').first().innerText().catch(() => '');
  expect(historyText).toContain('1200');
  if (paymentRef) expect(historyText).toContain(paymentRef);

  // Quick balance check (allow common formatting variations)
  const balanceText = await page.locator('body').textContent();
  const hasBalance = balanceText && (balanceText.includes('$8,800.00') || balanceText.includes('$8800.00') || balanceText.includes('8800.00'));
  expect(hasBalance).toBeTruthy();
});
