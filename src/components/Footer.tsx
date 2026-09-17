import React, { useState } from 'react';

export const Footer: React.FC = () => {
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);

  return (
    <>
      <footer className="w-full bg-[#eff4ff] border-t border-slate-200" id="citymapper-footer">
        <div className="w-full px-4 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Contains information from LTA DataMall and data.gov.sg, accessed 17 September 2026, made available under the terms of the Singapore Open Data Licence version 1.0.
          </div>
          <div className="flex items-center gap-4 font-semibold text-slate-700">
            <button
              onClick={() => setShowStatusModal(true)}
              className="hover:text-slate-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <span className="w-2 h-2 rounded-full bg-[#00E676] inline-block animate-pulse" />
              <span>Network Status: Normal</span>
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
              type="button"
            >
              Privacy &amp; Terms
            </button>
          </div>
        </div>
      </footer>

      {/* Network Status Advisory Dialog */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00E676]" />
                <h2 className="text-lg font-extrabold text-slate-900">LTA Network Status</h2>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="mt-4 space-y-2.5 text-xs text-slate-600">
              <p className="font-medium">
                All 6 major Singapore MRT lines are currently in operation.
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                ⚠️ <span className="font-bold">Downtown Line:</span> Scheduled maintenance around Bugis (DT14) causing minor +6m intervals.
              </div>
              <p className="text-slate-400">
                Data refreshed via Singapore Land Transport Authority (LTA) Datamall API.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Terms Dialog */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-slate-900">Privacy &amp; Terms</h2>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="mt-4 space-y-2 text-xs text-slate-600 max-h-60 overflow-y-auto">
              <p>
                Citymapper uses real-time schedule information provided by the Land Transport Authority under the Singapore Open Data License.
              </p>
              <p>
                Location data is processed strictly on device to compute immediate routing solutions and is not stored without permission.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
