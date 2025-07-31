const { test, expect } = require('@playwright/test');

const pagesToTest = [1, 2, 3];

pagesToTest.forEach(page => {
  test(`GET users page=${page} returns status 200`, async ({ request }) => {
    const response = await request.get(`https://reqres.in/api/users?page=${page}`);
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.page).toBe(page);
  });
});

//aici testele merg dar din cauza site-ului nu primesc 404 ci 401