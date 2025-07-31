const { test, expect } = require('@playwright/test');
const { createUser } = require('../../Helpers/api-post.helper.js');

test('POST create user', async ({ request }) => {
  const user = { name: 'Test', job: 'QA' }; // User data to send

  const response = await createUser(request, user); // Send POST request

  if (response) {
    console.log('Status:', response.status());
    expect(response.status()).toBe(201); // Check that user was created

    const body = await response.json();
    console.log('Body:', body);

    expect(body.name).toBe(user.name); // Check name matches
    expect(body.job).toBe(user.job);   // Check job matches
    expect(body.id).toBeDefined();     // Check ID was returned
  } else {
    console.error('Response was null'); // Handle missing response
  }
});


//cand rulez testul site ul merge dar dupa apare Missing API key