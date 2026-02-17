const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testAuth() {
  try {
    // 1. Register Organization
    console.log('Testing Register Organization...');
    const regRes = await axios.post(`${API_URL}/register-org`, {
      orgName: 'Test Corp',
      name: 'Admin User',
      email: `admin_${Date.now()}@test.com`,
      password: 'password123'
    });
    console.log('Register Success:', regRes.data);
    const token = regRes.data.token;

    // 2. Get Me
    console.log('\nTesting Get Me...');
    const meRes = await axios.get(`${API_URL}/me`, {
      headers: { 'x-auth-token': token }
    });
    console.log('Get Me Success:', meRes.data);

    // 3. Login
    console.log('\nTesting Login...');
    const loginRes = await axios.post(`${API_URL}/login`, {
      email: regRes.data.user.email,
      password: 'password123'
    });
    console.log('Login Success:', loginRes.data);

  } catch (err) {
    console.error('Test Failed:', err.response ? err.response.data : err.message);
  }
}

testAuth();
