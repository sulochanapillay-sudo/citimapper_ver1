import React, { useState } from 'react';
import { TransitLineCode, TransitStation, CommuteOption } from '../types';
import { STATIONS } from '../data/transitData';

interface InteractiveMapProps {
  selectedLineFilter: TransitLineCode | 'ALL';
  onSelectLineFilter: (line: TransitLineCode | 'ALL') => void;
  activeRoute: CommuteOption | null;
  onSelectStation: (station: TransitStation) => void;
  mapLayer: 'mrt' | 'bus' | 'pcn';
  onChangeMapLayer: (layer: 'mrt' | 'bus' | 'pcn') => void;
  originStationName?: string;
  destStationName?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  selectedLineFilter,
  onSelectLineFilter,
  activeRoute,
  onSelectStation,
  mapLayer,
  onChangeMapLayer,
  originStationName = 'Changi Airport T3',
  destStationName = 'Marina Bay Sands, Bayfront',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredStation, setHoveredStation] = useState<TransitStation | null>(null);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetMap = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Helper to determine line opacity based on filter
  const getLineOpacity = (code: TransitLineCode) => {
    if (selectedLineFilter === 'ALL') return 0.95;
    return selectedLineFilter === code ? 1 : 0.18;
  };

  return (
    <div
      className="flex-1 h-full relative overflow-hidden bg-[#0B0F19] select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      id="transit-map-container"
    >
      {/* SVG Canvas */}
      <div
        className="w-full h-full transition-transform duration-100 ease-out origin-center"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
        }}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Water Background Radial Glow */}
            <radialGradient id="waterGlow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#162238" />
              <stop offset="100%" stopColor="#0B0F19" />
            </radialGradient>

            {/* Singapore Land Fill */}
            <linearGradient id="singaporeLand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1A2639" />
              <stop offset="100%" stopColor="#131D2D" />
            </linearGradient>

            {/* Animated Glow for Active Route & Moving Vehicles */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="strongGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Water Canvas Base */}
          <rect width="1200" height="800" fill="url(#waterGlow)" />

          {/* Malaysia / Johor Coastline */}
          <path
            d="M 0 120 Q 300 130 550 90 T 1000 60 L 1200 70 L 1200 0 L 0 0 Z"
            fill="#141c2b"
            opacity="0.7"
          />
          <text
            x="500"
            y="45"
            fill="#475569"
            fontSize="14"
            fontWeight="700"
            letterSpacing="2"
          >
            MALAYSIA / JOHOR BAHRU
          </text>

          {/* Johor Strait Water Line */}
          <path
            d="M 0 130 Q 300 140 550 100 T 1000 70 L 1200 80"
            fill="none"
            stroke="#005EC4"
            strokeWidth="2"
            opacity="0.2"
          />

          {/* Main Singapore Island Polygon */}
          <path
            d="M 160 380 
               C 190 280, 290 210, 420 200 
               C 560 190, 750 180, 880 230 
               C 980 260, 1070 340, 1090 410 
               C 1100 450, 1070 510, 990 530 
               C 910 550, 840 540, 780 570 
               C 700 610, 620 620, 540 600 
               C 460 580, 390 580, 330 550 
               C 260 520, 180 520, 150 480 
               C 120 440, 140 400, 160 380 Z"
            fill="url(#singaporeLand)"
            stroke="#253347"
            strokeWidth="2"
          />

          {/* Jurong Island */}
          <path
            d="M 230 570 C 270 560, 310 590, 290 630 C 260 650, 220 630, 230 570 Z"
            fill="#1A2639"
            stroke="#253347"
            strokeWidth="1.5"
          />
          <text x="235" y="610" fill="#64748B" fontSize="11" fontWeight="600">
            Jurong Island
          </text>

          {/* Sentosa Island */}
          <path
            d="M 570 630 C 620 625, 650 645, 630 665 C 600 675, 570 660, 570 630 Z"
            fill="#1A2639"
            stroke="#253347"
            strokeWidth="1.5"
          />
          <text x="585" y="652" fill="#64748B" fontSize="11" fontWeight="700">
            Sentosa
          </text>

          {/* Waterways Label */}
          <text
            x="640"
            y="730"
            fill="#334155"
            fontSize="15"
            fontWeight="800"
            letterSpacing="4"
          >
            SINGAPORE STRAIT
          </text>

          {/* ================= PCN CYCLE LAYER ================= */}
          {mapLayer === 'pcn' && (
            <g id="pcn-cycling-paths" opacity="0.85">
              {/* Coastal Park Connector Network (Changi to Bayfront) */}
              <path
                d="M 1040 450 Q 980 520 860 540 T 670 535 T 645 525"
                fill="none"
                stroke="#4edea3"
                strokeWidth="4"
                strokeDasharray="4 4"
              />
              {/* Marina Bay Loop */}
              <circle
                cx="645"
                cy="515"
                r="35"
                fill="none"
                stroke="#4edea3"
                strokeWidth="3"
                strokeDasharray="3 3"
              />
              {/* Rail Corridor */}
              <path
                d="M 520 230 L 490 350 L 530 460 L 590 560"
                fill="none"
                stroke="#29c48b"
                strokeWidth="3.5"
                strokeDasharray="6 3"
              />
              <text x="860" y="560" fill="#4edea3" fontSize="11" fontWeight="700">
                Coastal Park Connector (East Coast)
              </text>
            </g>
          )}

          {/* ================= BUS LINES LAYER ================= */}
          {mapLayer === 'bus' && (
            <g id="bus-routes-overlay" opacity="0.85">
              {/* Bus 36 Express via ECP */}
              <path
                d="M 1040 445 C 960 480, 850 515, 680 505 L 645 520"
                fill="none"
                stroke="#16A34A"
                strokeWidth="4"
                strokeDasharray="6 3"
              />
              {/* Bus 190 CCK - Orchard */}
              <path
                d="M 330 380 L 460 410 L 580 450 L 625 525"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="4 2"
              />
              {/* Bus 65 */}
              <path
                d="M 940 400 L 730 400 L 580 450 L 570 580"
                fill="none"
                stroke="#c084fc"
                strokeWidth="3"
                strokeDasharray="4 2"
              />
              <text x="780" y="495" fill="#16A34A" fontSize="11" fontWeight="800">
                Bus 36 Express (Airport to City)
              </text>
            </g>
          )}

          {/* ================= MRT RAIL LINES ================= */}
          {/* 1. East-West Line (Green) */}
          <path
            d="M 180 430 L 290 430 L 410 440 L 530 460 L 610 530 L 710 510 L 840 460 L 980 410 L 1030 420"
            fill="none"
            stroke="#009530"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={getLineOpacity('EW')}
          />
          {/* Changi Airport Branch */}
          <path
            d="M 940 425 L 990 440 L 1040 445"
            fill="none"
            stroke="#009530"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={getLineOpacity('EW')}
          />

          {/* 2. North-South Line (Red) */}
          <path
            d="M 290 430 L 320 310 L 400 240 L 520 230 L 590 270 L 610 370 L 625 470 L 610 530 L 645 560"
            fill="none"
            stroke="#D42E12"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={getLineOpacity('NS')}
          />

          {/* 3. Downtown Line (Blue) */}
          <path
            d="M 330 380 L 430 330 L 530 350 L 585 430 L 630 480 L 670 495 L 750 430 L 890 400 L 940 425"
            fill="none"
            stroke="#005EC4"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={getLineOpacity('DT')}
          />

          {/* 4. North East Line (Purple) */}
          <path
            d="M 590 550 L 620 495 L 660 420 L 730 320 L 810 240"
            fill="none"
            stroke="#8F4199"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={getLineOpacity('NE')}
          />

          {/* 5. Circle Line (Orange - Loop) */}
          <path
            d="M 610 530 L 540 490 L 490 410 L 550 330 L 670 340 L 730 400 L 700 480 L 670 495 L 640 525"
            fill="none"
            stroke="#FA9E0D"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={getLineOpacity('CC')}
          />

          {/* 6. Thomson-East Coast Line (Brown) */}
          <path
            d="M 510 200 L 530 280 L 560 360 L 595 440 L 620 510 L 690 535 L 790 520 L 910 490"
            fill="none"
            stroke="#9D5B25"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={getLineOpacity('TE')}
          />

          {/* Active Journey Route Highlight Overlay (Changi -> Bayfront) */}
          {activeRoute && activeRoute.id !== 'route-fewest' && activeRoute.id !== 'route-cab' && (
            <path
              d="M 1040 445 L 990 440 L 940 425 L 890 400 L 750 430 L 670 495 L 645 520"
              fill="none"
              stroke="#00E676"
              strokeWidth="5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              filter="url(#glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="50;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          )}

          {activeRoute && activeRoute.id === 'route-fewest' && (
            <path
              d="M 1040 445 C 960 480, 850 515, 680 505 L 645 520"
              fill="none"
              stroke="#00E676"
              strokeWidth="5"
              strokeDasharray="8 6"
              strokeLinecap="round"
              filter="url(#glow)"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="50;0"
                dur="2s"
                repeatCount="indefinite"
              />
            </path>
          )}

          {/* Station Hub Nodes */}
          {STATIONS.map((station) => {
            const isHovered = hoveredStation?.id === station.id;
            return (
              <g
                key={station.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStation(station);
                }}
                onMouseEnter={() => setHoveredStation(station)}
                onMouseLeave={() => setHoveredStation(null)}
                className="cursor-pointer group"
                id={`station-node-${station.id}`}
              >
                {/* Outer Ring on Hover */}
                {isHovered && (
                  <circle
                    cx={station.cx}
                    cy={station.cy}
                    r={12}
                    fill="none"
                    stroke="#00E676"
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                )}

                {/* Base Station Circle */}
                <circle
                  cx={station.cx}
                  cy={station.cy}
                  r={station.isInterchange ? 7.5 : 6}
                  fill="#ffffff"
                  stroke="#161F30"
                  strokeWidth={station.isInterchange ? 3 : 2.5}
                />

                {/* Specific interchange center dots */}
                {station.id === 'dhoby-ghaut' && (
                  <circle cx={station.cx} cy={station.cy} r={3.5} fill="#D42E12" />
                )}

                {/* Station Name Label */}
                <text
                  cx={station.cx}
                  cy={station.cy}
                  x={
                    station.id === 'orchard'
                      ? station.cx - 65
                      : station.id === 'raffles-place'
                      ? station.cx - 75
                      : station.id === 'jurong-east'
                      ? station.cx - 50
                      : station.cx + 12
                  }
                  y={station.cy + 4}
                  fill={isHovered ? '#00E676' : '#E2E8F0'}
                  fontSize={station.isInterchange ? '12' : '11'}
                  fontWeight={station.isInterchange ? '800' : '700'}
                  className="transition-colors pointer-events-none"
                >
                  {station.name}
                </text>
              </g>
            );
          })}

          {/* Destination Pin: Bayfront (MBS) */}
          <g transform="translate(645, 520)" className="pointer-events-none">
            <circle cx="0" cy="0" r="14" fill="#00E676" opacity="0.3">
              <animate
                attributeName="r"
                values="10;22;10"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="0" cy="0" r="7" fill="#00E676" stroke="#0B0F19" strokeWidth="2" />
            <text x="14" y="5" fill="#00E676" fontSize="13" fontWeight="800">
              {destStationName}
            </text>
          </g>

          {/* Origin Pin: Changi Airport */}
          <g transform="translate(1040, 445)" className="pointer-events-none">
            <circle cx="0" cy="0" r="14" fill="#00C853" opacity="0.3">
              <animate
                attributeName="r"
                values="10;22;10"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="0" cy="0" r="7" fill="#00C853" stroke="#0B0F19" strokeWidth="2" />
            <text x="-130" y="5" fill="#69ff87" fontSize="13" fontWeight="800">
              {originStationName}
            </text>
          </g>

          {/* Moving Live Trains Simulation */}
          <g id="live-trains-simulation">
            {/* Train 1: EW Line */}
            <circle cx="480" cy="445" r="5" fill="#00E676" filter="url(#glow)">
              <animate
                attributeName="cx"
                values="290;610;290"
                dur="18s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="430;530;430"
                dur="18s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Train 2: Circle Line */}
            <circle cx="615" cy="320" r="5" fill="#FA9E0D" filter="url(#glow)">
              <animate
                attributeName="cx"
                values="550;670;730;700;550"
                dur="24s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="330;340;400;480;330"
                dur="24s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Train 3: North-South Line */}
            <circle cx="520" cy="230" r="5" fill="#D42E12" filter="url(#glow)">
              <animate
                attributeName="cx"
                values="520;590;610;625;520"
                dur="20s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values="230;270;370;470;230"
                dur="20s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        </svg>
      </div>

      {/* Floating Top Header: Live Transit Capsule & Line Filters */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Filter Capsule */}
        <div className="pointer-events-auto bg-[#161F30]/95 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-full shadow-lg border border-[#253347] flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => onSelectLineFilter('ALL')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            title="Show all transit lines"
            type="button"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-white">
              {selectedLineFilter === 'ALL' ? 'All Transit Active' : `${selectedLineFilter} Line Filter`}
            </span>
          </button>

          <div className="h-4 w-px bg-[#253347]" />

          {/* MRT Line Filter Chips */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => onSelectLineFilter(selectedLineFilter === 'NS' ? 'ALL' : 'NS')}
              className={`w-6 h-6 rounded text-[10px] font-extrabold text-white transition-all ${
                selectedLineFilter === 'NS' ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-90'
              }`}
              style={{ backgroundColor: '#D42E12' }}
              title="North-South Line"
              type="button"
            >
              NS
            </button>
            <button
              onClick={() => onSelectLineFilter(selectedLineFilter === 'EW' ? 'ALL' : 'EW')}
              className={`w-6 h-6 rounded text-[10px] font-extrabold text-white transition-all ${
                selectedLineFilter === 'EW' ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-90'
              }`}
              style={{ backgroundColor: '#009530' }}
              title="East-West Line"
              type="button"
            >
              EW
            </button>
            <button
              onClick={() => onSelectLineFilter(selectedLineFilter === 'DT' ? 'ALL' : 'DT')}
              className={`w-6 h-6 rounded text-[10px] font-extrabold text-white transition-all ${
                selectedLineFilter === 'DT' ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-90'
              }`}
              style={{ backgroundColor: '#005EC4' }}
              title="Downtown Line"
              type="button"
            >
              DT
            </button>
            <button
              onClick={() => onSelectLineFilter(selectedLineFilter === 'CC' ? 'ALL' : 'CC')}
              className={`w-6 h-6 rounded text-[10px] font-extrabold text-white transition-all ${
                selectedLineFilter === 'CC' ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-90'
              }`}
              style={{ backgroundColor: '#FA9E0D' }}
              title="Circle Line"
              type="button"
            >
              CC
            </button>
            <button
              onClick={() => onSelectLineFilter(selectedLineFilter === 'NE' ? 'ALL' : 'NE')}
              className={`w-6 h-6 rounded text-[10px] font-extrabold text-white transition-all ${
                selectedLineFilter === 'NE' ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-90'
              }`}
              style={{ backgroundColor: '#8F4199' }}
              title="North East Line"
              type="button"
            >
              NE
            </button>
            <button
              onClick={() => onSelectLineFilter(selectedLineFilter === 'TE' ? 'ALL' : 'TE')}
              className={`w-6 h-6 rounded text-[10px] font-extrabold text-white transition-all ${
                selectedLineFilter === 'TE' ? 'ring-2 ring-white scale-110' : 'hover:scale-105 opacity-90'
              }`}
              style={{ backgroundColor: '#9D5B25' }}
              title="Thomson-East Coast Line"
              type="button"
            >
              TE
            </button>
          </div>
        </div>

        {/* Mode Visibility Switches */}
        <div className="pointer-events-auto hidden md:flex items-center gap-1 bg-[#161F30]/95 backdrop-blur-md p-1 rounded-full shadow-lg border border-[#253347]">
          <button
            onClick={() => onChangeMapLayer('mrt')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mapLayer === 'mrt'
                ? 'bg-[#00c853] text-[#004c1b] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            type="button"
          >
            MRT / LRT
          </button>
          <button
            onClick={() => onChangeMapLayer('bus')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mapLayer === 'bus'
                ? 'bg-[#00c853] text-[#004c1b] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            type="button"
          >
            Bus Lines
          </button>
          <button
            onClick={() => onChangeMapLayer('pcn')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
              mapLayer === 'pcn'
                ? 'bg-[#00c853] text-[#004c1b] shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
            type="button"
          >
            PCN Cycle
          </button>
        </div>
      </div>

      {/* Floating Active Route Preview Card (Bottom Left) */}
      <div className="absolute bottom-6 left-6 z-10 w-full max-w-sm pointer-events-auto hidden sm:block">
        <div className="bg-[#161F30]/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-[#253347]">
          <div className="flex items-center justify-between pb-2 border-b border-[#253347] mb-2.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00c853] text-[#004c1b] font-extrabold text-[11px] tracking-wide">
                ACTIVE TRAJECTORY
              </span>
              <span className="text-[12px] text-slate-300">Live GPS tracking</span>
            </div>
            <span className="text-[14px] text-[#00E676] font-extrabold">
              ETA {activeRoute ? activeRoute.arrivalTime : '14:42'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#00c853] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Boarding Point</p>
                <p className="text-[13px] text-white font-bold truncate">
                  {originStationName}
                </p>
              </div>
              <span className="text-slate-300 text-[11px]">Platform B</span>
            </div>

            <div className="ml-1.5 pl-3 border-l border-dashed border-slate-600 my-1 py-0.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Transfer at Expo (DT Line)</span>
              <span className="text-[#00E676] font-semibold">3m transfer walk</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#005EC4] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase font-bold text-slate-400">Destination Stop</p>
                <p className="text-[13px] text-white font-bold truncate">
                  {destStationName}
                </p>
              </div>
              <span className="text-[#69ff87] text-[11px] font-bold">Direct MBS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Map Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-2 pointer-events-auto">
        <div className="bg-[#161F30]/90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden flex flex-col border border-[#253347]">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#253347] transition-colors"
            title="Zoom In"
            type="button"
            id="map-zoom-in-btn"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
          <div className="h-px bg-[#253347]" />
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 flex items-center justify-center text-white hover:bg-[#253347] transition-colors"
            title="Zoom Out"
            type="button"
            id="map-zoom-out-btn"
          >
            <span className="material-symbols-outlined text-[20px]">remove</span>
          </button>
        </div>

        <button
          onClick={handleResetMap}
          className="w-10 h-10 rounded-xl bg-[#161F30]/90 backdrop-blur-md shadow-xl flex items-center justify-center text-white hover:bg-[#253347] transition-colors border border-[#253347]"
          title="Center Singapore Map"
          type="button"
          id="map-center-btn"
        >
          <span className="material-symbols-outlined text-[20px]">center_focus_strong</span>
        </button>

        <button
          onClick={() => {
            if (mapLayer === 'mrt') onChangeMapLayer('bus');
            else if (mapLayer === 'bus') onChangeMapLayer('pcn');
            else onChangeMapLayer('mrt');
          }}
          className="w-10 h-10 rounded-xl bg-[#161F30]/90 backdrop-blur-md shadow-xl flex items-center justify-center text-white hover:bg-[#253347] transition-colors border border-[#253347]"
          title="Switch Map Layers (MRT, Bus, PCN)"
          type="button"
          id="map-layers-toggle-btn"
        >
          <span className="material-symbols-outlined text-[20px]">layers</span>
        </button>
      </div>
    </div>
  );
};
