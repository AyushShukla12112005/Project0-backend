// Run this script to verify your deployment
// Usage: node verify-deployment.js https://your-backend.vercel.app

const url = process.argv[2];

if (!url) {
  console.error('❌ Please provide your backend URL');
  console.log('Usage: node verify-deployment.js https://your-backend.vercel.app');
  process.exit(1);
}

async function testEndpoint(endpoint, description) {
  try {
    console.log(`\nTesting: ${description}`);
    console.log(`URL: ${url}${endpoint}`);
    
    const response = await fetch(`${url}${endpoint}`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Success');
      console.log('Response:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('❌ Failed');
      console.log('Status:', response.status);
      console.log('Response:', JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Verifying Backend Deployment');
  console.log('================================\n');
  
  const results = {
    test: await testEndpoint('/api/test', 'Simple Test Endpoint'),
    health: await testEndpoint('/api/health', 'Health Check'),
    root: await testEndpoint('/', 'Root Endpoint'),
  };
  
  console.log('\n================================');
  console.log('Summary:');
  console.log('================================');
  console.log(`Test Endpoint: ${results.test ? '✅' : '❌'}`);
  console.log(`Health Check: ${results.health ? '✅' : '❌'}`);
  console.log(`Root Endpoint: ${results.root ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 All tests passed! Your backend is deployed correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('\nTroubleshooting:');
    console.log('1. Check Vercel deployment logs');
    console.log('2. Verify environment variables are set');
    console.log('3. Check MongoDB Atlas network access');
    console.log('4. See DEPLOYMENT-TROUBLESHOOTING.md for more help');
  }
}

runTests();
