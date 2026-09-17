import React, { useState } from 'react';
import { LIVE_BUS_ARRIVALS, STATIONS } from '../data/transitData';
import { TransitStation } from '../types';
import { LiveHdbTrainsAndBusesPanel } from './LiveHdbTrainsAndBusesPanel';

interface LiveTransitViewProps {
  onSelectStation: (station: TransitStation) => void;
}

export const LiveTransitView: React.FC<LiveTransitViewProps> = ({ onSelectStation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'mrt' | 'bus'>('all');

  const filteredBusStops = LIVE_BUS_ARRIVALS.filter(
    (stop) =>
      stop.stopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stop.stopCode.includes(searchQuery)
  );

  const filteredStations = STATIONS.filter(
    (stn) =>
      stn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stn.code && stn.code.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-4 lg:p-8" id="live-transit-view">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Singapore Live Transit Board</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00c853]/15 text-[#004c1b] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00c853] animate-ping" />
                Live LTA Sync
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Real-time countdowns for MRT trains and public bus arrivals across Singapore
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              type="button"
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter('mrt')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedFilter === 'mrt'
                  ? 'bg-[#006e2a] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              type="button"
            >
              MRT Stations
            </button>
            <button
              onClick={() => setSelectedFilter('bus')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                selectedFilter === 'bus'
                  ? 'bg-[#16A34A] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              type="button"
            >
              Bus Stops
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by MRT station name, bus stop code, or service number..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00c853] text-sm text-slate-900 shadow-xs"
          />
        </div>

        {/* Live Serverless Feed Panel: Free Lots at Three HDB Trains & Next Buses Outside */}
        <LiveHdbTrainsAndBusesPanel />

        {/* MRT Station Departures */}
        {(selectedFilter === 'all' || selectedFilter === 'mrt') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006e2a]">train</span>
                MRT Station Live Departures
              </h2>
              <span className="text-xs text-slate-500 font-medium">Auto-refreshes every 15s</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStations.map((station) => (
                <div
                  key={station.id}
                  onClick={() => onSelectStation(station)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:border-[#00c853] hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{station.name}</h3>
                      <span className="text-xs font-semibold text-slate-500">
                        Station Code: {station.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {station.lines.map((ln) => (
                        <span
                          key={ln}
                          className="px-2 py-0.5 rounded text-[11px] font-extrabold text-white"
                          style={{
                            backgroundColor:
                              ln === 'NS'
                                ? '#D42E12'
                                : ln === 'EW'
                                ? '#009530'
                                : ln === 'DT'
                                ? '#005EC4'
                                : ln === 'CC'
                                ? '#FA9E0D'
                                : ln === 'NE'
                                ? '#8F4199'
                                : '#9D5B25',
                          }}
                        >
                          {ln}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    {station.nextTrains?.map((train, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-xl"
                      >
                        <span className="font-medium text-slate-700 truncate max-w-[200px]">
                          {train.direction}
                        </span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="px-2 py-0.5 rounded bg-[#00c853]/20 text-[#004c1b] font-extrabold">
                            {train.next}
                          </span>
                          <span className="text-slate-400 font-semibold">{train.subsequent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bus Stop Departures */}
        {(selectedFilter === 'all' || selectedFilter === 'bus') && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#16A34A]">directions_bus</span>
                Key Bus Stop Live Arrivals
              </h2>
              <span className="text-xs text-slate-500 font-medium">LTA Datamall v3 Feed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBusStops.map((stop) => (
                <div
                  key={stop.stopCode}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{stop.stopName}</h3>
                      <span className="text-xs text-slate-500">Stop #{stop.stopCode}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-xs">
                      {stop.services.length} services
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {stop.services.map((svc) => (
                      <div
                        key={svc.busNo}
                        className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-1 rounded bg-[#16A34A] text-white font-extrabold text-xs">
                            {svc.busNo}
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{svc.destination}</p>
                            <span className="text-[10px] text-slate-500">
                              {svc.type} • {svc.load}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="font-extrabold text-[#006e2a] text-sm block">
                            {svc.next}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            subseq {svc.subsequent}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
