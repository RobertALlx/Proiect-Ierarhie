const { test, expect } = require('@playwright/test');
const { getUsers } = require('../../Helpers/api.helper');

test('GET users from reqres using helper', async ({ request }) => {
  // 1. Use helper function
  const body = await getUsers(request, 2);

  // 2. Perform checks
  expect(body.page).toBe(2);
  expect(Array.isArray(body.data)).toBeTruthy();
  expect(body.data.length).toBeGreaterThan(0);

  // 3. Check each user object
  for (const user of body.data) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('avatar');
  }
});


//merge 