const { test, expect } = require('@playwright/test');

test('GET invalid endpoint should return 404', async ({ request }) => 
{
  const response = await request.get('https://reqres.in/api/invalid-endpoint');
  expect(response.status()).toBe(404);
});

// se asteapta sa primeeasca 404 dar din cauza site ului primeste 401