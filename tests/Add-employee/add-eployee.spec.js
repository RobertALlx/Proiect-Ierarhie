import { test, expect, chromium } from '@playwright/test';

test.setTimeout(120_000);

test('OrangeHRM: Login, add employee, and search', async () => {
  // Test data
  const credentials = { username: 'Admin', password: 'admin123' };
  const employee = { firstName: 'Robert', middleName: 'balan', lastName: 'alexandru', id: '0458' };

  // Launch browser with slow motion for visibility
  const browser = await chromium.launch({ headless: false, slowMo: 2000 });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Helper: Login function
  async function login(page, { username, password }) {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Username' }).fill(username);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(/dashboard/);
    await expect(page.locator('div').filter({ hasText: /^Dashboard$/ })).toBeVisible();
  }

  // Helper: Add employee function
  async function addEmployee(page, { firstName, middleName, lastName }) {
    await page.getByRole('link', { name: 'PIM' }).click();
    await expect(page.getByRole('link', { name: 'Add Employee' })).toBeVisible();
    await page.getByRole('link', { name: 'Add Employee' }).click();
    await expect(page.getByRole('textbox', { name: 'First Name' })).toBeVisible();
    await page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    await page.getByRole('textbox', { name: 'Middle Name' }).fill(middleName);
    await page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
    const employeeIdInput = page.getByRole('textbox').nth(4);
    await expect(employeeIdInput).toBeVisible();
    await expect(employeeIdInput).toHaveValue(/\d+/);
    await expect(page.getByRole('button', { name: 'Save' })).toBeEnabled();
    await page.getByRole('button', { name: 'Save' }).click();
  }

  // Helper: Search employee by ID
  async function searchEmployeeById(page, employeeId, fullName) {
    await page.getByRole('link', { name: 'Employee List' }).click();
    await expect(page.locator('.orangehrm-container')).toBeVisible();
    await page.getByRole('textbox').nth(2).fill(employeeId);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('row', { name: new RegExp(`${employeeId} ${fullName}`) })).toBeVisible();
  }

  // Helper: Search employee by Name (folosind câmpul "Employee Name" din Employee Information)
  async function searchEmployeeByNameField(page, employeeId, fullName) {
    await page.getByRole('link', { name: 'Employee List' }).click();
    await expect(page.locator('.orangehrm-container')).toBeVisible();

    // Find Employee Name input field
    const employeeNameInput = page.locator('input[placeholder="Type for hints..."]').first();
    await expect(employeeNameInput).toBeVisible();
    await employeeNameInput.fill(fullName);

    // Click pe Search
    await page.getByRole('button', { name: 'Search' }).click();

    // Check the row with the ID and full name
    await expect(page.getByRole('row', { name: new RegExp(`${employeeId} ${fullName}`) })).toBeVisible();
  }

  // Steps
  await test.step('Login to OrangeHRM', async () => {
    await login(page, credentials);
  });

  await test.step('Add new employee', async () => {
    await addEmployee(page, employee);
  });

  await test.step('Search for the added employee by ID', async () => {
    await searchEmployeeById(page, employee.id, `${employee.firstName} ${employee.middleName} ${employee.lastName}`);
  });

  await test.step('Search for the added employee by Name (Employee Name field)', async () => {
    await searchEmployeeByNameField(page, employee.id, `${employee.firstName} ${employee.middleName} ${employee.lastName}`);
  });

  // Close browser
    await browser.close();
  });