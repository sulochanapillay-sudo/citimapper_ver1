import React, { useState } from 'react';
import { CommuteOption, TransitLineCode, TransitStation } from '../types';
import { MRT_LINE_STATUSES, COMMUTE_OPTIONS, POPULAR_LOCATIONS } from '../data/transitData';
import { LiveHdbTrainsAndBusesPanel } from './LiveHdbTrainsAndBusesPanel';

interface JourneyPlannerProps {
  activeRoute: CommuteOption | null;
  onSelectRoute: (route: CommuteOption) => void;
  selectedLineFilter: TransitLineCode | 'ALL';
  onSelectLineFilter: (line: TransitLineCode | 'ALL') => void;
  onOpenCityModal: () => void;
  onOpenOptionsModal: () => void;
  onOpenAppModal: () => void;
  originInput: string;
  setOriginInput: (val: string) => void;
  destInput: string;
  setDestInput: (val: string) => void;
  selectedTransportMode: 'all' | 'mrt' | 'bus' | 'walk' | 'cycle' | 'cab';
  setSelectedTransportMode: (mode: 'all' | 'mrt' | 'bus' | 'walk' | 'cycle' | 'cab') => void;
  onSelectStationModal: (stationName: string) => void;
}

export const JourneyPlanner: React.FC<JourneyPlannerProps> = ({
  activeRoute,
  onSelectRoute,
  selectedLineFilter,
  onSelectLineFilter,
  onOpenCityModal,
  onOpenOptionsModal,
  onOpenAppModal,
  originInput,
  setOriginInput,
  destInput,
  setDestInput,
  selectedTransportMode,
  setSelectedTransportMode,
  onSelectStationModal,
}) => {
  const [departMode, setDepartMode] = useState<'now' | 'arrive'>('now');
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState<'origin' | 'dest' | null>(null);

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = originInput;
    setOriginInput(destInput);
    setDestInput(temp);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleApplyShortcut = (name: string) => {
    setDestInput(name);
  };

  const filteredRoutes = COMMUTE_OPTIONS.filter((route) => {
    if (selectedTransportMode === 'all') return true;
    if (selectedTransportMode === 'mrt') return route.mode === 'mrt';
    if (selectedTransportMode === 'bus') return route.mode === 'bus';
    if (selectedTransportMode === 'cab') return route.mode === 'cab';
    if (selectedTransportMode === 'cycle') return route.mode === 'cycle';
    if (selectedTransportMode === 'walk') return route.mode === 'mrt' || route.mode === 'bus';
    return true;
  });

  return (
    <aside
      className="w-full lg:w-[450px] xl:w-[470px] h-full flex flex-col flex-shrink-0 bg-white z-20 shadow-xl overflow-y-auto border-r border-slate-200"
      id="journey-planner-sidebar"
    >
      {/* Top Brand Sub-Header & City Badge */}
      <div className="p-4 lg:p-5 bg-white flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00c853]/15 flex items-center justify-center text-[#006e2a]">
            <span className="material-symbols-outlined text-[24px]">explore</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-slate-900">Singapore</span>
              <span className="text-sm">🇸🇬</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00c853]/15 text-[#004c1b] text-[10px] font-extrabold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00c853] animate-pulse" />
                LIVE LTA
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Real-time islandwide network</p>
          </div>
        </div>

        <button
          onClick={onOpenCityModal}
          className="px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors text-xs font-bold text-slate-700 flex items-center gap-1 shadow-xs border border-blue-100"
          type="button"
          id="switch-city-btn"
        >
          <span>Switch City</span>
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
        </button>
      </div>

      {/* Main Journey Planner Card */}
      <div className="px-4 lg:px-5 pt-4 pb-3">
        <div className="bg-[#eff4ff] rounded-2xl p-4 shadow-xs border border-blue-100/70">
          {/* Mode / Departure Timing Selector */}
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Get Me Somewhere
            </span>
            <div className="inline-flex items-center p-0.5 rounded-full bg-[#dce9ff] text-slate-700 text-xs">
              <button
                onClick={() => setDepartMode('now')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  departMode === 'now'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Depart Now
              </button>
              <button
                onClick={() => setDepartMode('arrive')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  departMode === 'arrive'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                type="button"
              >
                Arrive By
              </button>
            </div>
          </div>

          {/* Dual Input Matrix with Connected Track */}
          <div className="relative bg-white rounded-xl p-3 shadow-sm mb-3 border border-slate-100">
            <div className="flex items-stretch gap-3">
              {/* Timeline indicator dots */}
              <div className="flex flex-col items-center justify-between py-2 px-0.5 flex-shrink-0">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#00c853] bg-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00c853]" />
                </div>
                <div className="w-0.5 h-7 border-l-2 border-dashed border-slate-300 my-1" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#D42E12] flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[10px]">location_on</span>
                </div>
              </div>

              {/* Input Fields */}
              <div className="flex-1 flex flex-col justify-between gap-2 min-w-0">
                <div className="flex items-center justify-between relative">
                  <input
                    id="startInput"
                    type="text"
                    value={originInput}
                    onChange={(e) => setOriginInput(e.target.value)}
                    onFocus={() => setShowLocationSuggestions('origin')}
                    placeholder="Choose starting point"
                    className="w-full text-sm font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => {
                      setOriginInput('Current Location (GPS)');
                      setShowLocationSuggestions(null);
                    }}
                    title="Use GPS"
                    type="button"
                    className="text-slate-400 hover:text-[#006e2a] transition-colors p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">my_location</span>
                  </button>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center justify-between relative">
                  <input
                    id="endInput"
                    type="text"
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    onFocus={() => setShowLocationSuggestions('dest')}
                    placeholder="Choose destination"
                    className="w-full text-sm font-medium text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                  />
                  {destInput && (
                    <button
                      onClick={() => setDestInput('')}
                      type="button"
                      className="text-slate-400 hover:text-slate-700 transition-colors p-1"
                      title="Clear destination"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center flex-shrink-0">
                <button
                  id="swapBtn"
                  onClick={handleSwap}
                  type="button"
                  title="Swap locations"
                  className={`w-8 h-8 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-slate-700 flex items-center justify-center transition-transform ${
                    isSwapping ? 'rotate-180 duration-300' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">swap_vert</span>
                </button>
              </div>
            </div>

            {/* Quick Autocomplete Suggestions Dropdown if opened */}
            {showLocationSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 space-y-1">
                <div className="text-[10px] font-extrabold text-slate-400 px-2 py-1 uppercase">
                  Suggested Locations
                </div>
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      if (showLocationSuggestions === 'origin') setOriginInput(loc.name);
                      else setDestInput(loc.name);
                      setShowLocationSuggestions(null);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#eff4ff] flex items-center justify-between text-xs text-slate-800"
                    type="button"
                  >
                    <span className="font-medium">{loc.name}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold">
                      {loc.code}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setShowLocationSuggestions(null)}
                  className="w-full text-center text-[11px] text-slate-400 hover:text-slate-700 pt-1"
                  type="button"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Quick Shortcuts (Home, Work, Starred) */}
          <div className="flex items-center gap-1.5 mb-3.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => handleApplyShortcut('Home (Bishan MRT)')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors flex-shrink-0 border border-slate-200/80 shadow-2xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px] text-slate-500">home</span>
              Home
            </button>
            <button
              onClick={() => handleApplyShortcut('Raffles Place')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors flex-shrink-0 border border-slate-200/80 shadow-2xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px] text-slate-500">work</span>
              Raffles Place
            </button>
            <button
              onClick={() => handleApplyShortcut('Orchard ION')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors flex-shrink-0 border border-slate-200/80 shadow-2xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px] text-amber-500">star</span>
              Orchard ION
            </button>
            <button
              onClick={() => handleApplyShortcut('Sentosa')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors flex-shrink-0 border border-slate-200/80 shadow-2xs"
              type="button"
            >
              <span className="material-symbols-outlined text-[14px] text-emerald-600">park</span>
              Sentosa
            </button>
          </div>

          {/* Energetic Action Bar: Prominent Green GET ROUTES button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (filteredRoutes.length > 0) {
                  onSelectRoute(filteredRoutes[0]);
                }
              }}
              className="flex-1 h-12 rounded-full bg-[#00c853] hover:bg-[#00E676] text-[#004c1b] font-extrabold text-sm sm:text-base tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group active:scale-98"
              type="button"
              id="get-routes-btn"
            >
              <span>GET ROUTES</span>
              <span className="material-symbols-outlined text-[22px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            <button
              onClick={onOpenOptionsModal}
              title="Route options & filters"
              type="button"
              className="h-12 w-12 rounded-full bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-xs"
              id="route-tune-btn"
            >
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </button>
          </div>

          {/* Transport Mode Toggles */}
          <div className="grid grid-cols-5 gap-1.5 mt-3 pt-1">
            <button
              onClick={() => setSelectedTransportMode(selectedTransportMode === 'mrt' ? 'all' : 'mrt')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                selectedTransportMode === 'mrt'
                  ? 'bg-white ring-2 ring-[#006e2a] shadow-sm'
                  : 'bg-white/80 hover:bg-white shadow-2xs'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[#006e2a] text-[20px]">train</span>
              <span className="text-[11px] font-bold text-slate-800 mt-0.5">MRT</span>
            </button>

            <button
              onClick={() => setSelectedTransportMode(selectedTransportMode === 'bus' ? 'all' : 'bus')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                selectedTransportMode === 'bus'
                  ? 'bg-white ring-2 ring-[#16A34A] shadow-sm'
                  : 'bg-white/80 hover:bg-white shadow-2xs'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[#16A34A] text-[20px]">directions_bus</span>
              <span className="text-[11px] font-bold text-slate-800 mt-0.5">Bus</span>
            </button>

            <button
              onClick={() => setSelectedTransportMode(selectedTransportMode === 'walk' ? 'all' : 'walk')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                selectedTransportMode === 'walk'
                  ? 'bg-white ring-2 ring-slate-700 shadow-sm'
                  : 'bg-white/80 hover:bg-white shadow-2xs'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-slate-600 text-[20px]">directions_walk</span>
              <span className="text-[11px] font-bold text-slate-800 mt-0.5">Walk</span>
            </button>

            <button
              onClick={() => setSelectedTransportMode(selectedTransportMode === 'cycle' ? 'all' : 'cycle')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                selectedTransportMode === 'cycle'
                  ? 'bg-white ring-2 ring-[#006c49] shadow-sm'
                  : 'bg-white/80 hover:bg-white shadow-2xs'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[#006c49] text-[20px]">pedal_bike</span>
              <span className="text-[11px] font-bold text-slate-800 mt-0.5">Cycle</span>
            </button>

            <button
              onClick={() => setSelectedTransportMode(selectedTransportMode === 'cab' ? 'all' : 'cab')}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                selectedTransportMode === 'cab'
                  ? 'bg-white ring-2 ring-[#F59E0B] shadow-sm'
                  : 'bg-white/80 hover:bg-white shadow-2xs'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[#F59E0B] text-[20px]">local_taxi</span>
              <span className="text-[11px] font-bold text-slate-800 mt-0.5">Cab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Singapore MRT Network Lines Status */}
      <div className="px-4 lg:px-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[15px] font-extrabold text-slate-900">MRT &amp; LRT Line Status</span>
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-ping" />
          </div>
          <span className="text-xs font-semibold text-slate-400">Updated 1m ago</span>
        </div>

        <div className="space-y-1.5">
          {MRT_LINE_STATUSES.map((line) => {
            const isSelected = selectedLineFilter === line.code;
            return (
              <div
                key={line.code}
                onClick={() => {
                  onSelectLineFilter(isSelected ? 'ALL' : line.code);
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                  line.statusType === 'delay'
                    ? 'bg-amber-50 hover:bg-amber-100/70 border border-amber-200'
                    : isSelected
                    ? 'bg-[#e5eeff] border border-blue-200'
                    : 'bg-[#eff4ff] hover:bg-[#e5eeff] border border-transparent'
                }`}
                title={`Filter by ${line.name}`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-extrabold text-white shadow-xs"
                    style={{ backgroundColor: line.color }}
                  >
                    {line.code}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-900">{line.name}</span>
                    {line.details && (
                      <span className="block text-[11px] text-[#EF4444] font-medium">
                        {line.details}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {line.statusType === 'delay' ? (
                    <div className="flex items-center gap-1 text-[#F59E0B]">
                      <span className="material-symbols-outlined text-[16px]">warning</span>
                      <span className="text-xs font-bold">{line.status}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[#006c49]">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span className="text-xs font-bold">{line.status}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Free Lots at Three HDB Trains & Next Buses (Serverless Feed) */}
      <div className="px-4 lg:px-5 mb-4">
        <LiveHdbTrainsAndBusesPanel />
      </div>

      {/* Suggested Route Cards Section */}
      <div className="px-4 lg:px-5 pb-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[15px] font-extrabold text-slate-900">Suggested Commutes</span>
          <button
            onClick={() => setSelectedTransportMode('all')}
            className="text-xs text-[#006e2a] font-bold hover:underline"
            type="button"
          >
            Compare All
          </button>
        </div>

        <div className="space-y-2.5">
          {filteredRoutes.map((route) => {
            const isActive = activeRoute?.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => onSelectRoute(route)}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer shadow-xs relative overflow-hidden border ${
                  isActive
                    ? 'bg-white border-[#00c853] ring-1 ring-[#00c853]'
                    : 'bg-[#eff4ff] hover:bg-[#e5eeff] border-blue-100/60'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00c853]" />
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-extrabold text-slate-900">
                        {route.durationMin} min
                      </span>
                      {route.tag && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            route.tagType === 'fastest'
                              ? 'bg-[#00c853]/20 text-[#004c1b]'
                              : route.tagType === 'fewest'
                              ? 'bg-[#dae2fd] text-[#5c647a]'
                              : route.tagType === 'eco'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {route.tag}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">
                      Depart {route.departureTime} • Arrive {route.arrivalTime} • {route.fare}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[11px] font-bold flex items-center gap-1 justify-end ${
                        route.crowdType === 'low'
                          ? 'text-emerald-700'
                          : route.crowdType === 'moderate'
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          route.crowdType === 'low'
                            ? 'bg-[#00E676]'
                            : route.crowdType === 'moderate'
                            ? 'bg-[#F59E0B]'
                            : 'bg-red-500'
                        }`}
                      />
                      {route.crowdLevel}
                    </span>
                    <span className="text-xs text-slate-500">{route.frequency}</span>
                  </div>
                </div>

                {/* Transit Badges Chain */}
                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-200/50 overflow-x-auto scrollbar-none">
                  {route.id === 'route-fastest' && (
                    <>
                      <span className="flex items-center gap-0.5 text-xs text-slate-600 bg-white px-1.5 py-0.5 rounded font-medium border border-slate-100">
                        <span className="material-symbols-outlined text-[14px]">directions_walk</span> 4m
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        arrow_forward
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-extrabold text-white bg-[#009530] shadow-xs">
                        EW Changi
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        arrow_forward
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-extrabold text-white bg-[#005EC4] shadow-xs">
                        DT Bayfront
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        arrow_forward
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-slate-600 bg-white px-1.5 py-0.5 rounded font-medium border border-slate-100">
                        <span className="material-symbols-outlined text-[14px]">directions_walk</span> 2m
                      </span>
                    </>
                  )}

                  {route.id === 'route-fewest' && (
                    <>
                      <span className="flex items-center gap-0.5 text-xs text-slate-600 bg-white px-1.5 py-0.5 rounded font-medium border border-slate-100">
                        <span className="material-symbols-outlined text-[14px]">directions_walk</span> 3m
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        arrow_forward
                      </span>
                      <span className="px-2.5 py-0.5 rounded text-xs font-extrabold text-white bg-[#16A34A] shadow-xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">directions_bus</span> 36
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-slate-400">
                        arrow_forward
                      </span>
                      <span className="flex items-center gap-0.5 text-xs text-slate-600 bg-white px-1.5 py-0.5 rounded font-medium border border-slate-100">
                        <span className="material-symbols-outlined text-[14px]">directions_walk</span> 5m
                      </span>
                    </>
                  )}

                  {route.id === 'route-cab' && (
                    <>
                      <span className="flex items-center gap-1 text-xs text-slate-700 bg-white px-2 py-0.5 rounded font-semibold border border-slate-100">
                        <span className="material-symbols-outlined text-[15px] text-amber-500">local_taxi</span>
                        Direct Express via ECP
                      </span>
                    </>
                  )}

                  {route.id === 'route-cycle' && (
                    <>
                      <span className="flex items-center gap-1 text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                        <span className="material-symbols-outlined text-[15px]">pedal_bike</span>
                        Coastal Park Connector Network (19.4 km)
                      </span>
                    </>
                  )}
                </div>

                {/* Step by Step Expansion for Active Route */}
                {isActive && (
                  <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Turn-by-Turn Journey
                    </div>
                    {route.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px] ${
                            step.type === 'walk'
                              ? 'bg-slate-400'
                              : step.type === 'mrt'
                              ? step.line === 'EW'
                                ? 'bg-[#009530]'
                                : 'bg-[#005EC4]'
                              : step.type === 'bus'
                              ? 'bg-[#16A34A]'
                              : 'bg-amber-500'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">{step.instruction}</p>
                          <span className="text-[11px] text-slate-500">
                            {step.durationMin} mins {step.platform ? `• ${step.platform}` : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* App Download Showcase Banner */}
      <div className="p-4 lg:p-5 mt-auto bg-[#e5eeff] border-t border-blue-100">
        <div
          onClick={onOpenAppModal}
          className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3.5 cursor-pointer hover:shadow-md transition-shadow border border-blue-100/80 group"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#00c853]/20 flex-shrink-0 flex items-center justify-center text-[#006e2a] group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[32px]">qr_code_2</span>
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-extrabold text-slate-900 block truncate">
              Citymapper Mobile App
            </span>
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">
              Live step-by-step turnouts &amp; lockscreen MRT notifications.
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs text-[#006e2a] font-bold">iOS • Android</span>
              <span className="text-xs text-slate-500">• 4.8 ★ (120k+ reviews)</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
