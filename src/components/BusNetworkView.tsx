import React, { useState } from 'react';
import { BUS_ROUTES } from '../data/transitData';

export const BusNetworkView: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState<string>('36');

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-4 lg:p-8" id="bus-network-view">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">Singapore Bus Network Explorer</h1>
              <span className="px-2 py-0.5 rounded-full bg-[#16A34A]/15 text-[#16A34A] text-xs font-extrabold">
                SBS • SMRT • Tower Transit • Go-Ahead
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Live fleet tracking, express routes, and real-time interval monitoring
            </p>
          </div>
        </div>

        {/* Bus Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BUS_ROUTES.map((bus) => (
            <div
              key={bus.number}
              onClick={() => setSelectedBus(bus.number)}
              className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer ${
                selectedBus === bus.number
                  ? 'border-[#16A34A] ring-2 ring-[#16A34A]/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-10 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
                    {bus.number}
                  </span>
                  <div>
                    <h2 className="font-extrabold text-slate-900 text-sm leading-snug">{bus.name}</h2>
                    <span className="text-xs text-slate-500 font-medium">{bus.operator}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold">
                  {bus.frequency}
                </span>
              </div>

              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Origin / Destination:</span>
                  <span className="font-semibold text-slate-800">{bus.origin} ➔ {bus.destination}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400">Live Active Fleet:</span>
                  <span className="font-bold text-[#006e2a] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                    {bus.liveFleetCount} Buses En Route
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Bus Fleet Guidance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#16A34A]">info</span>
            Singapore Public Bus Fleet Guidelines
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Double Deck (DD)</span>
              <p className="text-slate-500 leading-relaxed">
                Higher passenger capacity. Real-time upper deck seat availability displayed on board.
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">Wheelchair Accessible (WAB)</span>
              <p className="text-slate-500 leading-relaxed">
                100% of public buses in Singapore are barrier-free with deployable boarding ramps.
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-900 block mb-1">EZ-Link &amp; SimplyGo</span>
              <p className="text-slate-500 leading-relaxed">
                Tap in and tap out with contactless credit/debit cards or SimplyGo EZ-Link cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
