import React from 'react';
import { NavTab } from '../types';

interface HeaderProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCityModal: () => void;
  onOpenAppModal: () => void;
  onOpenSavedPlaces: () => void;
  currentCity: string;
  currentCityFlag: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenCityModal,
  onOpenAppModal,
  onOpenSavedPlaces,
  currentCity,
  currentCityFlag,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(15,23,42,0.06)] h-16">
      <div className="h-full w-full px-4 lg:px-8 flex items-center justify-between gap-3">
        {/* Logo & City Selector */}
        <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
          <div 
            onClick={() => onSelectTab('directions')}
            className="flex items-center gap-2 cursor-pointer select-none group"
            id="brand-logo-button"
          >
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1W2RrGFk0InZjJHmaVBkUsX8q3H9B3Kh6y7y3tqGIP5GwTaeCDhsbnSOFsjRbGtEHH0W97t4ZjarvSUGsFe41bq9bC7JDLbh_fgF41dDSGTsRwxMIk8mBgs7vqMHHN2gfAyFlpam2I-cBjl8LdiNHfFAwk9usl4TmrmK6ePYgiDkZ5EL4ZS4IngUQGXofuv8n8UFgefsIhoOF75whZrLqYWrn5Fk_G3pm73WcNO-LX6A0yQpLGIE-vCpfs"
              alt="Citymapper Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-extrabold text-xl tracking-tight text-slate-900 hidden sm:inline-block">
              Citymapper
            </span>
          </div>

          <button
            onClick={onOpenCityModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-slate-800 transition-colors text-xs sm:text-sm font-semibold border border-blue-100 shadow-sm"
            type="button"
            id="switch-city-header-btn"
          >
            <span className="flex items-center gap-1">
              <span>{currentCity}</span>
              <span>{currentCityFlag}</span>
            </span>
            <span className="material-symbols-outlined text-[16px] text-slate-500">arrow_drop_down</span>
          </button>
        </div>

        {/* Main Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1" id="main-nav-tabs">
          <button
            onClick={() => onSelectTab('directions')}
            id="nav-tab-directions"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'directions'
                ? 'bg-[#e5eeff] text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Directions
          </button>
          <button
            onClick={() => onSelectTab('live-transit')}
            id="nav-tab-live-transit"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'live-transit'
                ? 'bg-[#e5eeff] text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Live Transit
          </button>
          <button
            onClick={() => onSelectTab('mrt-lrt-lines')}
            id="nav-tab-mrt-lines"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'mrt-lrt-lines'
                ? 'bg-[#e5eeff] text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            MRT &amp; LRT Lines
          </button>
          <button
            onClick={() => onSelectTab('bus-network')}
            id="nav-tab-bus-network"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'bus-network'
                ? 'bg-[#e5eeff] text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Bus Network
          </button>
          <button
            onClick={() => onSelectTab('cycle-walk')}
            id="nav-tab-cycle-walk"
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'cycle-walk'
                ? 'bg-[#e5eeff] text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Cycle &amp; Walk
          </button>
        </nav>

        {/* Right Action Icons & Get App CTA */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={onOpenAppModal}
            id="get-the-app-btn"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00c853] hover:bg-[#00E676] text-[#004c1b] font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">smartphone</span>
            <span className="hidden sm:inline">Get the App</span>
          </button>

          <button
            onClick={onOpenSavedPlaces}
            id="saved-places-btn"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
            title="Saved Places"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">star</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('citymapper-feedback-footer');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            id="header-feedback-btn"
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center"
            title="Feedback & Discussion"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">forum</span>
          </button>

          <div
            className="w-8 h-8 rounded-full bg-[#006e2a] flex items-center justify-center text-white cursor-pointer hover:ring-2 hover:ring-[#00c853] transition-all"
            title="User Profile: Singapore LTA Live"
            id="user-profile-avatar"
          >
            <span className="material-symbols-outlined text-white text-[18px]">person</span>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-200 bg-white px-3 py-1.5 gap-1 scrollbar-none">
        <button
          onClick={() => onSelectTab('directions')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeTab === 'directions' ? 'bg-[#e5eeff] text-slate-900' : 'text-slate-600'
          }`}
        >
          Directions
        </button>
        <button
          onClick={() => onSelectTab('live-transit')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeTab === 'live-transit' ? 'bg-[#e5eeff] text-slate-900' : 'text-slate-600'
          }`}
        >
          Live Transit
        </button>
        <button
          onClick={() => onSelectTab('mrt-lrt-lines')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeTab === 'mrt-lrt-lines' ? 'bg-[#e5eeff] text-slate-900' : 'text-slate-600'
          }`}
        >
          MRT &amp; LRT
        </button>
        <button
          onClick={() => onSelectTab('bus-network')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeTab === 'bus-network' ? 'bg-[#e5eeff] text-slate-900' : 'text-slate-600'
          }`}
        >
          Buses
        </button>
        <button
          onClick={() => onSelectTab('cycle-walk')}
          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
            activeTab === 'cycle-walk' ? 'bg-[#e5eeff] text-slate-900' : 'text-slate-600'
          }`}
        >
          Cycle / Walk
        </button>
        <button
          onClick={() => {
            const el = document.getElementById('citymapper-feedback-footer');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[14px]">forum</span>
          <span>Feedback</span>
        </button>
      </div>
    </header>
  );
};
