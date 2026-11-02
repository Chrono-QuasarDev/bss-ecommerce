import React, { useState, useEffect } from 'react';
import { Lock, Unlock, KeyRound, ExternalLink, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { CONFIG } from '../config';
import { buildVipInquiryUrl } from '../utils/checkout';
import { formatGHS } from '../utils/formatters';

export const PremiumMockups = () => {
  // Store unlocked IDs in array persisted to localStorage
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.UNLOCKED_MOCKUPS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track PIN inputs and error states per card
  const [pinInputs, setPinInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [successNotices, setSuccessNotices] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.UNLOCKED_MOCKUPS, JSON.stringify(unlockedIds));
    } catch (e) {
      console.error('Failed to save unlocked mockups state', e);
    }
  }, [unlockedIds]);

  const handlePinChange = (mockupId, value) => {
    setPinInputs((prev) => ({ ...prev, [mockupId]: value }));
    // Clear previous error on input
    if (errors[mockupId]) {
      setErrors((prev) => ({ ...prev, [mockupId]: null }));
    }
  };

  const handleUnlock = (mockupId) => {
    const enteredPin = (pinInputs[mockupId] || '').trim();
    if (!enteredPin) {
      setErrors((prev) => ({
        ...prev,
        [mockupId]: 'Please enter a VIP PIN.',
      }));
      return;
    }

    if (enteredPin.toUpperCase() === CONFIG.VIP_PIN.toUpperCase()) {
      // Valid PIN
      setUnlockedIds((prev) => (prev.includes(mockupId) ? prev : [...prev, mockupId]));
      setSuccessNotices((prev) => ({ ...prev, [mockupId]: 'PIN Accepted. Archive Revealed.' }));
      setErrors((prev) => ({ ...prev, [mockupId]: null }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [mockupId]: `Invalid PIN. Tap 'Purchase Access (${formatGHS(CONFIG.VIP_ACCESS_PRICE_GHS)})' to request a valid code via WhatsApp.`,
      }));
    }
  };

  const handlePurchaseAccess = (mockupName) => {
    const waUrl = buildVipInquiryUrl(CONFIG.WHATSAPP_PHONE, mockupName);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUnlockAllTester = () => {
    const allIds = CONFIG.PREMIUM_MOCKUPS.map((m) => m.id);
    setUnlockedIds(allIds);
  };

  const handleLockAllTester = () => {
    setUnlockedIds([]);
    setPinInputs({});
  };

  return (
    <section id="mockups-section" className="bg-neutral-950 text-white py-16 sm:py-24 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Monochromatic VIP Aesthetics */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 uppercase">
              <Sparkles className="w-4 h-4 text-white" />
              <span>CONFIDENTIAL ARCHIVE • PENDING SLOTS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-light tracking-tight uppercase font-mono text-white">
              PREMIUM MOCK-UPS & CAD PROTOTYPES
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-sans max-w-2xl leading-relaxed">
              Unreleased garments undergoing pattern engineering at our Accra studio. Access is strictly
              controlled via single-use encrypted VIP PINs. Verified holders view 4K CAD schematics and secure
              pre-order production priority.
            </p>
          </div>

          {/* Quick status badge / Test helper */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-3 py-1.5 border border-neutral-800 bg-neutral-900 text-neutral-300">
              {unlockedIds.length} / {CONFIG.PREMIUM_MOCKUPS.length} UNLOCKED
            </span>
            {unlockedIds.length > 0 ? (
              <button
                onClick={handleLockAllTester}
                className="px-2.5 py-1.5 border border-neutral-700 hover:border-white text-neutral-400 hover:text-white transition-colors uppercase text-[10px]"
                title="Reset all locked states"
              >
                Reset Locks
              </button>
            ) : (
              <button
                onClick={handleUnlockAllTester}
                className="px-2.5 py-1.5 border border-neutral-700 hover:border-white text-neutral-400 hover:text-white transition-colors uppercase text-[10px]"
                title="Quick demo unlock all"
              >
                Demo Unlock
              </button>
            )}
          </div>
        </div>

        {/* Mockups Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
          {CONFIG.PREMIUM_MOCKUPS.map((mockup) => {
            const isUnlocked = unlockedIds.includes(mockup.id);
            const currentPin = pinInputs[mockup.id] || '';
            const error = errors[mockup.id];
            const success = successNotices[mockup.id];

            return (
              <div
                key={mockup.id}
                className="flex flex-col bg-neutral-900 border border-neutral-800 hover:border-neutral-600 transition-colors"
              >
                {/* Visual Area (Blurred or Crisp) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black border-b border-neutral-800 flex items-center justify-center">
                  <img
                    src={isUnlocked ? mockup.revealedImage : mockup.blurredImage}
                    alt={mockup.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isUnlocked
                        ? 'filter blur-0 scale-100'
                        : 'filter blur-2xl scale-110 brightness-50 select-none pointer-events-none'
                    }`}
                  />

                  {/* Overlaid Locked / Unlocked Status Badge */}
                  {!isUnlocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-sm">
                      <div className="p-3 bg-black/80 border border-neutral-700 mb-3">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                      <span className="font-mono text-xs uppercase tracking-widest font-bold text-white mb-1">
                        CONFIDENTIAL PROTOCOL
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider">
                        {mockup.edition}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-3 left-3 bg-white text-black px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 shadow-none">
                      <Unlock className="w-3 h-3" />
                      <span>ACCESS GRANTED</span>
                    </div>
                  )}

                  {/* Top right reference ID */}
                  <div className="absolute top-3 right-3 bg-black/90 border border-neutral-800 px-2 py-0.5 text-[9px] font-mono tracking-widest text-neutral-400">
                    {mockup.id}
                  </div>
                </div>

                {/* Card Content & Action Flow */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      <span>{mockup.category}</span>
                      <span>{mockup.releaseQuarter}</span>
                    </div>

                    <h3 className="text-base font-medium uppercase font-mono tracking-tight text-white">
                      {mockup.name}
                    </h3>

                    {/* Revealed Tech Specs vs Locked Teaser */}
                    {isUnlocked ? (
                      <div className="space-y-2 pt-2 border-t border-neutral-800 text-xs font-mono text-neutral-300">
                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
                          SPECIFICATIONS DECLASSIFIED:
                        </div>
                        <ul className="space-y-1 list-disc list-inside text-neutral-400">
                          {mockup.techSpecs.map((spec, idx) => (
                            <li key={idx} className="line-clamp-1">{spec}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Full high-resolution CAD schematics, dimensional specs, and reserve slot allocation
                        are encrypted until VIP PIN verification.
                      </p>
                    )}
                  </div>

                  {/* Dynamic Action Controls: Locked vs Unlocked */}
                  <div className="pt-4 border-t border-neutral-800 space-y-3 font-mono">
                    {isUnlocked ? (
                      /* Unlocked State Actions */
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2.5 border border-neutral-700 bg-neutral-950 text-neutral-300 text-xs">
                          <ShieldCheck className="w-4 h-4 text-white" />
                          <span>Slot #01 Priority Reserved for this device.</span>
                        </div>
                        <a
                          href={`https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(
                            `Hello Atelier Noir, I unlocked VIP Mock-up [${mockup.name} (${mockup.id})]. I would like to reserve pre-order production slot #01.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 border border-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                          <span>Reserve Slot via WhatsApp</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      /* Locked State: Purchase CTA + PIN Unlock Input */
                      <div className="space-y-3">
                        {/* 1. Purchase CTA Button */}
                        <button
                          onClick={() => handlePurchaseAccess(mockup.name)}
                          className="w-full py-2.5 bg-white text-black hover:bg-neutral-200 border border-white text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors"
                        >
                          <span>Purchase Access ({formatGHS(CONFIG.VIP_ACCESS_PRICE_GHS)})</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest text-center">
                          — ALREADY HAVE A CODE? —
                        </div>

                        {/* 2. PIN Unlock Input + Button */}
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input
                              type="text"
                              value={currentPin}
                              onChange={(e) => handlePinChange(mockup.id, e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleUnlock(mockup.id)}
                              placeholder={`PIN (e.g. ${CONFIG.VIP_PIN})`}
                              className="w-full bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-600 px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-white transition-colors"
                            />
                          </div>
                          <button
                            onClick={() => handleUnlock(mockup.id)}
                            className="px-4 py-2 bg-neutral-800 hover:bg-white text-neutral-300 hover:text-black border border-neutral-700 hover:border-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                            <span>Unlock</span>
                          </button>
                        </div>

                        {/* Error Notice */}
                        {error && (
                          <div className="p-2 border border-red-900 bg-red-950/40 text-red-200 text-[11px] font-sans flex items-start gap-1.5 leading-snug">
                            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-red-400" />
                            <span>{error}</span>
                          </div>
                        )}

                        {/* Success Notice */}
                        {success && !error && (
                          <div className="p-2 border border-neutral-700 bg-neutral-950 text-neutral-300 text-[11px] font-mono flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span>{success}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
