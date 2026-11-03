import React, { useState } from 'react';
import { X, FileSpreadsheet, RefreshCw, Check, HelpCircle, ShieldCheck } from 'lucide-react';
import { CONFIG } from '../config';

export const SheetConfigModal = ({
  isOpen,
  onClose,
  currentUrl,
  onSaveUrl,
  onReload,
  isLiveSynced,
}) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveUrl(urlInput.trim());
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onReload();
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setUrlInput(CONFIG.SHEET_CSV_URL);
    onSaveUrl('');
    onReload();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-white/15 p-6 sm:p-8 font-mono text-white shadow-2xl my-8">
          
          <div className="flex items-center justify-between pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-300">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold uppercase tracking-wider text-white font-heading">
                  GOOGLE SHEETS CMS SETTINGS
                </h2>
                <div className="text-[10px] text-neutral-400">
                  SERVERLESS DYNAMIC INVENTORY
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="py-6 space-y-5 text-xs">
            <div className="space-y-2">
              <label className="block uppercase tracking-wider font-bold text-neutral-300">
                Published Google Sheet CSV URL:
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv"
                className="w-full p-3 rounded-xl border border-white/15 focus:border-amber-400 focus:outline-none bg-white/[0.04] text-white font-sans text-xs transition-colors"
              />
              <p className="text-[11px] text-neutral-400 font-sans">
                In Google Sheets, navigate to <span className="text-white font-semibold">File &gt; Share &gt; Publish to web &gt; CSV</span>.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-2">
              <div className="flex items-center gap-2 font-bold uppercase text-[11px] text-amber-300">
                <HelpCircle className="w-4 h-4" />
                <span>Required CSV Column Headers:</span>
              </div>
              <div className="text-[11px] text-neutral-200 font-mono bg-black/60 p-2.5 rounded-lg border border-white/10 overflow-x-auto">
                id, name, category, price, image, description
              </div>
              <p className="text-[10px] text-neutral-400 font-sans">
                Edits made in your Google Sheet immediately sync to this SPA without code deployment or build steps.
              </p>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/[0.02] text-xs">
              <span className="uppercase tracking-wider text-neutral-400">Current CMS Sync State:</span>
              <span className="font-bold flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isLiveSynced ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className={isLiveSynced ? 'text-emerald-400' : 'text-amber-400'}>
                  {isLiveSynced ? 'ONLINE (Google Sheets Synced)' : 'CACHED (Built-in Atelier Collection)'}
                </span>
              </span>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="text-neutral-400 hover:text-white uppercase text-[11px] tracking-wider underline transition-colors"
              >
                Reset to Default
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full border border-white/15 hover:border-white text-white uppercase text-xs tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white hover:bg-amber-200 text-black uppercase text-xs tracking-widest font-bold flex items-center gap-1.5 transition-all shadow-glow hover:scale-105"
                >
                  {savedNotice ? <Check className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                  <span>{savedNotice ? 'SAVED' : 'SAVE & SYNC'}</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
