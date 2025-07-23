1.Login & Signup Test
File: loginSignup.test.ts

What it does:

Opens the login/signup page.

Attempts login with incorrect credentials (and verifies the error).

Signs up a new user with a fresh email.

Completes the account creation form.

Logs out and logs back in with the newly created credentials.

Run this test with: npx playwright test login-singup.spec.js --headed 

2. Add & Remove from Cart Test
File: addRemoveCart.test.js

 What it does:

Opens the homepage.

Adds three different products to the cart.

Goes to the cart page and checks if all products are listed.

Deletes each product from the cart.

Verifies that the cart is empty.

Run this test with: npx playwright test add-remove.spec.js --headed 


3. Navigation Test
File: navigation.test.js
 What it does:

Navigates across multiple pages on demoqa.com:

Widgets

Interactions

Elements

Interacts with sliders, lists, buttons, and input fields.

Verifies that all pages and components are working properly.

Run this test with: npx playwright test navigation-on-web.spec.js --headed 


4.Validation Test
File: validation.test.js

What it does:

Subscribes using various email addresses in the newsletter input.

Validates the success message.

Fills out the contact form with name, email, subject, and message.

Submits the form and confirms the success response.

Run this test with: npx playwright test validation-on-site.spec.js --headed 
