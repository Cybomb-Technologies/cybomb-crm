const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    // 1. Register logic to get token
    console.log('--- Authenticating ---');
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';
    
    // Register Org
    const regRes = await axios.post(`${API_URL}/auth/register-org`, {
        orgName: 'Test Org ' + Date.now(),
        name: 'Test Admin',
        email,
        password
    });
    const token = regRes.data.token;
    console.log('Authentication Successful. Token received.');
    
    const config = { headers: { 'x-auth-token': token } };

    // 2. Test Customer Module
    console.log('\n--- Testing Customer Module ---');
    const customerData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        company: 'Acme Inc',
        address: { city: 'New York', country: 'USA' }
    };
    const custRes = await axios.post(`${API_URL}/customers`, customerData, config);
    console.log('Create Customer: SUCCESS', custRes.data._id);
    const customerId = custRes.data._id;

    // 3. Test Activity Module
    console.log('\n--- Testing Activity Module ---');
    const activityData = {
        type: 'call',
        subject: 'Intro Call',
        description: 'Discuss requirements',
        date: new Date(),
        relatedTo: { onModel: 'Customer', id: customerId }
    };
    const actRes = await axios.post(`${API_URL}/activities`, activityData, config);
    console.log('Create Activity: SUCCESS', actRes.data._id);

    // 4. Test Ticket Module
    console.log('\n--- Testing Ticket Module ---');
    const ticketData = {
        subject: 'Issue with Login',
        description: 'User cannot login',
        priority: 'high',
        customer: customerId
    };
    const tickRes = await axios.post(`${API_URL}/tickets`, ticketData, config);
    console.log('Create Ticket: SUCCESS', tickRes.data._id);

    // 5. Test Automation Module
    console.log('\n--- Testing Automation Module ---');
    const automationData = {
        name: 'Auto-Assign Leads',
        trigger: { event: 'lead_created', model: 'Lead' },
        actions: [{ type: 'send_email', params: { template: 'welcome' } }]
    };
    const autoRes = await axios.post(`${API_URL}/automations`, automationData, config);
    console.log('Create Automation: SUCCESS', autoRes.data._id);

    console.log('\nAll tests passed successfully!');

  } catch (err) {
    if (err.response) {
        console.error('Test Failed Status:', err.response.status);
        console.error('Test Failed Data:', JSON.stringify(err.response.data, null, 2));
    } else if (err.request) {
        console.error('Test Failed: No response received. Server might be down.');
    } else {
        console.error('Test Failed Message:', err.message);
    }
  }
}

testAPI();
