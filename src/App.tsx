import React, { useState } from 'react';
import { NavTab, TransitLineCode, CommuteOption, TransitStation } from './types';
import { COMMUTE_OPTIONS, CITIES } from './data/transitData';
import { Header } from './components/Header';
import { JourneyPlanner } from './components/JourneyPlanner';
import { InteractiveMap } from './components/InteractiveMap';
import { LiveTransitView } from './components/LiveTransitView';
import { MrtLinesView } from './components/MrtLinesView';
import { BusNetworkView } from './components/BusNetworkView';
import { CycleWalkView } from './components/CycleWalkView';
import {
  CitySwitcherModal,
  GetAppModal,
  RouteOptionsModal,
  StationDetailModal,
  SavedPlacesModal,
} from './components/Modals';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('directions');
  const [currentCityId, setCurrentCityId] = useState<string>('singapore');
  const [selectedLineFilter, setSelectedLineFilter] = useState<TransitLineCode | 'ALL'>('ALL');
  const [activeRoute, setActiveRoute] = useState<CommuteOption | null>(COMMUTE_OPTIONS[0]);
  const [originInput, setOriginInput] = useState<string>('Changi Airport T3');
  const [destInput, setDestInput] = useState<string>('Marina Bay Sands, Bayfront');
  const [selectedTransportMode, setSelectedTransportMode] = useState<
    'all' | 'mrt' | 'bus' | 'walk' | 'cycle' | 'cab'
  >('all');
  const [mapLayer, setMapLayer] = useState<'mrt' | 'bus' | 'pcn'>('mrt');

  // Modals state
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState<boolean>(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState<boolean>(false);
  const [isSavedPlacesOpen, setIsSavedPlacesOpen] = useState<boolean>(false);
  const [selectedStation, setSelectedStation] = useState<TransitStation | null>(null);

  // Route options filter states
  const [wheelchair, setWheelchair] = useState<boolean>(false);
  const [fewerTransfers, setFewerTransfers] = useState<boolean>(false);
  const [avoidBus, setAvoidBus] = useState<boolean>(false);

  const currentCity = CITIES.find((c) => c.id === currentCityId) || CITIES[0];

  const handleSelectStation = (station: TransitStation) => {
    setSelectedStation(station);
  };

  const handleSelectLineFromView = (lineCode: TransitLineCode) => {
    setSelectedLineFilter(lineCode);
    setActiveTab('directions');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f9ff] text-slate-900 font-sans selection:bg-[#00c853] selection:text-[#004c1b]">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenCityModal={() => setIsCityModalOpen(true)}
        onOpenAppModal={() => setIsAppModalOpen(true)}
        onOpenSavedPlaces={() => setIsSavedPlacesOpen(true)}
        currentCity={currentCity.name}
        currentCityFlag={currentCity.flag}
      />

      {/* Main Content Area */}
      <main className="w-full pt-16 flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
        {activeTab === 'directions' && (
          <div className="w-full h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-white">
            {/* Left Sidebar: Journey Planner, Line Status, Commutes */}
            <JourneyPlanner
              activeRoute={activeRoute}
              onSelectRoute={setActiveRoute}
              selectedLineFilter={selectedLineFilter}
              onSelectLineFilter={setSelectedLineFilter}
              onOpenCityModal={() => setIsCityModalOpen(true)}
              onOpenOptionsModal={() => setIsOptionsModalOpen(true)}
              onOpenAppModal={() => setIsAppModalOpen(true)}
              originInput={originInput}
              setOriginInput={setOriginInput}
              destInput={destInput}
              setDestInput={setDestInput}
              selectedTransportMode={selectedTransportMode}
              setSelectedTransportMode={setSelectedTransportMode}
              onSelectStationModal={(name) => {
                const found = {
                  id: name.toLowerCase().replace(/\s+/g, '-'),
                  name,
                  lines: ['EW', 'DT'] as TransitLineCode[],
                  cx: 645,
                  cy: 520,
                };
                setSelectedStation(found);
              }}
            />

            {/* Right Main Viewport: Interactive Singapore Transit Map */}
            <InteractiveMap
              selectedLineFilter={selectedLineFilter}
              onSelectLineFilter={setSelectedLineFilter}
              activeRoute={activeRoute}
              onSelectStation={handleSelectStation}
              mapLayer={mapLayer}
              onChangeMapLayer={setMapLayer}
              originStationName={originInput || 'Changi Airport T3'}
              destStationName={destInput || 'Marina Bay Sands, Bayfront'}
            />
          </div>
        )}

        {activeTab === 'live-transit' && (
          <LiveTransitView onSelectStation={handleSelectStation} />
        )}

        {activeTab === 'mrt-lrt-lines' && (
          <MrtLinesView onSelectLine={handleSelectLineFromView} />
        )}

        {activeTab === 'bus-network' && <BusNetworkView />}

        {activeTab === 'cycle-walk' && <CycleWalkView />}
      </main>

      {/* Footer (Always displayed on secondary views or bottom of page) */}
      {activeTab !== 'directions' && <Footer />}

      {/* City Switcher Modal */}
      <CitySwitcherModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
        currentCityId={currentCityId}
        onSelectCity={setCurrentCityId}
      />

      {/* Get the App QR Modal */}
      <GetAppModal isOpen={isAppModalOpen} onClose={() => setIsAppModalOpen(false)} />

      {/* Route Options Tuning Modal */}
      <RouteOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        wheelchair={wheelchair}
        setWheelchair={setWheelchair}
        fewerTransfers={fewerTransfers}
        setFewerTransfers={setFewerTransfers}
        avoidBus={avoidBus}
        setAvoidBus={setAvoidBus}
      />

      {/* Station Details Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
        onSetAsOrigin={(name) => {
          setOriginInput(name);
          setActiveTab('directions');
        }}
        onSetAsDest={(name) => {
          setDestInput(name);
          setActiveTab('directions');
        }}
      />

      {/* Saved Places Drawer / Modal */}
      <SavedPlacesModal
        isOpen={isSavedPlacesOpen}
        onClose={() => setIsSavedPlacesOpen(false)}
        onSelectPlace={(name) => {
          setDestInput(name);
          setActiveTab('directions');
        }}
      />
    </div>
  );
}
