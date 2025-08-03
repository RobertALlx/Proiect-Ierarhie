const { test, expect } = require('@playwright/test');
const { createUserWithValidation } = require('../../Helpers-UI/api-post-ui.helper.js');

test('POST create user with detailed validation', async ({ request }) => {
  // 1. Define new user
  const newUser = {
    name: 'Maria Popescu',
    job: 'Senior Developer'
  };

  // 2. Call helper - all validations are done inside the helper
  const body = await createUserWithValidation(request, newUser);

  // 3. If we reach this point, all validations passed
  // Just log the successful result
  
  console.log(`   ID: ${body.id}`);
  console.log(`   Name: ${body.name}`);
  console.log(`   Job: ${body.job}`);
  console.log(`   Created at: ${body.createdAt}`);
  console.log(' User created and validated successfully:');
});

//Test basic POST - creeaza user și valideaza că totul e corect