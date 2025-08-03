// Helper function to create a new user with detailed validation
async function createUserWithValidation(request, userData) {
  // Send POST request with proper headers
  const response = await request.post('https://reqres.in/api/users', {
    data: userData,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1'
    }
  });

  // Validate status code
  if (response.status() !== 201) {
    throw new Error(`POST /users failed with status ${response.status()}`);
  }

  // Parse JSON body
  const body = await response.json();

  // Validate required properties exist
  if (!body.hasOwnProperty('name') || !body.hasOwnProperty('job') || 
      !body.hasOwnProperty('id') || !body.hasOwnProperty('createdAt')) {
    throw new Error('Response missing required properties');
  }

  // Validate data matches request
  if (body.name !== userData.name || body.job !== userData.job) {
    throw new Error('Response data does not match request data');
  }

  // Validate data types
  if (typeof body.id !== 'string') {
    throw new Error('ID should be a string');
  }

  if (!Date.parse(body.createdAt)) {
    throw new Error('createdAt should be a valid date');
  }

  return body;
}

// Export the functions
module.exports = { createUserWithValidation };