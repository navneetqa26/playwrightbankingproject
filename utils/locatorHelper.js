/**
 * Simple helper to try multiple locator strategies and return the first visible locator.
 * Keep it intentionally tiny and synchronous-looking for readability.
 */
async function findFirstVisible(page, selectors = []) {
  for (const sel of selectors) {
    try {
      const loc = page.locator(sel).first();
      // If there are no matching nodes, count() === 0
      if ((await loc.count()) === 0) continue;
      // Use isVisible to respect Playwright auto-waiting behaviour
      if (await loc.isVisible()) return loc;
    } catch (e) {
      // ignore and try next selector
    }
  }
  return null;
}

module.exports = { findFirstVisible };
