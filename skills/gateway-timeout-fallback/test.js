const assert = require('assert');
const { fetchWithFallback } = require('./index.js');

async function runTests() {
  console.log('Running gateway-timeout-fallback tests...');

  // Test 1: Primary succeeds before timeout
  let fallbackCalled = false;
  const primaryFast = () => new Promise(resolve => setTimeout(() => resolve('primary_success'), 50));
  const fallback = () => { fallbackCalled = true; return Promise.resolve('fallback_success'); };

  const res1 = await fetchWithFallback(primaryFast, fallback, { timeoutMs: 200 });
  assert.strictEqual(res1, 'primary_success');
  assert.strictEqual(fallbackCalled, false);
  console.log('✓ Test 1 passed (Primary fast)');

  // Test 2: Primary times out, fallback succeeds
  fallbackCalled = false;
  const primarySlow = () => new Promise(resolve => setTimeout(() => resolve('primary_late'), 500));
  
  const res2 = await fetchWithFallback(primarySlow, fallback, { timeoutMs: 100 });
  assert.strictEqual(res2, 'fallback_success');
  assert.strictEqual(fallbackCalled, true);
  console.log('✓ Test 2 passed (Primary times out, Fallback used)');

  // Test 3: Primary errors immediately, fallback succeeds
  fallbackCalled = false;
  const primaryError = () => Promise.reject(new Error('Connection refused'));

  const res3 = await fetchWithFallback(primaryError, fallback, { timeoutMs: 200 });
  assert.strictEqual(res3, 'fallback_success');
  assert.strictEqual(fallbackCalled, true);
  console.log('✓ Test 3 passed (Primary errors, Fallback used)');

  console.log('All tests passed successfully!');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
