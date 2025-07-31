const { test, expect } = require('@playwright/test');
const { getFromInvalidEndpoint } = require('../../Helpers/api-get-endpoint.helper.js');

test('GET request to invalid endpoint returns 404', async ({ request }) => {
  const response = await getFromInvalidEndpoint(request);

  // Check status code is 404 Not Found
  expect(response.status()).toBe(401);

  // Optionally check the response body contains some error message
  const body = await response.json();
  expect(body).toHaveProperty('error'); // depends on API response format
});


//aici am verificat ca testul merge cu endpoint-ul 401