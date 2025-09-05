// Quick test script to check API functionality
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing /api/league-table...');
    const response = await fetch('http://localhost:3000/api/league-table');
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers.raw());
    console.log('Response body:', text);
    
    if (text) {
      try {
        const data = JSON.parse(text);
        console.log('Parsed data:', JSON.stringify(data, null, 2));
      } catch (e) {
        console.log('Could not parse as JSON');
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();