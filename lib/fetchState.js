import { classify } from './classify.js';

/**
 * Executes a network fetch with a 6-second timeout and classifies the outcome.
 * Never calls res.json() directly; inspects status, headers, and body text.
 *
 * @param {string} url - Target URL
 * @param {RequestInit} [options={}] - Fetch configuration options
 * @param {Function} [pick=(b) => b] - Selector function to extract target payload from parsed JSON
 * @returns {Promise<{ state: string, status: number, data?: any, error?: string, retryAfter?: number, raw?: any }>}
 */
export async function fetchState(url, options = {}, pick = (b) => b) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6 seconds timeout

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const status = res.status;
    const contentType = res.headers.get('content-type') || '';
    const bodyText = await res.text();

    const classification = classify(status, contentType, bodyText);

    if (classification.state === 'ok') {
      let picked;
      try {
        picked = pick(classification.data);
      } catch (err) {
        picked = null;
      }

      if (picked === null || picked === undefined || (Array.isArray(picked) && picked.length === 0)) {
        return {
          state: 'empty',
          status: 200,
          data: Array.isArray(picked) ? [] : null,
          raw: classification.data,
        };
      }

      return {
        state: 'ok',
        status: 200,
        data: picked,
        raw: classification.data,
      };
    }

    return classification;
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      state: 'unreachable',
      status: 504,
      error: err.name === 'AbortError' ? 'Provider timed out after 6 seconds' : (err.message || 'Network error'),
    };
  }
}
