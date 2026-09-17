import { fetchState } from '../lib/fetchState.js';

const WATCHED = ['HE12', 'C5', 'TAM8'];

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
  // Support testing simulated states via query param if passed (?simulate=...)
  const urlObj = new URL(req.url, 'http://localhost');
  const simulate = urlObj.searchParams.get('simulate');

  if (simulate === 'refused') {
    return sendResponse(res, 502, { state: 'refused', error: 'Upstream provider refused access (401/403)' }, { 'Cache-Control': 'no-store' });
  }
  if (simulate === 'busy') {
    return sendResponse(res, 503, { state: 'busy', error: 'Upstream provider is busy (429/503)' }, { 'Cache-Control': 'no-store', 'Retry-After': '60' });
  }
  if (simulate === 'unreachable') {
    return sendResponse(res, 504, { state: 'unreachable', error: 'Upstream provider timed out or unreachable' }, { 'Cache-Control': 'no-store' });
  }
  if (simulate === 'empty') {
    return sendResponse(res, 200, { state: 'empty', data: [] }, { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' });
  }
  if (simulate === 'key_not_set') {
    return sendResponse(res, 503, { state: 'my key not set', error: 'LTA_ACCOUNT_KEY is missing or blank' }, { 'Cache-Control': 'no-store' });
  }

  // Guardrail: BEFORE the train fetch: if LTA_ACCOUNT_KEY is missing or blank, return 503 naming the variable and do not call LTA.
  const ltaKey = process.env.LTA_ACCOUNT_KEY;
  if (!ltaKey || !ltaKey.trim()) {
    return sendResponse(res, 503, {
      state: 'my key not set',
      error: 'LTA_ACCOUNT_KEY is missing or blank in environment variables',
    }, {
      'Cache-Control': 'no-store',
    });
  }

  const url = 'https://datamall2.mytransport.sg/ltaodataservice/GTFSRealTimeTrainServiceAlerts';
  const pick = (b) => b.items?.[0]?.train_data || b.items?.[0]?.carpark_data || b.value;

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

  if (result.state === 'empty') {
    return sendResponse(res, 200, { state: 'empty', data: [] }, {
      'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
    });
  }

  // result.state === 'ok'
  const items = Array.isArray(result.data) ? result.data : [];
  const processed = WATCHED.map((watchedId) => {
    const matched = items.find(
      (item) => (item.train_number === watchedId) || (item.carpark_number === watchedId)
    );

    if (!matched) {
      return {
        train_number: watchedId,
        is_unknown: true,
      };
    }

    const info = matched.train_info?.[0] || matched.carpark_info?.[0] || matched;
    const totalLots = Number(info.total_lots);
    const lotsAvailable = Number(info.lots_available);

    return {
      train_number: String(matched.train_number || matched.carpark_number || watchedId),
      lot_type: String(info.lot_type || 'C'),
      lots_available: isNaN(lotsAvailable) ? 0 : lotsAvailable,
      total_lots: isNaN(totalLots) ? 0 : totalLots,
      update_datetime: String(matched.update_datetime || new Date().toISOString()),
      is_unknown: false,
    };
  });

  const allUnknown = processed.every((p) => p.is_unknown);
  const finalState = allUnknown ? 'empty' : 'ok';

  return sendResponse(res, 200, {
    state: finalState,
    data: processed,
    timestamp: new Date().toISOString(),
  }, {
    'Cache-Control': 's-maxage=60, stale-while-revalidate=120',
  });
}
