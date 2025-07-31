
async function getFromInvalidEndpoint(request) {
  const response = await request.get('https://reqres.in/api/invalid-endpoint');
  return response;
}

module.exports = { getFromInvalidEndpoint };
