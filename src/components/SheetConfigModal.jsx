import React, { useState } from 'react';
import { X, FileSpreadsheet, RefreshCw, Check, AlertCircle, HelpCircle } from 'lucide-react';
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
  const [phoneInput, setPhoneInput] = useState(CONFIG.WHATSAPP_PHONE);
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white border border-black p-6 sm:p-8 font-mono shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-black" />
              <h2 className="text-base font-bold uppercase tracking-widest text-black">
                GOOGLE SHEETS CMS SETTINGS
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="py-6 space-y-5 text-xs">
            <div className="space-y-1.5">
              <label className="block uppercase tracking-wider font-bold text-neutral-800">
                Published Google Sheet CSV URL:
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv"
                className="w-full p-2.5 border border-neutral-300 focus:border-black focus:outline-none bg-neutral-50 text-black font-sans text-xs"
              />
              <p className="text-[11px] text-neutral-500 font-sans">
                The URL must be published via <span className="font-semibold text-black">File &gt; Share &gt; Publish to web &gt; CSV</span>.
              </p>
            </div>

            {/* How it works guidance */}
            <div className="p-4 border border-neutral-200 bg-neutral-50 space-y-2">
              <div className="flex items-center gap-1.5 font-bold uppercase text-[11px] text-black">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Required Google Sheet Columns:</span>
              </div>
              <div className="text-[11px] text-neutral-700 font-mono bg-white p-2 border border-neutral-200 overflow-x-auto">
                id, name, category, price, image, description
              </div>
              <p className="text-[10px] text-neutral-500 font-sans">
                Any changes made in Google Sheets automatically propagate to this SPA upon page reload without
                redeploying code.
              </p>
            </div>

            {/* Current Sync Status */}
            <div className="flex items-center justify-between p-3 border border-neutral-200 text-xs">
              <span className="uppercase tracking-wider text-neutral-500">Current CMS State:</span>
              <span className="font-bold flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isLiveSynced ? 'bg-black' : 'bg-neutral-400'
                  }`}
                />
                {isLiveSynced ? 'ONLINE (Google Sheets Synced)' : 'OFFLINE (Using Built-in Atelier Cache)'}
              </span>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="text-neutral-500 hover:text-black uppercase text-[11px] tracking-wider underline"
              >
                Reset to Default
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-neutral-300 hover:border-black text-black uppercase text-xs tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white hover:bg-white hover:text-black border border-black uppercase text-xs tracking-widest font-bold flex items-center gap-1.5 transition-colors"
                >
                  {savedNotice ? <Check className="w-3.5 h-3.5" /> : <RefreshCw className="w-3.5 h-3.5" />}
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
