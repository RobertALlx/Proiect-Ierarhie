// Function to GET users from reqres
async function getUsers(request, page = 1) {
  const response = await request.get(`https://reqres.in/api/users?page=${page}`);

  // Check for HTTP errors
  if (response.status() !== 200) {
    throw new Error(`GET /users?page=${page} failed with status ${response.status()}`);
  }

  // Parse the response as JSON and return it
  const body = await response.json();
  return body;
}

module.exports = {
  getUsers,
};
