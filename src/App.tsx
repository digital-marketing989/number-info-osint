import { useState, useEffect, useCallback } from 'react';
import { Search, ShieldAlert, ShieldCheck, Terminal, Users, ExternalLink, XCircle, Loader2, Lock, Unlock, CheckCircle2, Copy, Check } from 'lucide-react';

// --- COPY HOOK ---
function useCopy(timeout = 1800) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), timeout);
    });
  }, [timeout]);
  return { copiedKey, copy };
}

// --- MOCK DATA ---
const MOCK_RESULTS: Record<string, any> = {
  'DZ-984271': {
    status: 'SUCCESS',
    queryId: 'DZ-984271',
    category: 'Educational Example',
    source: 'Darkie Zone Dataset',
    confidence: 'High',
    timestamp: new Date().toISOString(),
    notes: 'This is a record for UI purposes.'
  }
};

const COMMUNITY_LINKS = [
  { id: 'group1', title: 'COMMUNITY GROUP 1', link: 'https://chat.whatsapp.com/Hm6SPG7GShEKbJv29D5hGH' },
  { id: 'group2', title: 'COMMUNITY GROUP 2', link: 'https://chat.whatsapp.com/FvYP5p6ksBh0AhaeHEYW97' },
  { id: 'channel', title: 'OFFICIAL CHANNEL',  link: 'https://whatsapp.com/channel/0029VbB3RHNHbFVFUyjAbh00' },
];

const STORAGE_KEY = 'darkie_visited_links';

// --- COMPONENTS ---

const Header = () => (
  <header className="fixed top-0 w-full z-50 glass-panel-neon border-b-0 border-neon-cyan/50 py-2 sm:py-3 px-4 sm:px-6 flex flex-row items-center justify-between transition-all gap-2">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
      <div className="p-1.5 sm:p-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30 shrink-0">
        <ShieldCheck className="text-neon-cyan w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="min-w-0">
        <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-white tracking-wider sm:tracking-widest glow-text-cyan leading-tight truncate">DARKIE ZONE CYBERSECURITY</h1>
        <p className="text-[10px] sm:text-xs text-neon-cyan/70 tracking-wider font-mono hidden sm:block">Cybersecurity Learning &amp; Information Dashboard</p>
        <p className="text-[9px] sm:text-[10px] font-mono tracking-wider mt-0.5">
          <span className="text-gray-600">Created by </span>
          <span className="text-neon-green font-bold glow-text-green">KRISHNA DAS</span>
        </p>
      </div>
    </div>
    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 bg-black/50 rounded-full border border-neon-green/30 shrink-0">
      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_#0f0]"></div>
      <span className="text-[10px] sm:text-xs text-neon-green font-semibold tracking-wider whitespace-nowrap">ONLINE</span>
    </div>
  </header>
);

const SecurityNotice = () => (
  <div className="max-w-4xl mx-auto mt-6 sm:mt-8 p-3 sm:p-4 glass-panel border-l-4 border-l-yellow-500/70 rounded-r-lg flex items-start gap-3">
    <ShieldAlert className="text-yellow-500/70 w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5" />
    <div>
      <h3 className="text-xs sm:text-sm font-bold text-yellow-500/90 tracking-wider mb-1">SECURITY NOTICE</h3>
      <p className="text-[11px] sm:text-xs text-gray-400 leading-relaxed">
        This platform is strictly intended for <span className="text-yellow-400 font-semibold">authorized cybersecurity research, OSINT investigation, and educational purposes</span> only.
        Unauthorized use of any information obtained through this tool against individuals, systems, or organizations is <span className="text-red-400 font-semibold">illegal and punishable by law</span>.
        By using this tool, you confirm that you have full legal authorization to access and process the requested data.
        Darkie Zone Cybersecurity holds <span className="text-white font-semibold">zero liability</span> for any misuse or unlawful activity conducted using this platform.
      </p>
    </div>
  </div>
);

// --- COMMUNITY GATE SECTION ---
interface CommunitySectionProps {
  visitedLinks: Set<string>;
  onLinkClick: (id: string) => void;
  showGate: boolean;
}

const CommunitySection = ({ visitedLinks, onLinkClick, showGate }: CommunitySectionProps) => {
  const total = COMMUNITY_LINKS.length;
  const visited = visitedLinks.size;
  const allVisited = visited >= total;
  const progressPercent = Math.round((visited / total) * 100);

  return (
    <div className="max-w-4xl mx-auto mt-8 sm:mt-12 mb-8 sm:mb-12">
      <h2 className="text-center text-lg sm:text-xl font-bold text-white tracking-widest mb-2 flex items-center justify-center gap-2 glow-text-cyan">
        <Users className="text-neon-cyan w-5 h-5" />
        DARKIE ZONE COMMUNITY
      </h2>

      {showGate && (
        <div className={`mb-6 p-4 rounded-xl border transition-all duration-500 ${
          allVisited
            ? 'bg-neon-green/10 border-neon-green/50 shadow-[0_0_20px_rgba(0,255,100,0.15)]'
            : 'bg-yellow-900/10 border-yellow-500/30'
        }`}>
          {/* Status row */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {allVisited ? (
                <Unlock className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green animate-pulse shrink-0" />
              ) : (
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse shrink-0" />
              )}
              <span className={`text-xs sm:text-sm font-bold tracking-wide sm:tracking-widest ${allVisited ? 'text-neon-green' : 'text-yellow-400'}`}>
                {allVisited ? 'RESULTS UNLOCKED — ELIGIBLE' : `JOIN TO UNLOCK (${visited}/${total})`}
              </span>
            </div>
            <span className={`text-xs font-mono font-bold px-2 py-1 rounded shrink-0 ${
              allVisited ? 'bg-neon-green/20 text-neon-green' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {progressPercent}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                allVisited
                  ? 'bg-gradient-to-r from-neon-green to-neon-cyan shadow-[0_0_8px_#0f0]'
                  : 'bg-gradient-to-r from-yellow-500 to-orange-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {!allVisited && (
            <p className="text-xs text-gray-400 mt-2 tracking-wide">
              ⚡ Click all community links below to join — search results will unlock automatically.
            </p>
          )}
        </div>
      )}

      {/* Link cards */}
      <CommunitylinkCards visitedLinks={visitedLinks} onLinkClick={onLinkClick} />
    </div>
  );
};

// Extracted so useCopy hook works cleanly
const CommunitylinkCards = ({ visitedLinks, onLinkClick }: { visitedLinks: Set<string>; onLinkClick: (id: string) => void }) => {
  const { copiedKey, copy } = useCopy();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {COMMUNITY_LINKS.map((btn) => {
        const isVisited = visitedLinks.has(btn.id);
        const isCopied = copiedKey === btn.id;
        return (
          <div
            key={btn.id}
            className={`group relative flex items-center justify-between gap-2 p-4 glass-panel transition-all duration-300 rounded-lg overflow-hidden border ${
              isVisited
                ? 'border-neon-green/60 bg-neon-green/5 shadow-[0_0_14px_rgba(0,255,100,0.12)]'
                : 'border-white/10 hover:bg-neon-cyan/10 hover:border-neon-cyan/50'
            }`}
          >
            {/* Shimmer */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>

            {/* Open link */}
            <a
              href={btn.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onLinkClick(btn.id)}
              className="flex items-center gap-2 flex-grow min-w-0"
            >
              {isVisited ? (
                <CheckCircle2 className="w-5 h-5 text-neon-green shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-gray-500 shrink-0" />
              )}
              <span className={`text-sm font-bold tracking-wider truncate ${isVisited ? 'text-neon-green' : 'text-gray-200 group-hover:text-white'}`}>
                {btn.title}
              </span>
            </a>

            {/* Right actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Copy button */}
              <button
                onClick={(e) => { e.stopPropagation(); copy(btn.link, btn.id); }}
                title="Copy link"
                className={`relative p-1.5 rounded transition-all duration-200 ${
                  isCopied
                    ? 'text-neon-green bg-neon-green/10'
                    : 'text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/10'
                }`}
              >
                {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {isCopied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-neon-green text-black px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                    Copied!
                  </span>
                )}
              </button>
              <a href={btn.link} target="_blank" rel="noopener noreferrer" onClick={() => onLinkClick(btn.id)}>
                <ExternalLink className={`w-4 h-4 shrink-0 transition-colors ${isVisited ? 'text-neon-green' : 'text-neon-cyan/70 hover:text-neon-cyan'}`} />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Footer = () => (
  <footer className="w-full border-t border-white/5 bg-black/60 mt-auto">
    {/* Top divider glow */}
    <div className="h-px w-full bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />

    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Main creator row */}
      <div className="text-center mb-8">
        <span className="text-[10px] text-gray-600 tracking-[0.3em] uppercase block mb-2">CRAFTED &amp; MAINTAINED BY</span>
        <span className="text-2xl font-black tracking-widest text-white glow-text-cyan" style={{ fontFamily: 'monospace', letterSpacing: '0.2em' }}>
          KRISHNA'S .D
        </span>
        <div className="mt-2 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_6px_#0f0]" />
          <span className="text-[10px] text-neon-green tracking-widest font-semibold">ACTIVE DEVELOPER</span>
          <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_6px_#0f0]" />
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-center mb-6 sm:mb-8">
        <div className="p-4 rounded-lg bg-white/3 border border-white/5 hover:border-neon-cyan/20 transition-colors">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-1">Platform</p>
          <p className="text-xs text-gray-300 font-bold tracking-wider">DARKIE ZONE CYBERSECURITY</p>
        </div>
        <div className="p-4 rounded-lg bg-white/3 border border-white/5 hover:border-neon-cyan/20 transition-colors">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-1">Purpose</p>
          <p className="text-xs text-gray-300 font-bold tracking-wider">Cybersecurity Education &amp; OSINT</p>
        </div>
        <div className="p-4 rounded-lg bg-white/3 border border-white/5 hover:border-neon-cyan/20 transition-colors">
          <p className="text-[10px] text-gray-600 tracking-widest uppercase mb-1">Version</p>
          <p className="text-xs text-gray-300 font-bold tracking-wider font-mono">v2.0 — DARK EDITION</p>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="border-t border-white/5 pt-6 text-center space-y-1">
        <p className="text-[11px] text-gray-500 tracking-widest">
          © 2036 <span className="text-gray-400 font-semibold">Darkie Zone Cybersecurity</span>. All rights reserved.
        </p>
        <p className="text-[10px] text-gray-600 italic">
          Use responsibly. This tool is for authorized educational &amp; research use only.
        </p>
        <p className="text-[10px] text-gray-700 tracking-widest mt-1">
          ⚡ Built with passion by <span className="text-neon-cyan/60">KRISHNA'S .D</span>
        </p>
      </div>
    </div>
  </footer>
);


// --- RESULT CARDS with copy buttons ---
const ResultCards = ({ result }: { result: Record<string, any> }) => {
  const { copiedKey, copy } = useCopy();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
      {Object.entries(result).map(([key, value], idx) => {
        const isCopied = copiedKey === key;
        const strVal = String(value);
        return (
          <div
            key={key}
            className="glass-panel p-5 rounded-lg border-l-2 border-l-neon-green hover:border-l-neon-cyan hover:bg-white/5 transition-all duration-300 group"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">{key}</span>
              <button
                onClick={() => copy(strVal, key)}
                title="Copy value"
                className={`relative shrink-0 p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                  isCopied
                    ? 'text-neon-green bg-neon-green/10 opacity-100'
                    : 'text-gray-500 hover:text-neon-cyan hover:bg-neon-cyan/10'
                }`}
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {isCopied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-neon-green text-black px-1.5 py-0.5 rounded whitespace-nowrap shadow z-10">
                    Copied!
                  </span>
                )}
              </button>
            </div>
            <span className="text-sm font-mono text-gray-200 break-words font-semibold">
              {strVal}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Load visited links from localStorage on mount
  const [visitedLinks, setVisitedLinks] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const allLinksVisited = visitedLinks.size >= COMMUNITY_LINKS.length;

  // Persist visited links
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visitedLinks]));
  }, [visitedLinks]);

  const handleLinkClick = (id: string) => {
    setVisitedLinks(prev => new Set([...prev, id]));
  };

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setError('Please enter a valid identifier.');
      return;
    }

    setError('');
    setIsLoading(true);
    setHasSearched(true);
    setResult(null);

    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      if (MOCK_RESULTS[trimmed]) {
        setResult(MOCK_RESULTS[trimmed]);
      } else {
        setResult({ empty: true });
      }
    }, 1500);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError('');
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-dark-bg bg-grid-pattern">
      {/* Animated subtle grid overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-black/80 to-black z-0"></div>

      <Header />

      <main className="flex-grow pt-20 sm:pt-24 pb-12 px-3 sm:px-4 md:px-6 z-10 w-full">

        {/* Search Panel */}
        <div className="max-w-3xl mx-auto glass-panel-neon p-4 sm:p-6 md:p-8 rounded-xl relative overflow-hidden">
          {/* Decorative terminal header */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan via-neon-green to-neon-cyan"></div>

          <div className="text-center mb-5 sm:mb-8">
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-widest mb-2 flex items-center justify-center gap-2 sm:gap-3">
              <Terminal className="text-neon-cyan w-5 h-5 sm:w-6 sm:h-6" />
              INFORMATION QUERY
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">Enter an identifier to explore the dashboard interface.</p>
          </div>

          <div className="relative">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter identifier (e.g. DZ-984271)"
                  className="w-full bg-black/50 border border-white/20 text-white placeholder-gray-600 rounded-lg pl-10 sm:pl-12 pr-10 py-3 sm:py-4 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all font-mono text-sm"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-lg tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-full sm:w-auto sm:min-w-[140px] text-sm sm:text-base"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'SEARCH'}
              </button>
            </div>

            {/* Toast Error inside panel */}
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="max-w-4xl mx-auto mt-5 sm:mt-8 min-h-[200px] sm:min-h-[300px]">

          {/* Empty State */}
          {!hasSearched && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-700 opacity-50 hover:opacity-100 transition-opacity">
              <div className="p-4 rounded-full bg-white/5 mb-4 border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                <Terminal className="w-12 h-12 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-400 tracking-widest mb-2">READY FOR QUERY</h3>
              <p className="text-sm text-gray-500">Enter an identifier to begin.</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-neon-green/20 border-b-neon-green rounded-full animate-spin-reverse"></div>
                </div>
              </div>
              <p className="mt-6 text-neon-cyan tracking-widest font-bold animate-pulse text-sm">QUERYING DATA SERVICE...</p>
            </div>
          )}

          {/* LOCKED: searched but links not all visited */}
          {result && !isLoading && !allLinksVisited && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass-panel rounded-xl p-6 sm:p-10 text-center border border-yellow-500/30 bg-yellow-900/5 shadow-[0_0_30px_rgba(234,179,8,0.08)]">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500/40 flex items-center justify-center animate-pulse">
                      <Lock className="w-9 h-9 text-yellow-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-black text-black">{COMMUNITY_LINKS.length - visitedLinks.size}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black tracking-widest text-yellow-400">RESULTS LOCKED</h3>
                  <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                    To access your search results, you must join the <span className="text-yellow-400 font-bold">Darkie Zone community</span>. Click all links below to unlock.
                  </p>
                  <div className="flex gap-2 mt-2">
                    {COMMUNITY_LINKS.map(l => (
                      <div key={l.id} className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                        visitedLinks.has(l.id) ? 'bg-neon-green border-neon-green shadow-[0_0_6px_#0f0]' : 'bg-transparent border-gray-600'
                      }`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{visitedLinks.size} / {COMMUNITY_LINKS.length} links visited</p>
                </div>
              </div>
            </div>
          )}

          {/* UNLOCKED: Results visible */}
          {result && !isLoading && allLinksVisited && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

              {/* Eligible badge */}
              <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-neon-green/10 border border-neon-green/40 shadow-[0_0_16px_rgba(0,255,100,0.1)]">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-neon-green shrink-0" />
                <span className="text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest text-neon-green">✓ ELIGIBLE USER — FULL ACCESS GRANTED</span>
              </div>

              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                <h3 className="text-base sm:text-xl font-bold text-white tracking-widest">QUERY RESULT</h3>
                <button
                  onClick={handleClear}
                  className="text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1 rounded transition-colors"
                >
                  CLEAR RESULTS
                </button>
              </div>

              {result.empty ? (
                <div className="glass-panel p-8 text-center rounded-lg border-red-500/30">
                  <XCircle className="w-10 h-10 text-red-500/70 mx-auto mb-3" />
                  <h4 className="text-red-400 font-bold tracking-widest mb-1">NO DATA FOUND</h4>
                  <p className="text-sm text-gray-500">No authorized information was returned for this identifier, contact admin <span className="text-yellow-400 font-bold">7377504157</span></p>
                </div>
              ) : (
                <ResultCards result={result} />
              )}
            </div>
          )}
        </div>

        <SecurityNotice />

        {/* Community section — always visible, gate mode activates when searched */}
        <CommunitySection
          visitedLinks={visitedLinks}
          onLinkClick={handleLinkClick}
          showGate={hasSearched}
        />

      </main>

      <Footer />

      {/* Global CSS for custom animations needed by Tailwind in-component */}
      <style>{`
        .animate-spin-reverse {
          animation: spin 1s linear infinite reverse;
        }
      `}</style>
    </div>
  );
}
