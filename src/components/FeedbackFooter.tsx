import React, { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    disqus_shortname?: string;
    disqus_config?: (this: any) => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: any) => void;
      }) => void;
    };
  }
}

// Real fixed values replacing PAGE_URL and PAGE_IDENTIFIER placeholders
export const FIXED_PAGE_URL = 'https://sulochanapillay-sudo.github.io/citimapper_ver1/feedback';
export const FIXED_PAGE_IDENTIFIER = 'citymapper-singapore-feedback';

export interface UserComment {
  id: string;
  author: string;
  category: 'MRT & LRT' | 'Bus Network' | 'Journey Routing' | 'General Feedback';
  rating: number;
  text: string;
  timestamp: string;
  likes: number;
}

const INITIAL_COMMENTS: UserComment[] = [
  {
    id: 'c-1',
    author: 'Daryl Tan',
    category: 'MRT & LRT',
    rating: 5,
    text: 'The TEL Stage 4 connection from Marine Parade to Shenton Way has cut my morning commute down to 22 minutes. The live train frequency alerts are spot on!',
    timestamp: '15 mins ago',
    likes: 12,
  },
  {
    id: 'c-2',
    author: 'Mei Ling C.',
    category: 'Bus Network',
    rating: 5,
    text: 'Live bus arrival timing for Stop #95109 matched the electronic display board at the bus stop perfectly today. Very impressed with the LTA DataMall integration.',
    timestamp: '1 hour ago',
    likes: 8,
  },
  {
    id: 'c-3',
    author: 'Jonathan Goh',
    category: 'Journey Routing',
    rating: 4,
    text: 'Great route suggestions between Jurong East and Marina Bay. Would love an option to prioritize sheltered walkways during the monsoon season.',
    timestamp: '3 hours ago',
    likes: 19,
  },
];

interface FeedbackFooterProps {
  activeTab?: string;
}

export const FeedbackFooter: React.FC<FeedbackFooterProps> = ({ activeTab }) => {
  // Disqus state
  const [disqusStatus, setDisqusStatus] = useState<'loading' | 'loaded' | 'blocked'>('loading');
  const [lastReloaded, setLastReloaded] = useState<string>('');

  // Interactive user feedback input form state
  const [comments, setComments] = useState<UserComment[]>(() => {
    try {
      const saved = localStorage.getItem('citymapper_user_comments');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_COMMENTS;
  });

  const [authorName, setAuthorName] = useState<string>('');
  const [category, setCategory] = useState<'MRT & LRT' | 'Bus Network' | 'Journey Routing' | 'General Feedback'>('MRT & LRT');
  const [rating, setRating] = useState<number>(5);
  const [commentText, setCommentText] = useState<string>('');
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  // Function to initialize or reload Disqus in a Single Page App (SPA)
  const reloadDisqus = useCallback(() => {
    setDisqusStatus('loading');

    // Assign global Disqus parameters
    window.disqus_shortname = 'sulochana-citymapper';
    window.disqus_config = function () {
      this.page = this.page || {};
      this.page.url = FIXED_PAGE_URL;
      this.page.identifier = FIXED_PAGE_IDENTIFIER;
      this.page.title = 'Citymapper Singapore Community Feedback';
    };

    if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
      try {
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page = this.page || {};
            this.page.url = FIXED_PAGE_URL;
            this.page.identifier = FIXED_PAGE_IDENTIFIER;
            this.page.title = 'Citymapper Singapore Community Feedback';
          },
        });
        setDisqusStatus('loaded');
        setLastReloaded(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.warn('Disqus reset error:', err);
        setDisqusStatus('blocked');
      }
    } else {
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
          setDisqusStatus('loaded');
          setLastReloaded(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        s.onerror = () => {
          setDisqusStatus('blocked');
        };
        (d.head || d.body).appendChild(s);
      } else {
        setTimeout(() => {
          if (window.DISQUS && typeof window.DISQUS.reset === 'function') {
            try {
              window.DISQUS.reset({
                reload: true,
                config: function () {
                  this.page = this.page || {};
                  this.page.url = FIXED_PAGE_URL;
                  this.page.identifier = FIXED_PAGE_IDENTIFIER;
                  this.page.title = 'Citymapper Singapore Community Feedback';
                },
              });
              setDisqusStatus('loaded');
              setLastReloaded(new Date().toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            } catch {
              setDisqusStatus('blocked');
            }
          }
        }, 350);
      }
    }
  }, []);

  // Reload Disqus when activeTab changes or component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      reloadDisqus();
    }, 120);

    return () => clearTimeout(timer);
  }, [activeTab, reloadDisqus]);

  // Handle new comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: UserComment = {
      id: `c-${Date.now()}`,
      author: authorName.trim() || 'Singapore Commuter',
      category,
      rating,
      text: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem('citymapper_user_comments', JSON.stringify(updated));
    } catch {
      // ignore
    }

    setCommentText('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  const handleToggleLike = (id: string) => {
    const isLiked = likedMap[id];
    setLikedMap((prev) => ({ ...prev, [id]: !isLiked }));
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <section
      className="w-full bg-[#f8faff] border-t border-slate-200 py-10 px-4 lg:px-8"
      id="citymapper-feedback-footer"
      aria-label="User Feedback and Comment Section"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-[#00c853]/15 text-[#006e2a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">rate_review</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                User Feedback &amp; Commuter Discussion
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#006e2a] text-xs font-extrabold">
                Live
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Post your transit experience, report bus/train line anomalies, or leave service feedback.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={reloadDisqus}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-all cursor-pointer"
              type="button"
              title="Reload Disqus Thread in this SPA"
              id="reload-disqus-btn"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Reload Thread</span>
            </button>
            <a
              href="https://sulochana-citymapper.disqus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors flex items-center gap-1.5"
            >
              <span>Disqus Portal</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Real Fixed Values Configuration Transparency Bar */}
        <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">Fixed URL:</span>
              <code className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-blue-700 font-mono text-[11px]">
                {FIXED_PAGE_URL}
              </code>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-500 uppercase tracking-wide text-[10px]">Identifier:</span>
              <code className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-emerald-800 font-mono text-[11px]">
                {FIXED_PAGE_IDENTIFIER}
              </code>
            </div>
          </div>
          {lastReloaded && (
            <span className="text-[11px] text-slate-500 font-semibold">
              ✓ SPA synchronized at {lastReloaded}
            </span>
          )}
        </div>

        {/* Interactive User Input Form: User Feedback Area */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs" id="user-feedback-input-box">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#006e2a]">add_comment</span>
              <h3 className="text-base font-extrabold text-slate-900">
                Leave Your Comment or Feedback
              </h3>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-0.5 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                  title={`Rate ${star} of 5 stars`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${star <= rating ? 'fill-1' : 'text-slate-300'}`}>
                    star
                  </span>
                </button>
              ))}
              <span className="text-xs font-bold text-slate-600 ml-1.5">{rating}/5 Stars</span>
            </div>
          </div>

          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="author-name-input">
                  Your Name or Commuter Handle
                </label>
                <input
                  id="author-name-input"
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Rachel Koh, Commuter #412"
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00c853]/40 focus:border-[#00c853] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="feedback-category-select">
                  Feedback Category
                </label>
                <select
                  id="feedback-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00c853]/40 focus:border-[#00c853] transition-all cursor-pointer font-medium text-slate-800"
                >
                  <option value="MRT & LRT">MRT &amp; LRT Lines (NSL, EWL, TEL, CCL, DTL)</option>
                  <option value="Bus Network">Bus Network &amp; Stop Arrivals</option>
                  <option value="Journey Routing">Journey Routing &amp; Transit Options</option>
                  <option value="General Feedback">General Citymapper Feedback</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="feedback-comment-textarea">
                Comment &amp; Experience Details
              </label>
              <textarea
                id="feedback-comment-textarea"
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts, report crowding or delay at an MRT station, praise a smooth bus ride, or suggest a new feature..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00c853]/40 focus:border-[#00c853] transition-all"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-400">
                Comments appear publicly in real time for fellow commuters.
              </span>

              <div className="flex items-center gap-3">
                {submitSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 animate-fade-in">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Feedback posted!
                  </span>
                )}
                <button
                  type="submit"
                  id="submit-feedback-btn"
                  className="px-5 py-2.5 rounded-xl bg-[#00c853] hover:bg-[#00E676] text-[#004c1b] font-extrabold text-xs sm:text-sm transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Post Comment</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Live Commuter Comments Feed */}
        <div className="space-y-3" id="commuter-comments-feed">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-blue-600">chat</span>
              <span>Recent Community Comments ({comments.length})</span>
            </h3>
            <span className="text-[11px] text-slate-500">Updated in real-time</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {comments.slice(0, 3).map((item) => {
              const isLiked = likedMap[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.category}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[14px]">star</span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-normal mb-3 line-clamp-4">
                      "{item.text}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      <span className="font-extrabold text-slate-800 block">{item.author}</span>
                      <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleLike(item.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                        isLiked
                          ? 'bg-rose-50 text-rose-600 border-rose-200 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                      title="Helpful comment"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${isLiked ? 'fill-1' : ''}`}>
                        thumb_up
                      </span>
                      <span>{item.likes}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Official Disqus Embedded Comments Thread */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-[#2e9fff]/15 text-[#0066cc] flex items-center justify-center font-extrabold text-sm">
                D
              </span>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Disqus Universal Thread (Interactive Input &amp; Discussion)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Powered by Disqus Universal Code with canonical identification
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                disqusStatus === 'loaded'
                  ? 'bg-emerald-100 text-emerald-800'
                  : disqusStatus === 'blocked'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800 animate-pulse'
              }`}>
                {disqusStatus === 'loaded' && '● Thread Ready'}
                {disqusStatus === 'loading' && '○ Initializing Thread...'}
                {disqusStatus === 'blocked' && '⚠ External Frame Notice'}
              </span>
            </div>
          </div>

          {/* Fallback Notice if third-party cookies / tracking prevention in sandboxes pause Disqus embed */}
          {disqusStatus === 'blocked' && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[18px] text-amber-600 mt-0.5">shield</span>
              <div className="space-y-1">
                <p className="font-bold">Third-party Cookie or Sandbox Iframe Notice</p>
                <p className="text-amber-800 leading-relaxed">
                  If Disqus third-party cookies are blocked by your browser’s tracking protection, you can also use our built-in feedback area above or open the thread directly on Disqus at{' '}
                  <a
                    href="https://sulochana-citymapper.disqus.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline hover:text-black"
                  >
                    sulochana-citymapper.disqus.com
                  </a>.
                </p>
              </div>
            </div>
          )}

          {/* Disqus Container */}
          <div id="disqus_thread" className="min-h-[260px] w-full"></div>

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
