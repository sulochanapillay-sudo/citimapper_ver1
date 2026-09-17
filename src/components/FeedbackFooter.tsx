import React, { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    disqus_config?: (this: {
      page: {
        url: string;
        identifier: string;
        title?: string;
      };
    }) => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: {
          page: {
            url: string;
            identifier: string;
            title?: string;
          };
        }) => void;
      }) => void;
    };
  }
}

// Real fixed values replacing PAGE_URL and PAGE_IDENTIFIER placeholders
export const FIXED_PAGE_URL = 'https://sulochanapillay-sudo.github.io/citimapper_ver1/feedback';
export const FIXED_PAGE_IDENTIFIER = 'citymapper-singapore-feedback';

interface FeedbackFooterProps {
  activeTab?: string;
}

export const FeedbackFooter: React.FC<FeedbackFooterProps> = ({ activeTab }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [lastReloaded, setLastReloaded] = useState<string>('');
  const [loadError, setLoadError] = useState<boolean>(false);

  // Function to initialize or reload Disqus in a Single Page App (SPA)
  const reloadDisqus = useCallback(() => {
    setLoadError(false);

    // Set configuration variables with real fixed values
    window.disqus_config = function () {
      this.page.url = FIXED_PAGE_URL;
      this.page.identifier = FIXED_PAGE_IDENTIFIER;
      this.page.title = 'Citymapper Singapore Community Feedback';
    };

    if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
      // SPA navigation / remount reload pattern
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = FIXED_PAGE_URL;
            this.page.identifier = FIXED_PAGE_IDENTIFIER;
            this.page.title = 'Citymapper Singapore Community Feedback';
          },
        });
        setIsLoaded(true);
        setLastReloaded(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.warn('Disqus reset error:', err);
      }
    } else {
      // First load: dynamically append embed.js script
      const scriptId = 'disqus-embed-script';
      const existingScript = document.getElementById(scriptId);

      if (!existingScript) {
        const d = document;
        const s = d.createElement('script');
        s.id = scriptId;
        s.src = 'https://sulochana-citymapper.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        s.async = true;
        s.onload = () => {
          setIsLoaded(true);
          setLastReloaded(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        s.onerror = () => {
          setLoadError(true);
        };
        (d.head || d.body).appendChild(s);
      } else {
        // Script tag exists but DISQUS global not ready yet; retry shortly
        setTimeout(() => {
          if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
            window.DISQUS.reset({
              reload: true,
              config: function () {
                this.page.url = FIXED_PAGE_URL;
                this.page.identifier = FIXED_PAGE_IDENTIFIER;
              },
            });
            setIsLoaded(true);
            setLastReloaded(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          }
        }, 300);
      }
    }
  }, []);

  // Reload Disqus whenever activeTab changes in the single-page application
  useEffect(() => {
    // Slight delay to ensure DOM element #disqus_thread is painted
    const timer = setTimeout(() => {
      reloadDisqus();
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab, reloadDisqus]);

  return (
    <section
      className="w-full bg-white border-t border-slate-200 py-8 px-4 lg:px-8"
      id="citymapper-feedback-footer"
      aria-label="Community Feedback"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">forum</span>
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Feedback &amp; Community Discussion
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
                Disqus Live
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
              Leave your feedback, report transport service updates, or share route tips with fellow Singapore commuters.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={reloadDisqus}
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
              type="button"
              title="Reload Disqus thread in this Single Page App"
              id="reload-disqus-button"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Reload Thread</span>
            </button>

            <a
              href="https://sulochana-citymapper.disqus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <span>Open in Disqus</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Real Fixed Values Configuration Transparency Pill */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-600">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800">Fixed URL:</span>
              <code className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-blue-600 font-mono text-[11px]">
                {FIXED_PAGE_URL}
              </code>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-800">Identifier:</span>
              <code className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-emerald-700 font-mono text-[11px]">
                {FIXED_PAGE_IDENTIFIER}
              </code>
            </div>
          </div>

          {lastReloaded && (
            <div className="text-[11px] text-slate-400 font-medium">
              SPA synced at {lastReloaded}
            </div>
          )}
        </div>

        {/* Adblocker / Fallback advisory */}
        {loadError && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-amber-600 mt-0.5">info</span>
            <div>
              <p className="font-bold">Disqus thread could not be loaded directly.</p>
              <p className="mt-0.5 text-amber-800">
                If you are using a browser ad-blocker or strict tracking prevention, Disqus third-party scripts may be paused. You can open the discussion directly at{' '}
                <a
                  href="https://sulochana-citymapper.disqus.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-bold text-amber-950 hover:text-black"
                >
                  sulochana-citymapper.disqus.com
                </a>.
              </p>
            </div>
          </div>
        )}

        {/* Embedded Disqus Thread Container */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs">
          <div id="disqus_thread" className="min-h-[220px]"></div>

          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-blue-600 underline font-medium">
              comments powered by Disqus.
            </a>
          </noscript>
        </div>
      </div>
    </section>
  );
};
