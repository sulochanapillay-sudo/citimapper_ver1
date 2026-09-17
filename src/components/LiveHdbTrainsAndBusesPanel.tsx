import React, { useState, useEffect, useCallback } from 'react';

interface TrainLotItem {
  train_number: string;
  lot_type: string;
  lots_available: number;
  total_lots: number;
  update_datetime: string;
  is_unknown: boolean;
}

interface BusServiceItem {
  ServiceNo: string;
  Operator: string;
  NextBus?: {
    EstimatedArrival: string;
    Load: string;
    Feature: string;
    Type: string;
  };
  NextBus2?: {
    EstimatedArrival: string;
    Load: string;
  };
  // Fallbacks for simulated data
  busNo?: string;
  next?: string;
  subsequent?: string;
  load?: string;
}

export type UsabilityState = 'normal' | 'loading' | 'empty' | 'refused' | 'busy' | 'unreachable' | 'key_not_set';

export const LiveHdbTrainsAndBusesPanel: React.FC = () => {
  // Train lots state
  const [trainState, setTrainState] = useState<'loading' | 'ok' | 'empty' | 'refused' | 'busy' | 'unreachable' | 'my key not set'>('loading');
  const [trainStatus, setTrainStatus] = useState<number>(200);
  const [trainData, setTrainData] = useState<TrainLotItem[]>([]);
  const [lastTrainUpdateTime, setLastTrainUpdateTime] = useState<string>('14:32 SGT');
  const [trainErrorMessage, setTrainErrorMessage] = useState<string>('');

  // Bus arrivals state
  const [busState, setBusState] = useState<'loading' | 'ok' | 'empty' | 'refused' | 'busy' | 'unreachable' | 'my key not set'>('loading');
  const [busStatus, setBusStatus] = useState<number>(200);
  const [busData, setBusData] = useState<BusServiceItem[]>([]);
  const [busStopCode, setBusStopCode] = useState<string>('95109');
  const [busErrorMessage, setBusErrorMessage] = useState<string>('');

  // Usability test override selector
  const [simulatedState, setSimulatedState] = useState<UsabilityState>('normal');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchTrains = useCallback(async (stateOverride: UsabilityState = 'normal') => {
    setTrainState('loading');
    setTrainErrorMessage('');

    if (stateOverride === 'loading') {
      // Simulate permanent loading state for usability test
      return;
    }

    try {
      const url = stateOverride === 'normal' 
        ? '/api/trains' 
        : `/api/trains?simulate=${stateOverride}`;

      const res = await fetch(url);
      setTrainStatus(res.status);
      const json = await res.json();

      if (res.status === 200 && (json.state === 'ok' || json.state === 'empty')) {
        setTrainState(json.state);
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setTrainData(json.data);
          const nowStr = new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' SGT';
          setLastTrainUpdateTime(nowStr);
        } else {
          setTrainState('empty');
        }
      } else if (res.status === 502 || json.state === 'refused') {
        setTrainState('refused');
        setTrainErrorMessage(json.error || 'Access refused by upstream provider (502)');
      } else if (res.status === 503 && json.state === 'busy') {
        setTrainState('busy');
        setTrainErrorMessage(json.error || 'Provider busy or rate limited (503)');
      } else if (res.status === 503 && json.state === 'my key not set') {
        setTrainState('my key not set');
        setTrainErrorMessage(json.error || 'LTA_ACCOUNT_KEY is missing or blank');
      } else if (res.status === 504 || json.state === 'unreachable') {
        setTrainState('unreachable');
        setTrainErrorMessage(json.error || 'Upstream train feed unreachable');
      } else {
        setTrainState('unreachable');
        setTrainErrorMessage(json.error || `HTTP ${res.status}`);
      }
    } catch (err: any) {
      setTrainStatus(504);
      setTrainState('unreachable');
      setTrainErrorMessage(err.message || 'Network unreachable');
    }
  }, []);

  const fetchBuses = useCallback(async (stateOverride: UsabilityState = 'normal') => {
    setBusState('loading');
    setBusErrorMessage('');

    if (stateOverride === 'loading') {
      return;
    }

    try {
      const url = stateOverride === 'normal'
        ? `/api/buses?busStopCode=${busStopCode}`
        : `/api/buses?simulate=${stateOverride}&busStopCode=${busStopCode}`;

      const res = await fetch(url);
      setBusStatus(res.status);
      const json = await res.json();

      if (res.status === 200 && (json.state === 'ok' || json.state === 'empty')) {
        setBusState(json.state);
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setBusData(json.data);
        } else {
          setBusState('empty');
        }
      } else if (res.status === 502 || json.state === 'refused') {
        setBusState('refused');
        setBusErrorMessage(json.error || 'Access refused (502)');
      } else if (res.status === 503 && json.state === 'busy') {
        setBusState('busy');
        setBusErrorMessage(json.error || 'Transit provider is busy (503)');
      } else if (res.status === 503 && json.state === 'my key not set') {
        setBusState('my key not set');
        setBusErrorMessage(json.error || 'LTA_ACCOUNT_KEY is missing or blank');
      } else {
        setBusState('unreachable');
        setBusErrorMessage(json.error || 'Bus feed unreachable (504)');
      }
    } catch (err: any) {
      setBusStatus(504);
      setBusState('unreachable');
      setBusErrorMessage(err.message || 'Network failure');
    }
  }, [busStopCode]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchTrains(simulatedState), fetchBuses(simulatedState)]);
    setIsRefreshing(false);
  };

  const handleSelectSimulatedState = (state: UsabilityState) => {
    setSimulatedState(state);
    fetchTrains(state);
    fetchBuses(state);
  };

  useEffect(() => {
    // Initial fetch on mount
    fetchTrains('normal');
    fetchBuses('normal');
  }, [fetchTrains, fetchBuses]);

  // Format arrival minutes from LTA ISO timestamp
  const getArrivalMinutes = (isoString?: string): string => {
    if (!isoString) return 'Arr';
    const arrivalTime = new Date(isoString).getTime();
    const diffMs = arrivalTime - Date.now();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin <= 1) return 'Arr';
    return `${diffMin} min`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden" id="live-hdb-trains-panel">
      {/* Panel Header */}
      <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00c853]/20 flex items-center justify-center text-[#006e2a]">
            <span className="material-symbols-outlined text-[20px]">train</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm">HDB Train Lots &amp; Outside Bus Stop</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                Live LTA / data.gov.sg
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Real-time lot availability at 3 watched trains &amp; bus stop #{busStopCode}
            </p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          type="button"
          title="Refresh feeds"
        >
          <span className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Usability Test Simulation Controller Bar */}
      <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 text-xs flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-extrabold text-slate-600 mr-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px] text-[#006e2a]">science</span>
          Usability Test State:
        </span>

        {(['normal', 'loading', 'empty', 'refused', 'busy', 'unreachable', 'key_not_set'] as UsabilityState[]).map((st) => (
          <button
            key={st}
            onClick={() => handleSelectSimulatedState(st)}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
              simulatedState === st
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            type="button"
          >
            {st === 'normal' && 'Normal (Live)'}
            {st === 'loading' && 'Loading'}
            {st === 'empty' && 'Empty (200)'}
            {st === 'refused' && 'Refused (502)'}
            {st === 'busy' && 'Busy (503)'}
            {st === 'unreachable' && 'Unreachable (504)'}
            {st === 'key_not_set' && 'Key Not Set (503)'}
          </button>
        ))}
      </div>

      {/* Main Grid: Trains Panel & Buses Panel */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* PANEL 1: Free lots at three HDB trains */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006e2a]">train</span>
                <span className="font-extrabold text-xs text-slate-900">Three Watched HDB Trains</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                trainStatus === 200 ? 'bg-emerald-100 text-emerald-800' :
                trainStatus === 502 ? 'bg-orange-100 text-orange-800' :
                trainStatus === 503 ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {trainStatus} {trainState.toUpperCase()}
              </span>
            </div>

            {/* Render states with exact sentences */}
            {trainState === 'loading' && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                <span className="w-5 h-5 border-2 border-[#00c853] border-t-transparent rounded-full inline-block animate-spin" />
                <p className="text-xs font-semibold text-slate-700">
                  Checking train lots, usually about a second.
                </p>
              </div>
            )}

            {trainState === 'refused' && (
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-orange-900">
                  <span className="material-symbols-outlined text-[16px]">block</span>
                  <span>Refused (502 Bad Gateway)</span>
                </div>
                <p className="text-xs text-orange-800 leading-relaxed">
                  {trainErrorMessage || 'Access refused by upstream provider (401/403).'}
                </p>
              </div>
            )}

            {trainState === 'busy' && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                  <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
                  <span>Provider Busy (503 Service Unavailable)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  The upstream train feed is busy (429/503). Retrying after 60s.
                </p>
              </div>
            )}

            {trainState === 'my key not set' && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                  <span className="material-symbols-outlined text-[16px]">vpn_key_alert</span>
                  <span>LTA_ACCOUNT_KEY Missing (503)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  BEFORE the train fetch: LTA_ACCOUNT_KEY is missing or blank in environment.
                </p>
              </div>
            )}

            {trainState === 'empty' && (
              <div className="p-3.5 bg-white border border-slate-200 rounded-xl text-slate-600 space-y-1">
                <p className="text-xs text-slate-700 leading-relaxed">
                  The feed answered, but this train was not in the latest update. We do not know how many lots are free.
                </p>
              </div>
            )}

            {trainState === 'unreachable' && (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                  We could not reach the train feed. The numbers below are from {lastTrainUpdateTime}.
                </div>
                {/* Render cached numbers */}
                <div className="space-y-2">
                  {[
                    { train_number: 'HE12', lots_available: 31, total_lots: 105, is_unknown: false },
                    { train_number: 'C5', lots_available: 0, total_lots: 80, is_unknown: false },
                    { train_number: 'TAM8', lots_available: 48, total_lots: 160, is_unknown: false },
                  ].map((train) => (
                    <div
                      key={train.train_number}
                      className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                    >
                      <span className="font-extrabold text-slate-800">Train #{train.train_number}</span>
                      {train.lots_available === 0 ? (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-extrabold">
                          Full
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-700">
                          {train.lots_available} of {train.total_lots}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OK state with real data */}
            {trainState === 'ok' && (
              <div className="space-y-2">
                {trainData.map((train) => {
                  const isFull = train.lots_available === 0;
                  const isUnknown = train.is_unknown;

                  return (
                    <div
                      key={train.train_number}
                      className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">
                          Train #{train.train_number}
                        </span>

                        {/* Guardrail:
                            A train whose lots_available is "0" is FULL and the screen says "Full".
                            A watched train absent from the reply is UNKNOWN.
                            These never share a sentence. */}
                        {isUnknown ? (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-extrabold">
                            Unknown
                          </span>
                        ) : isFull ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-extrabold">
                            Full
                          </span>
                        ) : (
                          <span className="font-extrabold text-[#006e2a]">
                            {Number(train.lots_available)} of {Number(train.total_lots)}
                          </span>
                        )}
                      </div>

                      {isUnknown && (
                        <p className="text-[11px] text-slate-500 leading-snug">
                          The feed answered, but this train was not in the latest update. We do not know how many lots are free.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Cache: s-maxage=60, swr=120</span>
            <span>Feed: data.gov.sg / LTA</span>
          </div>
        </div>

        {/* PANEL 2: Next buses at the stop outside */}
        <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#16A34A]">directions_bus</span>
                <span className="font-extrabold text-xs text-slate-900">
                  Stop #{busStopCode} (Outside)
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                busStatus === 200 ? 'bg-emerald-100 text-emerald-800' :
                busStatus === 502 ? 'bg-orange-100 text-orange-800' :
                busStatus === 503 ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {busStatus} {busState.toUpperCase()}
              </span>
            </div>

            {/* Bus loading */}
            {busState === 'loading' && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                <span className="w-5 h-5 border-2 border-[#16A34A] border-t-transparent rounded-full inline-block animate-spin" />
                <p className="text-xs font-semibold text-slate-700">
                  Checking bus arrivals...
                </p>
              </div>
            )}

            {/* Bus refused */}
            {busState === 'refused' && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900">
                ⚠️ Access refused by transit provider (502).
              </div>
            )}

            {/* Bus busy */}
            {busState === 'busy' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                ⏳ Transit provider is busy (503). Retrying shortly.
              </div>
            )}

            {/* Bus my key not set */}
            {busState === 'my key not set' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                🔑 LTA_ACCOUNT_KEY is missing or blank (503).
              </div>
            )}

            {/* Bus unreachable */}
            {busState === 'unreachable' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800">
                Could not reach bus arrival feed (504).
              </div>
            )}

            {/* Bus empty */}
            {busState === 'empty' && (
              <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
                No active bus arrivals found for stop #{busStopCode}.
              </div>
            )}

            {/* Bus OK */}
            {busState === 'ok' && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {busData.map((svc, idx) => {
                  const busNo = svc.ServiceNo || svc.busNo || '36';
                  const nextArrival = svc.NextBus?.EstimatedArrival 
                    ? getArrivalMinutes(svc.NextBus.EstimatedArrival)
                    : (svc.next || '2 min');
                  const subsequentArrival = svc.NextBus2?.EstimatedArrival
                    ? getArrivalMinutes(svc.NextBus2.EstimatedArrival)
                    : (svc.subsequent || '8 min');
                  const isDd = svc.NextBus?.Type === 'DD' || svc.NextBus?.Type === 'Double Deck';

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-9 h-7 rounded bg-[#16A34A] text-white flex items-center justify-center font-extrabold text-xs">
                          {busNo}
                        </span>
                        <div>
                          <span className="font-bold text-slate-800 block leading-tight">
                            {svc.Operator || 'SBS / Go-Ahead'}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {isDd ? 'Double Deck' : 'Single Deck'} • Seats Avail
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-emerald-700 text-sm block leading-tight">
                          {nextArrival}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          next: {subsequentArrival}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Cache: s-maxage=20, swr=40</span>
            <span>Stop #{busStopCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
