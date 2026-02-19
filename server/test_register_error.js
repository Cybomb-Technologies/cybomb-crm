const axios = require('axios');

async function testRegister() {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/register-org', {
            orgName: 'Test Org ' + Date.now(),
            name: 'Test Admin',
            email: 'admin' + Date.now() + '@test.com',
            password: 'password123'
        });
        console.log('Success:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error Status:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else {
            console.error('Error Message:', error.message);
        }
    }
}

testRegister();
