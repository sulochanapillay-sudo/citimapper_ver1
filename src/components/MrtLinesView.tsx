import React, { useState } from 'react';
import { MRT_LINE_STATUSES } from '../data/transitData';
import { TransitLineCode } from '../types';

interface MrtLinesViewProps {
  onSelectLine: (lineCode: TransitLineCode) => void;
}

export const MrtLinesView: React.FC<MrtLinesViewProps> = ({ onSelectLine }) => {
  const [selectedLineDetail, setSelectedLineDetail] = useState<string | null>('NS');

  const lineStationsMap: Record<string, string[]> = {
    NS: [
      'Jurong East (NS1/EW24)',
      'Bukit Batok (NS2)',
      'Bukit Gombak (NS3)',
      'Choa Chu Kang (NS4/JS1)',
      'Yew Tee (NS5)',
      'Kranji (NS7)',
      'Marsiling (NS8)',
      'Woodlands (NS9/TE2)',
      'Admiralty (NS10)',
      'Sembawang (NS11)',
      'Canberra (NS12)',
      'Yishun (NS13)',
      'Khatib (NS14)',
      'Yio Chu Kang (NS15)',
      'Ang Mo Kio (NS16/CR11)',
      'Bishan (NS17/CC15)',
      'Braddell (NS18)',
      'Toa Payoh (NS19)',
      'Novena (NS20)',
      'Newton (NS21/DT11)',
      'Orchard (NS22/TE14)',
      'Somerset (NS23)',
      'Dhoby Ghaut (NS24/NE6/CC1)',
      'City Hall (NS25/EW13)',
      'Raffles Place (NS26/EW14)',
      'Marina Bay (NS27/CE2/TE20)',
      'Marina South Pier (NS28)',
    ],
    EW: [
      'Pasir Ris (EW1)',
      'Tampines (EW2/DT32)',
      'Simei (EW3)',
      'Tanah Merah (EW4)',
      'Expo (CG1/DT35)',
      'Changi Airport (CG2)',
      'Bedok (EW5)',
      'Kembangan (EW6)',
      'Eunos (EW7)',
      'Paya Lebar (EW8/CC9)',
      'Aljunied (EW9)',
      'Kallang (EW10)',
      'Lavender (EW11)',
      'Bugis (EW12/DT14)',
      'City Hall (EW13/NS25)',
      'Raffles Place (EW14/NS26)',
      'Tanjong Pagar (EW15)',
      'Outram Park (EW16/NE3/TE17)',
      'Tiong Bahru (EW17)',
      'Redhill (EW18)',
      'Queenstown (EW19)',
      'Commonwealth (EW20)',
      'Buona Vista (EW21/CC22)',
      'Dover (EW22)',
      'Clementi (EW23)',
      'Jurong East (EW24/NS1)',
      'Chinese Garden (EW25)',
      'Lakeside (EW26)',
      'Boon Lay (EW27/JS8)',
      'Pioneer (EW28)',
      'Joo Koon (EW29)',
      'Gul Circle (EW30)',
      'Tuas Crescent (EW31)',
      'Tuas West Road (EW32)',
      'Tuas Link (EW33)',
    ],
    DT: [
      'Bukit Panjang (DT1/BP6)',
      'Cashew (DT2)',
      'Hillview (DT3)',
      'Beauty World (DT5)',
      'King Albert Park (DT6)',
      'Sixth Avenue (DT7)',
      'Tan Kah Kee (DT8)',
      'Botanic Gardens (DT9/CC19)',
      'Stevens (DT10/TE11)',
      'Newton (DT11/NS21)',
      'Little India (DT12/NE7)',
      'Rochor (DT13)',
      'Bugis (DT14/EW12)',
      'Promenade (DT15/CC4)',
      'Bayfront (DT16/CE1)',
      'Downtown (DT17)',
      'Telok Ayer (DT18)',
      'Chinatown (DT19/NE4)',
      'Fort Canning (DT20)',
      'Bencoolen (DT21)',
      'Jalan Besar (DT22)',
      'Bendemeer (DT23)',
      'Geylang Bahru (DT24)',
      'Mattar (DT25)',
      'MacPherson (DT26/CC10)',
      'Ubi (DT27)',
      'Kaki Bukit (DT28)',
      'Bedok North (DT29)',
      'Bedok Reservoir (DT30)',
      'Tampines West (DT31)',
      'Tampines (DT32/EW2)',
      'Tampines East (DT33)',
      'Upper Changi (DT34)',
      'Expo (DT35/CG1)',
    ],
    CC: [
      'Dhoby Ghaut (CC1/NS24/NE6)',
      'Bras Basah (CC2)',
      'Esplanade (CC3)',
      'Promenade (CC4/DT15)',
      'Nicoll Highway (CC5)',
      'Stadium (CC6)',
      'Mountbatten (CC7)',
      'Dakota (CC8)',
      'Paya Lebar (CC9/EW8)',
      'MacPherson (CC10/DT26)',
      'Tai Seng (CC11)',
      'Bartley (CC12)',
      'Serangoon (CC13/NE12)',
      'Lorong Chuan (CC14)',
      'Bishan (CC15/NS17)',
      'Marymount (CC16)',
      'Caldecott (CC17/TE9)',
      'Botanic Gardens (CC19/DT9)',
      'Farrer Road (CC20)',
      'Holland Village (CC21)',
      'Buona Vista (CC22/EW21)',
      'one-north (CC23)',
      'Kent Ridge (CC24)',
      'Haw Par Villa (CC25)',
      'Pasir Panjang (CC26)',
      'Labrador Park (CC27)',
      'Telok Blangah (CC28)',
      'HarbourFront (CC29/NE1)',
      'Bayfront (CE1/DT16)',
      'Marina Bay (CE2/NS27/TE20)',
    ],
    NE: [
      'HarbourFront (NE1/CC29)',
      'Outram Park (NE3/EW16/TE17)',
      'Chinatown (NE4/DT19)',
      'Clarke Quay (NE5)',
      'Dhoby Ghaut (NE6/NS24/CC1)',
      'Little India (NE7/DT12)',
      'Farrer Park (NE8)',
      'Boon Keng (NE9)',
      'Potong Pasir (NE10)',
      'Woodleigh (NE11)',
      'Serangoon (NE12/CC13)',
      'Kovan (NE13)',
      'Hougang (NE14/CR8)',
      'Buangkok (NE15)',
      'Sengkang (NE16/STC)',
      'Punggol (NE17/PTC/CP4)',
    ],
    TE: [
      'Woodlands North (TE1)',
      'Woodlands (TE2/NS9)',
      'Woodlands South (TE3)',
      'Springleaf (TE4)',
      'Lentor (TE5)',
      'Mayflower (TE6)',
      'Bright Hill (TE7/CR13)',
      'Upper Thomson (TE8)',
      'Caldecott (TE9/CC17)',
      'Stevens (TE11/DT10)',
      'Napier (TE12)',
      'Orchard Boulevard (TE13)',
      'Orchard (TE14/NS22)',
      'Great World (TE15)',
      'Havelock (TE16)',
      'Outram Park (TE17/EW16/NE3)',
      'Maxwell (TE18)',
      'Shenton Way (TE19)',
      'Marina Bay (TE20/NS27/CE2)',
      'Gardens by the Bay (TE22)',
      'Tanjong Rhu (TE23)',
      'Katong Park (TE24)',
      'Tanjong Katong (TE25)',
      'Marine Parade (TE26)',
      'Marine Terrace (TE27)',
      'Siglap (TE28)',
      'Bayshore (TE29)',
    ],
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-4 lg:p-8" id="mrt-lines-view">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Singapore MRT &amp; LRT Network Schematic
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Official lines, operating frequencies, interchange stations, and real-time status.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#00c853]/15 text-[#004c1b] text-xs font-bold">
            6 Main MRT Lines • 140+ Stations
          </span>
        </div>

        {/* Line Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {MRT_LINE_STATUSES.map((line) => (
            <button
              key={line.code}
              onClick={() => {
                setSelectedLineDetail(line.code);
                onSelectLine(line.code);
              }}
              className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all border ${
                selectedLineDetail === line.code
                  ? 'bg-white shadow-md ring-2 ring-slate-900 border-slate-300'
                  : 'bg-white hover:bg-slate-50 shadow-xs border-slate-200'
              }`}
              type="button"
            >
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shadow-xs mb-2"
                style={{ backgroundColor: line.color }}
              >
                {line.code}
              </span>
              <span className="text-xs font-extrabold text-slate-900 leading-tight">
                {line.name}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 font-medium">{line.frequency}</span>
            </button>
          ))}
        </div>

        {/* Selected Line In-Depth View */}
        {selectedLineDetail && (
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
              <div className="flex items-center gap-3">
                <span
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow-xs"
                  style={{
                    backgroundColor:
                      MRT_LINE_STATUSES.find((l) => l.code === selectedLineDetail)?.color || '#009530',
                  }}
                >
                  {selectedLineDetail}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {MRT_LINE_STATUSES.find((l) => l.code === selectedLineDetail)?.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Status:{' '}
                    <span className="font-bold text-[#006e2a]">
                      {MRT_LINE_STATUSES.find((l) => l.code === selectedLineDetail)?.status}
                    </span>{' '}
                    • Updated 1m ago
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                Operating Hours: <span className="font-bold text-slate-800">05:30 – 00:30 Daily</span>
              </div>
            </div>

            {/* Station Route Timeline Sequence */}
            <div>
              <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">
                Station Sequence &amp; Interchanges ({lineStationsMap[selectedLineDetail]?.length} Stations)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {lineStationsMap[selectedLineDetail]?.map((station, idx) => {
                  const isInterchange = station.includes('/');
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs ${
                        isInterchange
                          ? 'bg-[#eff4ff] border border-blue-200 font-bold text-slate-900'
                          : 'bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="truncate flex-1">{station}</span>
                      {isInterchange && (
                        <span className="material-symbols-outlined text-[14px] text-[#005EC4]" title="Interchange">
                          sync_alt
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
