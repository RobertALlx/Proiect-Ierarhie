const fs = require('fs');
const path = require('path');

// Helper function to login via API and save storage state
async function loginAndSaveStorageState(request, credentials) {
  console.log('Attempting to login via API...');
  
  // 1. Make login request to reqres.in
  const loginResponse = await request.post('https://reqres.in/api/login', {
    data: credentials,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1'
    }
  });

  // 2. Validate login response
  if (loginResponse.status() !== 200) {
    const errorBody = await loginResponse.text();
    throw new Error(`Login failed with status ${loginResponse.status()}: ${errorBody}`);
  }

  const loginData = await loginResponse.json();
  console.log('Login successful, token received:', loginData.token);

  // 3. Create storage state with token
  const storageState = {
    cookies: [],
    origins: [
      {
        origin: 'https://reqres.in',
        localStorage: [
          {
            name: 'authToken',
            value: loginData.token
          },
          {
            name: 'userEmail', 
            value: credentials.email
          },
          {
            name: 'loginTime',
            value: new Date().toISOString()
          }
        ]
      }
    ]
  };

  // 4. Save to fixtures/storageState.json
  const storageStatePath = path.join(__dirname, '..', 'fixtures', 'storageState.json');
  fs.writeFileSync(storageStatePath, JSON.stringify(storageState, null, 2));
  
  console.log(`Storage state saved to: ${storageStatePath}`);
  
  return {
    token: loginData.token,
    storageStatePath: storageStatePath
  };
}

// Helper function to register user first (reqres.in requires registration before login)
async function registerAndLoginUser(request, userCredentials) {
  console.log('Registering user first...');
  
  // 1. Register user
  const registerResponse = await request.post('https://reqres.in/api/register', {
    data: userCredentials,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1'
    }
  });

  if (registerResponse.status() !== 200) {
    const errorBody = await registerResponse.text();
    throw new Error(`Registration failed with status ${registerResponse.status()}: ${errorBody}`);
  }

  const registerData = await registerResponse.json();
  console.log('Registration successful, ID:', registerData.id);

  // 2. Now login with the same credentials
  return await loginAndSaveStorageState(request, userCredentials);
}

// Helper function to load storage state
function loadStorageState() {
  const storageStatePath = path.join(__dirname, '..', 'fixtures', 'storageState.json');
  
  if (!fs.existsSync(storageStatePath)) {
    console.log('Storage state file not found');
    return null;
  }

  const storageState = JSON.parse(fs.readFileSync(storageStatePath, 'utf8'));
  console.log('Storage state loaded from:', storageStatePath);
  
  return storageState;
}

// Helper function to check if storage state is valid
function isStorageStateValid() {
  const storageState = loadStorageState();
  
  if (!storageState) {
    return false;
  }

  // Check if token exists
  const origin = storageState.origins?.find(o => o.origin === 'https://reqres.in');
  const authToken = origin?.localStorage?.find(item => item.name === 'authToken');
  
  if (!authToken) {
    console.log('No auth token found in storage state');
    return false;
  }

  // Check if login is not too old (optional - 24 hours)
  const loginTime = origin?.localStorage?.find(item => item.name === 'loginTime');
  if (loginTime) {
    const loginDate = new Date(loginTime.value);
    const now = new Date();
    const hoursSinceLogin = (now - loginDate) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > 24) {
      console.log('Storage state is older than 24 hours');
      return false;
    }
  }

  console.log('Storage state is valid');
  return true;
}

// Export functions
module.exports = {
  loginAndSaveStorageState,
  registerAndLoginUser,
  loadStorageState,
  isStorageStateValid
};
