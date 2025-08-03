const { test, expect } = require('@playwright/test');
const { createUserWithValidation } = require('../../Helpers-UI/api-post-ui.helper.js');
const { displayUserNotification, waitForNotificationAndValidate, takeScreenshotWithTimestamp } = require('../../Helpers-UI/api-user.helper.js');
const { loadStorageState, isStorageStateValid } = require('../../Helpers-UI/auth.helper.js');

test('UI - Navigate and display created user from API', async ({ page, request }) => {
  // 1. Check if we have valid storage state and use it
  if (isStorageStateValid()) {
    const storageState = loadStorageState();
    // Apply storage state to page context
    await page.context().addInitScript((state) => {
      const origin = state.origins?.find(o => o.origin === 'https://reqres.in');
      if (origin?.localStorage) {
        origin.localStorage.forEach(item => {
          localStorage.setItem(item.name, item.value);
        });
      }
    }, storageState);
    
    console.log(' Using authenticated session from storage state');
  }

  // 2. Create a user via API
  const newUser = {
    name: 'Maria Popescu', 
    job: 'Senior Developer'
  };

  const createdUser = await createUserWithValidation(request, newUser);
  console.log(' User created via API:', createdUser);
  
  // 3. Navigate to reqres.in 
  await page.goto('https://reqres.in/');
  
  // 4. Check if the page loaded
  await expect(page).toHaveTitle(/Reqres/);

  // 5. Check if we're authenticated and show status
  const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
  if (authToken && authToken !== 'placeholder-token') {
    await page.evaluate(() => {
      const authBadge = document.createElement('div');
      authBadge.style.position = 'fixed';
      authBadge.style.top = '80px';
      authBadge.style.right = '20px';
      authBadge.style.background = '#2196F3';
      authBadge.style.color = 'white';
      authBadge.style.padding = '8px';
      authBadge.style.borderRadius = '3px';
      authBadge.style.fontSize = '12px';
      authBadge.style.zIndex = '999';
      authBadge.textContent = ' Authenticated';
      document.body.appendChild(authBadge);
    });
    console.log(' Session is authenticated');
  }
  
  // 6. Display user notification using helper
  await displayUserNotification(page, createdUser);

  // 7. Wait for notification and validate using helper
  await waitForNotificationAndValidate(page);
  
  // 8. Take screenshot with timestamp using helper
  await takeScreenshotWithTimestamp(page, 'user-notification');
  
  console.log('User notification displayed successfully in UI');
});

//Ia un utilizator creat prin API și îl afișează frumos în UI cu notificări