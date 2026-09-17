/**
 * Classifies HTTP responses from transit and government data feeds.
 *
 * @param {number} status - HTTP status code
 * @param {string} contentType - Content-Type header string
 * @param {string} bodyText - Raw response body as text
 * @returns {{ state: string, status: number, data?: any, error?: string, retryAfter?: number }}
 */
export function classify(status, contentType = '', bodyText = '') {
  // 1. Refused (401 Unauthorized or 403 Forbidden)
  if (status === 401 || status === 403) {
    return {
      state: 'refused',
      status: 502,
      error: `Access refused by upstream provider (${status})`,
    };
  }

  // 2. Busy / Rate limited (429 Too Many Requests or 503 Service Unavailable)
  if (status === 429 || status === 503) {
    return {
      state: 'busy',
      status: 503,
      retryAfter: 60,
      error: 'Upstream provider is busy or rate limited',
    };
  }

  // 3. Provider error / Gateway failure (5xx)
  if (status >= 500) {
    return {
      state: 'unreachable',
      status: 504,
      error: `Upstream gateway error (${status})`,
    };
  }

  // 4. Successful response (200 OK)
  if (status === 200) {
    const isJson = contentType.toLowerCase().includes('application/json') || 
                   (bodyText.trim().startsWith('{') && bodyText.trim().endsWith('}')) ||
                   (bodyText.trim().startsWith('[') && bodyText.trim().endsWith(']'));
    
    if (!isJson) {
      return {
        state: 'unreachable',
        status: 504,
        error: 'Upstream provider returned non-JSON content on 200 OK',
      };
    }

    try {
      const parsed = JSON.parse(bodyText);
      return {
        state: 'ok',
        status: 200,
        data: parsed,
      };
    } catch (err) {
      return {
        state: 'unreachable',
        status: 504,
        error: 'Malformed JSON received from provider',
      };
    }
  }

  // Any other unexpected status
  return {
    state: 'unreachable',
    status: 504,
    error: `Unexpected status code: ${status}`,
  };
}
