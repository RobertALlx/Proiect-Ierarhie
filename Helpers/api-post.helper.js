export async function createUser(request, user) {
  try {
    // Send POST request to create user
    const response = await request.post('https://reqres.in/api/users', {
      data: user,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If status is 201, return response body
    if (response.status() === 201) {
      return await response.json();
    } else {
      // Log error details if status is not 201
      console.error('Error creating user:', await response.text());
      return null;
    }
  } catch (error) {
    // Log any request errors
    console.error('Request failed:', error);
    return null;
  }
}
