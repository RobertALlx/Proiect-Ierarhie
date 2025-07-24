import { test, expect, chromium } from '@playwright/test';

test.setTimeout(120_000);

test('Test Case Navigation: Testing navigation on the web', async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 1. Go to homepage and verify main elements
  await page.goto('https://demoqa.com/');
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('link').filter({ hasText: /^$/ })).toBeVisible();
  await expect(page.locator('.home-banner')).toBeVisible();
  await expect(page.locator('div').filter({ hasText: 'ElementsFormsAlerts, Frame &' }).nth(3)).toBeVisible();

  // 2. Navigate to "Alerts, Frame & Windows"
  await page.getByRole('heading', { name: 'Alerts, Frame & Windows' }).click();

  // 3. Go to "Widgets" section and verify widgets list
   await page.locator('span').filter({ hasText: 'Widgets' }).locator('div').first().click();
  const widgets = [
    'Accordian', 'Auto Complete', 'Date Picker', 'Slider',
    'Progress Bar', 'Tabs', 'Tool Tips'
  ];
  for (const widget of widgets) {
    await expect(page.getByRole('listitem').filter({ hasText: widget })).toBeVisible();
  }
  // Pentru "Menu" folosim filtru strict pentru a evita ambiguitatea
  await expect(page.getByRole('listitem').filter({ hasText: /^Menu$/ })).toBeVisible();
  await expect(page.getByText('Select Menu')).toBeVisible();

  // 4. Interact with "Slider"
  await page.getByRole('listitem').filter({ hasText: 'Slider' }).click();
  await page.getByRole('slider').fill('30');
  await expect(page.getByRole('slider')).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Slider');

  // 5. Go to "Interactions" and verify options
  await page.locator('span').filter({ hasText: 'Interactions' }).locator('div').first().click();
  const interactions = ['Sortable', 'Selectable', 'Resizable', 'Droppable', 'Dragabble'];
  for (const item of interactions) {
    await expect(page.getByText(item)).toBeVisible();
  }

  // 6. Interact with "Sortable"
  await page.getByRole('listitem').filter({ hasText: 'Sortable' }).click();
  const sortableItems = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
  for (const item of sortableItems.slice(0, 3)) {
    await page.getByLabel('List').getByText(item).click();
    await expect(page.getByLabel('List').getByText(item)).toBeVisible();
  }
  await page.getByRole('heading', { name: 'Sortable' }).click();
  for (const item of sortableItems.slice(3)) {
    await expect(page.getByLabel('List').getByText(item)).toBeVisible();
  }

  // 7. Interact with "Selectable"
  await page.getByRole('listitem').filter({ hasText: 'Selectable' }).click();
  const selectableItems = [
    'Cras justo odio', 'Dapibus ac facilisis in',
    'Morbi leo risus', 'Porta ac consectetur ac'
  ];
  for (const item of selectableItems) {
    await expect(page.getByText(item)).toBeVisible();
  }

  // 8. Go to "Elements" and verify options
  await page.locator('span').filter({ hasText: 'Elements' }).locator('div').first().click();
  const elements = [
    'Text Box', 'Check Box', 'Radio Button', 'Web Tables',
    'Buttons', 'Links', 'Broken Links - Images',
    'Upload and Download', 'Dynamic Properties'
  ];
  for (const el of elements) {
    await expect(page.getByText(el, { exact: el === 'Links' })).toBeVisible();
  }

  // 9. Interact with "Text Box"
  await page.getByRole('listitem').filter({ hasText: 'Text Box' }).click();
  await expect(page.locator('#userForm')).toBeVisible();
  await expect(page.locator('#userForm')).toContainText('Full Name');
  await expect(page.locator('#userForm')).toContainText('Email');
  await expect(page.locator('#userForm')).toContainText('Current Address');
  await expect(page.locator('#userForm')).toContainText('Permanent Address');
  await expect(page.locator('#userForm')).toContainText('Submit');

  // 10. Interact with "Check Box"
  await page.getByRole('listitem').filter({ hasText: 'Check Box' }).click();
  await expect(page.locator('span').filter({ hasText: 'Home' }).first()).toBeVisible();

  // 11. Interact with "Radio Button"
  await page.getByRole('listitem').filter({ hasText: 'Radio Button' }).click();
  await expect(page.getByRole('heading', { name: 'Radio Button' })).toBeVisible();
  await page.getByText('Do you like the site?').click();

  // Select "Yes" and verify
  await page.locator('div').filter({ hasText: /^Yes$/ }).click();
  await expect(page.getByText('You have selected Yes')).toBeVisible();

  // Select "Impressive" and verify
  await page.locator('div').filter({ hasText: /^Impressive$/ }).click();
  await expect(page.getByText('You have selected Impressive')).toBeVisible();

  // Close browser
  await browser.close();
});