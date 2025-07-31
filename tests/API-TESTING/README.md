API Testing Project – ReqRes API

This project contains automated API tests for the public [ReqRes](https://reqres.in) API**, implemented using Playwright Test.  
The goal is to verify GET, POST, and **error handling (404)** scenarios.

---

What We Tested

1. GET Users**
   - Verified that the `/api/users?page=2` endpoint responds correctly.
   - Checked the data structure and the fields of each user.

2. POST Create User**
   - Tested creating a new user via the `/api/users` endpoint.
   - Verified that the submitted data is returned correctly and that the response includes `id` and `createdAt`.

3. GET Invalid Endpoint (404)**
   - Verified the API’s behavior when accessing an invalid endpoint `/api/invalid-endpoint`.
   - Confirmed that the response status is `404 Not Found`.



 What We Validated

- Status codes** for each request (`200`, `201`, `404`).  
- JSON body structure**: mandatory fields (`id`, `email`, `first_name`, `last_name`, `avatar`).  
- Data validity**: number of users, correct data types (`array`, `string`).  
- Proper response to invalid endpoints** (`404`).  


 Test Steps

1. GET Users
   1. Send a GET request to `https://reqres.in/api/users?page=2`.
   2. Verify status `200 OK`.
   3. Parse the response body as JSON.
   4. Check that `page` and `data` fields exist.
   5. Iterate over `data` and verify each user has `id`, `email`, `first_name`, `last_name`, `avatar`.

2. POST Create User
   1. Send a POST request to `https://reqres.in/api/users` with a JSON body (`name`, `job`).
   2. Verify status `201 Created`.
   3. Verify the response contains the same `name` and `job` as sent.
   4. Verify the auto-generated fields: `id` and `createdAt`.

3. Negative Test (404)
   1. Send a GET request to `https://reqres.in/api/invalid-endpoint`.
   2. Verify status `404 Not Found`.
   3. (Optional) Verify the body contains an error message.

---

 File Organization

Helpers/
api.helper.js # Functions for GET (getUsers)
api-post.helper.js # Functions for POST (createUser)
api-get-endpoint.helper.js # Functions for 404 test

tests/API-TESTING/
api-get.spec.js # Test GET /users
api-post.spec.js # Test POST /users
api-get-endpoint.spec.js # Test GET invalid endpoint (404)



- Helpers: Contain reusable request logic (GET/POST/404).  
- Tests: Call helper functions and contain assertions (`expect`).  

---

 Conclusion

- Implemented a set of automated API tests for GET, POST, and 404 scenarios.  
- Tests are modular, organized into helpers and spec files, and easy to extend.  
- Coverage includes both positive (successful GET/POST) and negative (404) cases.
