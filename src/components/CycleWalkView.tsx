import React from 'react';
import { PCN_ROUTES } from '../data/transitData';

export const CycleWalkView: React.FC = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-4 lg:p-8" id="cycle-walk-view">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">
                Singapore Park Connector Network (PCN) &amp; Walking
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold">
                300+ km Connected Trails
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Dedicated bicycle highways, scenic coastal corridors, and sheltered urban walk paths
            </p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold border border-emerald-200">
            <span className="material-symbols-outlined text-[16px]">wb_sunny</span>
            <span>Current Weather: 31°C • Fair</span>
          </div>
        </div>

        {/* Featured Green Trails */}
        <div className="space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49]">pedal_bike</span>
            Popular Cycling Corridors
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PCN_ROUTES.map((route) => (
              <div
                key={route.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {route.difficulty}
                    </span>
                    <span className="text-xs font-bold text-slate-700">{route.distance}</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-2">{route.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{route.scenery}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>⏱️ {route.duration}</span>
                  <span>💧 {route.waterPoints} Water Points</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bike Sharing and Sheltered Walking Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-[#006e2a]">directions_bike</span>
              Bike-Sharing Availability
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Unlock geofenced public shared bikes across MRT stations, parks, and downtown attractions.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800">Anywheel (Islandwide)</span>
                <span className="text-emerald-700 font-bold">12,000+ Active Bikes</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-800">SG Bike Stations</span>
                <span className="text-emerald-700 font-bold">Designated Parking Hubs</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-blue-600">umbrella</span>
              Covered Walkways &amp; Underpasses
            </h3>
            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
              Singapore features over 200km of sheltered linkways connecting MRT stations directly to residential estates and shopping malls.
            </p>
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-xs text-blue-900 leading-relaxed font-medium">
              💡 Tip: The Marina Bay Underground Pedestrian Network (UPN) connects Bayfront, Downtown, Raffles Place, and Marina Bay stations entirely in air-conditioned comfort.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
