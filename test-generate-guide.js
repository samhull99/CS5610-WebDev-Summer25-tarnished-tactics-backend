// test-generate-guide.js
import fetch from 'node-fetch'; // You might need: npm install node-fetch

async function testGenerateGuide() {
  try {
    // Replace these with actual values from your database
    const buildId = "6893b699d4bcf71efee1f0ce"; // Get this from your MongoDB
    const userId = "109145464974463351586";   // Get this from your database
    
    const response = await fetch(`http://localhost:5000/api/v1/builds/${buildId}/generate-guide`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Error:', response.status, error);
      return;
    }

    const result = await response.json();
    console.log('Generated Guide:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

testGenerateGuide();