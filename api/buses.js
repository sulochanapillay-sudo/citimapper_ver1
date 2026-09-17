import { fetchState } from '../lib/fetchState.js';

function sendResponse(res, status, body, headers = {}) {
  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(body);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  const urlObj = new URL(req.url, 'http://localhost');
  const simulate = urlObj.searchParams.get('simulate');
  const busStopCode = urlObj.searchParams.get('busStopCode') || '95109'; // Default Changi / East Coast or downtown

  if (simulate === 'refused') {
    return sendResponse(res, 502, { state: 'refused', error: 'Upstream transit provider refused access (502)' }, { 'Cache-Control': 'no-store' });
  }
  if (simulate === 'busy') {
    return sendResponse(res, 503, { state: 'busy', error: 'Transit provider is currently busy (503)' }, { 'Cache-Control': 'no-store', 'Retry-After': '60' });
  }
  if (simulate === 'unreachable') {
    return sendResponse(res, 504, { state: 'unreachable', error: 'Upstream provider timed out or unreachable (504)' }, { 'Cache-Control': 'no-store' });
  }
  if (simulate === 'empty') {
    return sendResponse(res, 200, { state: 'empty', data: [] }, { 'Cache-Control': 's-maxage=20, stale-while-revalidate=40' });
  }
  if (simulate === 'key_not_set') {
    return sendResponse(res, 503, { state: 'my key not set', error: 'LTA_ACCOUNT_KEY is missing or blank' }, { 'Cache-Control': 'no-store' });
  }

  const ltaKey = process.env.LTA_ACCOUNT_KEY;
  if (!ltaKey || !ltaKey.trim()) {
    return sendResponse(res, 503, {
      state: 'my key not set',
      error: 'LTA_ACCOUNT_KEY is missing or blank in environment variables',
    }, {
      'Cache-Control': 'no-store',
    });
  }

  const url = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(busStopCode)}`;
  const pick = (b) => b.Services || b.value || (Array.isArray(b) ? b : []);

  const result = await fetchState(
    url,
    {
      headers: {
        AccountKey: ltaKey,
        accept: 'application/json',
      },
    },
    pick
  );

  if (result.state === 'refused') {
    return sendResponse(res, 502, { state: 'refused', error: result.error }, { 'Cache-Control': 'no-store' });
  }

  if (result.state === 'busy') {
    return sendResponse(res, 503, { state: 'busy', error: result.error }, {
      'Cache-Control': 'no-store',
      'Retry-After': String(result.retryAfter || 60),
    });
  }

  if (result.state === 'unreachable') {
    return sendResponse(res, 504, { state: 'unreachable', error: result.error }, { 'Cache-Control': 'no-store' });
  }

  if (result.state === 'empty' || !result.data || result.data.length === 0) {
    return sendResponse(res, 200, { state: 'empty', data: [] }, {
      'Cache-Control': 's-maxage=20, stale-while-revalidate=40',
    });
  }

  return sendResponse(res, 200, {
    state: 'ok',
    data: result.data,
    busStopCode,
    timestamp: new Date().toISOString(),
  }, {
    'Cache-Control': 's-maxage=20, stale-while-revalidate=40',
  });
}
