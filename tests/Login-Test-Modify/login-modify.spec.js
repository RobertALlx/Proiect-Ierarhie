const { test, expect, chromium } = require('@playwright/test');

test.setTimeout(120_000);

test('Login & Signup: invalid login, create account, login valid', async () => {
  // Launch browser manually with options
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Dynamic email for registration
  const uniqueEmail = `robi_${Date.now()}@mail.com`;
  const password = 'robi123';

  // 1. Navigate to the login page
  await page.goto('https://automationexercise.com/login');

  // 2. Accept cookies if consent button appears
  const consentButton = page.getByRole('button', { name: 'Consent' });
  if (await consentButton.isVisible()) {
    await consentButton.click();
  }

  // 3. Attempt login with invalid credentials
  await page.getByPlaceholder('Email Address').first().fill('robittest@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('wrongpass');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#form')).toContainText('Your email or password is incorrect!');

  // 4. Register a new account
  await page.getByPlaceholder('Name').fill('robi');
  await page.locator('form:has-text("Signup") >> input[placeholder="Email Address"]').fill(uniqueEmail);
  await page.getByRole('button', { name: 'Signup' }).click();

  // 5. Fill out account information form
  await page.getByLabel('Mr.').check();
  await page.getByLabel('Password *').fill(password);

  await page.selectOption('#days', '1');
  await page.selectOption('#months', '1');
  await page.selectOption('#years', '2021');

  await page.getByLabel('Sign up for our newsletter!').check();
  await page.getByLabel('Receive special offers from our partners!').check();

  await page.getByLabel('First name *').fill('Robeert');
  await page.getByLabel('Last name *').fill('Aex');
  await page.locator('input[name="company"]').fill('123441');

  await page.getByLabel('Address *').fill('Street 1');
  await page.getByLabel('Address 2').fill('Apt 2');
  await page.getByLabel('State *').fill('StateTest');
  await page.getByLabel('City *').fill('CityTest');
  // Wait until the zipcode input field becomes visible on the page
  await page.waitForSelector('input[name="zipcode"]', { state: 'visible' });
  // Once visible, fill in the zipcode field with '12345'
  await page.locator('input[name="zipcode"]').fill('12345');
  await page.getByLabel('Mobile Number *').fill('0712345678');

  // 6. Submit account creation
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Account Created!')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();

  // 7. Log out
  await page.getByRole('link', { name: ' Logout' }).click();

  // 8. Log in with newly created account
  await page.goto('https://automationexercise.com/login');
  await page.getByPlaceholder('Email Address').first().fill(uniqueEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#header')).toContainText('Logged in as robi');

  // Close browser manually
  await browser.close();
});
