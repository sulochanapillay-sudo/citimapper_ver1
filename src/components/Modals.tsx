import React from 'react';
import { CITIES } from '../data/transitData';
import { TransitStation } from '../types';

interface CitySwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCityId: string;
  onSelectCity: (cityId: string) => void;
}

export const CitySwitcherModal: React.FC<CitySwitcherModalProps> = ({
  isOpen,
  onClose,
  currentCityId,
  onSelectCity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900">Switch City</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {CITIES.map((city) => {
            const isSelected = city.id === currentCityId;
            return (
              <button
                key={city.id}
                onClick={() => {
                  onSelectCity(city.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl transition-all text-left ${
                  isSelected
                    ? 'bg-[#eff4ff] border-2 border-[#00c853]'
                    : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                }`}
                type="button"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{city.flag}</span>
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 block">{city.name}</span>
                    <span className="text-xs text-slate-500">{city.country}</span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="px-2.5 py-1 rounded-full bg-[#00c853] text-[#004c1b] text-xs font-extrabold">
                    Active
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 font-semibold">Select</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface GetAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetAppModal: React.FC<GetAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150 text-center">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="w-16 h-16 rounded-2xl bg-[#00c853]/20 flex items-center justify-center text-[#006e2a] mx-auto mb-3">
          <span className="material-symbols-outlined text-[36px]">smartphone</span>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900">Get the Citymapper App</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Scan the QR code with your phone camera to download Citymapper for Singapore with live lockscreen step-by-step guidance.
        </p>

        {/* QR Code Container */}
        <div className="my-5 p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
          <div className="w-44 h-44 bg-white rounded-xl flex items-center justify-center shadow-inner border border-slate-200">
            <span className="material-symbols-outlined text-[140px] text-slate-800">
              qr_code_2
            </span>
          </div>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">
            Scan for iOS &amp; Android
          </span>
        </div>

        <div className="flex items-center justify-center gap-3">
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800">
            Apple App Store ★ 4.8
          </span>
          <span className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-bold text-slate-800">
            Google Play ★ 4.7
          </span>
        </div>
      </div>
    </div>
  );
};

interface RouteOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  wheelchair: boolean;
  setWheelchair: (v: boolean) => void;
  fewerTransfers: boolean;
  setFewerTransfers: (v: boolean) => void;
  avoidBus: boolean;
  setAvoidBus: (v: boolean) => void;
}

export const RouteOptionsModal: React.FC<RouteOptionsModalProps> = ({
  isOpen,
  onClose,
  wheelchair,
  setWheelchair,
  fewerTransfers,
  setFewerTransfers,
  avoidBus,
  setAvoidBus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006e2a]">tune</span>
            <h2 className="text-lg font-extrabold text-slate-900">Route Options</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-700">accessible</span>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Step-Free / Accessible</span>
                <span className="text-xs text-slate-500">Only elevators, no stairs or escalators</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={wheelchair}
              onChange={(e) => setWheelchair(e.target.checked)}
              className="w-5 h-5 accent-[#00c853] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-700">transfer_within_a_station</span>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Fewer Transfers</span>
                <span className="text-xs text-slate-500">Prefer direct lines over fastest switches</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={fewerTransfers}
              onChange={(e) => setFewerTransfers(e.target.checked)}
              className="w-5 h-5 accent-[#00c853] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-slate-700">directions_bus</span>
              <div>
                <span className="text-sm font-bold text-slate-900 block">Prefer Rail (Avoid Bus)</span>
                <span className="text-xs text-slate-500">Prioritize underground MRT network</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={avoidBus}
              onChange={(e) => setAvoidBus(e.target.checked)}
              className="w-5 h-5 accent-[#00c853] rounded"
            />
          </label>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#00c853] hover:bg-[#00E676] text-[#004c1b] font-extrabold text-sm shadow-sm transition-all"
            type="button"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

interface StationDetailModalProps {
  station: TransitStation | null;
  onClose: () => void;
  onSetAsOrigin: (name: string) => void;
  onSetAsDest: (name: string) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  onClose,
  onSetAsOrigin,
  onSetAsDest,
}) => {
  if (!station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{station.name}</h2>
              {station.code && (
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                  {station.code}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              {station.lines.map((ln) => (
                <span
                  key={ln}
                  className="px-2 py-0.5 rounded text-xs font-extrabold text-white"
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
                  {ln} Line
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Next Trains */}
        <div className="mt-4 space-y-2">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
            Next Train Departures
          </span>
          {station.nextTrains && station.nextTrains.length > 0 ? (
            station.nextTrains.map((train, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs"
              >
                <span className="font-semibold text-slate-800">{train.direction}</span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#00c853]/20 text-[#004c1b] font-extrabold">
                    {train.next}
                  </span>
                  <span className="text-slate-400">{train.subsequent}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 text-center">
              Trains operating every 2–4 minutes
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            onClick={() => {
              onSetAsOrigin(station.name);
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">trip_origin</span>
            Set as Origin
          </button>
          <button
            onClick={() => {
              onSetAsDest(station.name);
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-[#00c853] hover:bg-[#00E676] text-[#004c1b] font-extrabold text-xs transition-colors flex items-center justify-center gap-1 shadow-xs"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            Set as Destination
          </button>
        </div>
      </div>
    </div>
  );
};

interface SavedPlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (name: string) => void;
}

export const SavedPlacesModal: React.FC<SavedPlacesModalProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
}) => {
  if (!isOpen) return null;

  const places = [
    { name: 'Home', address: 'Bishan MRT (NS17/CC15)', icon: 'home' },
    { name: 'Office', address: 'One Raffles Place, CBD', icon: 'work' },
    { name: 'Orchard ION', address: '2 Orchard Turn, Singapore 238801', icon: 'star' },
    { name: 'Sentosa Cove', address: 'Ocean Way, Sentosa Island', icon: 'park' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">star</span>
            <h2 className="text-lg font-extrabold text-slate-900">Saved Places</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {places.map((place) => (
            <div
              key={place.name}
              onClick={() => {
                onSelectPlace(place.name);
                onClose();
              }}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#eff4ff] cursor-pointer transition-colors border border-transparent hover:border-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-xs text-slate-700">
                  <span className="material-symbols-outlined text-[18px]">{place.icon}</span>
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">{place.name}</span>
                  <span className="text-xs text-slate-500">{place.address}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                arrow_forward
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
