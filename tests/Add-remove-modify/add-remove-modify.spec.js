import { test, expect, chromium } from '@playwright/test';

test.setTimeout(120_000);

test('Add and Remove Products from Cart - with slowMo and manual browser launch', async () => {
  // Launch browser with slowMo for better visibility
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Navigate to the website
  await page.goto('https://automationexercise.com/');

  // 2. Accept cookies if the consent button appears
  const consentButton = page.getByRole('button', { name: /consent/i });
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  // 3. Wait until network activity is idle and hide ads/iframes
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    document.querySelectorAll('iframe, .adsbygoogle, ins.adsbygoogle-noablate').forEach(el => el.style.display = 'none');
  });

  // 4. Verify homepage loaded
  await expect(page.locator('body')).toContainText('Features Items');

  // Helper function to add a product to cart by index
  async function addProductToCart(index) {
    const product = page.locator('.product-image-wrapper').nth(index);
    await product.hover();
    const addToCartButton = product.locator('.product-overlay .btn');
    await addToCartButton.waitFor({ state: 'visible' });
    await addToCartButton.click();
    // Wait for modal and click 'Continue Shopping' if not last product
    if (index < 2) {
      await page.getByRole('button', { name: 'Continue Shopping' }).click();
    }
  }

  // 5-8. Add three products to cart
  await addProductToCart(0); // Blue Top
  await addProductToCart(1); // Men Tshirt
  await addProductToCart(2); // Sleeveless Dress

  // 9. Verify confirmation modal for last product
  await expect(page.locator('#cartModal')).toContainText('Added! Your product has been added to cart.');

  // 10. Go to cart
  await page.getByRole('link', { name: 'View Cart' }).click();

  // 11. Verify all three products are in the cart
  await expect(page.getByRole('row', { name: /Product Image Blue Top Women/i })).toBeVisible();
  await expect(page.getByRole('row', { name: /Product Image Men Tshirt Men/i })).toBeVisible();
  await expect(page.getByRole('row', { name: /Product Image Sleeveless/i })).toBeVisible();

  // 12. Remove products from the cart one by one
  for (let i = 1; i <= 3; i++) {
    // Wait for the delete button to be visible and click it
    const deleteButton = page.locator(`tr[id^="product-"]`).first().getByRole('cell', { name: '' }).locator('a');
    await deleteButton.waitFor({ state: 'visible' });
    await deleteButton.click();
    // Optionally, wait a bit for the cart to update
    await page.waitForTimeout(1000);
  }

  // 13. Confirm that the cart is now empty
  await expect(page.locator('#empty_cart')).toContainText('Cart is empty! Click here to buy products.');

  // Close browser
  await browser.close();
});