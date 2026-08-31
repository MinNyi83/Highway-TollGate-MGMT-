import { ExternalLink, Maximize2, RefreshCw } from 'lucide-react';
import { useRef } from 'react';

export default function Presentation() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = '/presentation.html';
    }
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col space-y-3">
      {/* Presentation Top Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <span className="font-bold text-xs">ITS</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 dark:text-white">
              Highway Intelligent Toll & Traffic Management Presentation
            </h1>
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Dahua-Inspired Solution Showcase · RFID + ANPR Integration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors"
            title="Reload Slides"
          >
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={handleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg border border-slate-200 dark:border-white/10 transition-colors"
            title="Fullscreen Frame"
          >
            <Maximize2 size={14} />
            <span>Fullscreen</span>
          </button>

          <a
            href="/presentation.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
          >
            <ExternalLink size={14} />
            <span>Open in New Tab</span>
          </a>
        </div>
      </div>

      {/* Embedded Presentation Frame */}
      <div className="flex-1 w-full bg-slate-950 rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden shadow-xl">
        <iframe
          ref={iframeRef}
          src="/presentation.html"
          title="Highway Tollgate Management Presentation"
          className="w-full h-full border-0"
          allow="fullscreen"
        />
      </div>
    </div>
  );
}
