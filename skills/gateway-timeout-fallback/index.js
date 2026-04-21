/**
 * Executes a primary promise-returning function with a timeout.
 * If it times out or fails, executes the fallback function.
 *
 * @param {Function} primaryFn - Function returning a Promise for the primary model.
 * @param {Function} fallbackFn - Function returning a Promise for the fallback model.
 * @param {Object} options - Options object.
 * @param {number} options.timeoutMs - Timeout in milliseconds.
 * @returns {Promise<any>}
 */
async function fetchWithFallback(primaryFn, fallbackFn, options = {}) {
  const timeoutMs = options.timeoutMs || 30000;

  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Primary request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([
      primaryFn(),
      timeoutPromise
    ]);
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`[gateway-timeout-fallback] Primary failed/timed out: ${error.message}. Switching to fallback...`);
    return await fallbackFn();
  }
}

module.exports = {
  fetchWithFallback
};
