// Helper function to create notification with custom styles
async function createNotification(page, id, backgroundColor, content) {
  await page.evaluate(({ notificationId, bgColor, htmlContent }) => {
    // Remove existing notification
    const existing = document.getElementById(notificationId);
    if (existing) {
      existing.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.id = notificationId;
    
    // Apply styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: bgColor,
      color: 'white',
      padding: '15px',
      borderRadius: '5px',
      zIndex: '1000',
      maxWidth: '300px',
      display: 'block',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    });
    
    notification.innerHTML = htmlContent;
    document.body.appendChild(notification);
  }, { notificationId: id, bgColor: backgroundColor, htmlContent: content });
}

// Helper function to create user notification in UI
async function displayUserNotification(page, userData, message = 'User Created Successfully!') {
  const content = `
    <h4> ${message}</h4>
    <p><strong>ID:</strong> ${userData.id}</p>
    <p><strong>Name:</strong> ${userData.name}</p>
    <p><strong>Job:</strong> ${userData.job}</p>
    <small>Created: ${new Date(userData.createdAt).toLocaleString()}</small>
  `;
  
  await createNotification(page, 'user-notification', '#4CAF50', content);
}

// Helper function to create error notification
async function displayErrorNotification(page, errorMessage) {
  const content = `
    <h4> Error</h4>
    <p>${errorMessage}</p>
  `;
  
  await createNotification(page, 'error-notification', '#f44336', content);
}

// Helper function to wait for notification and validate
async function waitForNotificationAndValidate(page, expectedText = 'User Created Successfully!') {
  const { expect } = require('@playwright/test');
  await page.waitForTimeout(1000);
  await page.waitForSelector('#user-notification', { state: 'visible' });
  
  const notification = page.locator('#user-notification');
  await expect(notification).toBeVisible();
  await expect(notification).toContainText(expectedText);
  
  return notification;
}

// Helper function to take screenshot with timestamp
async function takeScreenshotWithTimestamp(page, baseName = 'test') {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-results/${baseName}-${timestamp}.png`;
  await page.screenshot({ path: filename });
  console.log(` Screenshot saved: ${filename}`);
  return filename;
}

// Helper function to create user table in UI
async function displayUserTable(page, users) {
  await page.evaluate((userList) => {
    // Remove existing table
    const existing = document.getElementById('users-table');
    if (existing) {
      existing.remove();
    }

    // Create table
    const table = document.createElement('div');
    table.id = 'users-table';
    Object.assign(table.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'white',
      border: '2px solid #007BFF',
      borderRadius: '5px',
      padding: '15px',
      zIndex: '1000',
      maxWidth: '500px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    });

    let tableHTML = `
      <h3 style="color: #007BFF; margin-top: 0;">Created Users</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #007BFF; color: white;">
            <th style="padding: 8px; border: 1px solid #ddd;">ID</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Job</th>
          </tr>
        </thead>
        <tbody>
    `;

    userList.forEach(user => {
      tableHTML += `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.id}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${user.job}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    table.innerHTML = tableHTML;
    document.body.appendChild(table);
  }, users);
}

// Export all functions
module.exports = { 
  displayUserNotification,
  waitForNotificationAndValidate,
  takeScreenshotWithTimestamp,
  displayUserTable,
  displayErrorNotification
};