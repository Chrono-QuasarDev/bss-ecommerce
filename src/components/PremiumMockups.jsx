import React, { useState, useEffect } from 'react';
import { Lock, Unlock, KeyRound, ExternalLink, ShieldCheck, AlertCircle, Sparkles, Terminal, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CONFIG } from '../config';
import { buildVipInquiryUrl } from '../utils/checkout';
import { formatGHS } from '../utils/formatters';

export const PremiumMockups = () => {
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.UNLOCKED_MOCKUPS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pinInputs, setPinInputs] = useState({});
  const [errors, setErrors] = useState({});
  const [successNotices, setSuccessNotices] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.UNLOCKED_MOCKUPS, JSON.stringify(unlockedIds));
    } catch (e) {
      console.error(e);
    }
  }, [unlockedIds]);

  const handlePinChange = (mockupId, value) => {
    setPinInputs((prev) => ({ ...prev, [mockupId]: value }));
    if (errors[mockupId]) setErrors((prev) => ({ ...prev, [mockupId]: null }));
  };

  const handleUnlock = (mockupId) => {
    const enteredPin = (pinInputs[mockupId] || '').trim();
    if (!enteredPin) {
      setErrors((prev) => ({ ...prev, [mockupId]: 'Please input your VIP authorization PIN.' }));
      return;
    }

    if (enteredPin.toUpperCase() === CONFIG.VIP_PIN.toUpperCase()) {
      // Golden luxury confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#ffffff', '#f59e0b', '#cbd5e1'],
        });
      } catch (err) {
        // Fallback safely if confetti cannot render
      }

      setUnlockedIds((prev) => (prev.includes(mockupId) ? prev : [...prev, mockupId]));
      setSuccessNotices((prev) => ({ ...prev, [mockupId]: 'VIP PIN Authenticated. CAD Archive Revealed.' }));
      setErrors((prev) => ({ ...prev, [mockupId]: null }));
    } else {
      setErrors((prev) => ({
        ...prev,
        [mockupId]: `Invalid PIN code. Tap 'Purchase Access (${formatGHS(CONFIG.VIP_ACCESS_PRICE_GHS)})' to request an authentic PIN via WhatsApp.`,
      }));
    }
  };

  const handlePurchaseAccess = (mockupName) => {
    const waUrl = buildVipInquiryUrl(CONFIG.WHATSAPP_PHONE, mockupName);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleDemoUnlockAll = () => {
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 }, colors: ['#d4af37', '#ffffff'] });
    } catch {}
    setUnlockedIds(CONFIG.PREMIUM_MOCKUPS.map((m) => m.id));
  };

  const handleResetLocks = () => {
    setUnlockedIds([]);
    setPinInputs({});
  };

  return (
    <section id="mockups-section" className="relative bg-[#050508] text-white py-20 sm:py-32 border-t border-white/[0.08] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-cyan-500/5 blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Vault Header */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 mb-12 sm:mb-16 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10 text-amber-300 font-mono text-[10px] tracking-widest uppercase">
                <Terminal className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL ATELIER ARCHIVE // FW26 PRE-RELEASE</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight font-heading text-white">
                THE VIP VAULT: <span className="text-gold-metallic">PENDING SLOTS</span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-400 font-sans leading-relaxed">
                Unreleased CAD prototypes undergoing technical pattern cutting in our Accra studio. Access
                is strictly restricted. Authenticated VIP holders inspect 4K technical schematics and secure
                guaranteed Slot #01 pre-order priority before public release.
              </p>
            </div>

            {/* Vault Stats & Demo Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 font-mono text-xs">
              <div className="px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.03] text-neutral-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                <span>{unlockedIds.length} / {CONFIG.PREMIUM_MOCKUPS.length} DECLASSIFIED</span>
              </div>

              {unlockedIds.length > 0 ? (
                <button
                  onClick={handleResetLocks}
                  className="px-4 py-2.5 rounded-full border border-white/15 hover:border-white text-neutral-400 hover:text-white transition-all text-[11px] uppercase tracking-wider"
                >
                  Reset Locks
                </button>
              ) : (
                <button
                  onClick={handleDemoUnlockAll}
                  className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all text-[11px] uppercase tracking-wider font-bold shadow-glow-sm"
                >
                  Quick Demo Unlock
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mockup Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CONFIG.PREMIUM_MOCKUPS.map((mockup) => {
            const isUnlocked = unlockedIds.includes(mockup.id);
            const currentPin = pinInputs[mockup.id] || '';
            const error = errors[mockup.id];
            const success = successNotices[mockup.id];

            return (
              <div
                key={mockup.id}
                className="glass-panel rounded-3xl overflow-hidden border border-white/[0.1] hover:border-white/25 flex flex-col justify-between transition-all duration-500 hover:shadow-glow"
              >
                {/* Visual Area */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={isUnlocked ? mockup.revealedImage : mockup.blurredImage}
                    alt={mockup.name}
                    className={`w-full h-full object-cover transition-all duration-1000 ${
                      isUnlocked
                        ? 'filter blur-0 scale-100 brightness-100'
                        : 'filter blur-2xl scale-110 brightness-40 select-none pointer-events-none'
                    }`}
                  />

                  {/* Scanline overlay for cyber-vault feel */}
                  <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40" />

                  {/* Locked Overlay Emblem */}
                  {!isUnlocked ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/50 backdrop-blur-sm">
                      <div className="relative mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-black/80 border border-white/20 flex items-center justify-center text-white shadow-2xl">
                          <Lock className="w-7 h-7 text-amber-300" />
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                        </span>
                      </div>

                      <span className="font-mono text-xs uppercase tracking-[0.25em] font-bold text-white mb-1">
                        CONFIDENTIAL CAD FILE
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                        {mockup.edition}
                      </span>
                    </div>
                  ) : (
                    <div className="absolute top-4 left-4 bg-emerald-400 text-black px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-glow">
                      <Unlock className="w-3.5 h-3.5" />
                      <span>ACCESS DECLASSIFIED</span>
                    </div>
                  )}

                  {/* Top Right Reference */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[9px] font-mono tracking-widest text-neutral-300">
                    REF // {mockup.id}
                  </div>
                </div>

                {/* Card Content & Action Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                      <span>{mockup.category}</span>
                      <span className="text-amber-300">{mockup.releaseQuarter}</span>
                    </div>

                    <h3 className="text-lg font-bold uppercase tracking-tight text-white font-heading">
                      {mockup.name}
                    </h3>

                    {/* Unlocked Blueprint Stats vs Locked Teaser */}
                    {isUnlocked ? (
                      <div className="space-y-3 pt-3 border-t border-white/10 font-mono text-xs">
                        {mockup.blueprintStats && (
                          <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[10px]">
                            <div>
                              <div className="text-neutral-500">PATTERNS</div>
                              <div className="font-bold text-white">{mockup.blueprintStats.patternPieces} Cut</div>
                            </div>
                            <div>
                              <div className="text-neutral-500">ASSEMBLY</div>
                              <div className="font-bold text-white">{mockup.blueprintStats.assemblyTime}</div>
                            </div>
                            <div>
                              <div className="text-neutral-500">HARDWARE</div>
                              <div className="font-bold text-white line-clamp-1">{mockup.blueprintStats.hardware}</div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <div className="text-[10px] text-amber-300 uppercase tracking-widest font-bold">
                            CAD SCHEMATIC SPECIFICATIONS:
                          </div>
                          <ul className="space-y-1 text-neutral-300 text-[11px] list-disc list-inside font-sans">
                            {mockup.techSpecs.map((spec, idx) => (
                              <li key={idx} className="line-clamp-2 leading-relaxed">{spec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                        Full structural blueprint, laser pattern schematics, and prototype pre-order allocation
                        are encrypted until authentic VIP PIN validation.
                      </p>
                    )}
                  </div>

                  {/* Actions Area */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {isUnlocked ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono">
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Pre-order Priority Slot #01 Verified for this session.</span>
                        </div>
                        <a
                          href={`https://wa.me/${CONFIG.WHATSAPP_PHONE}?text=${encodeURIComponent(
                            `Hello Atelier Noir, I unlocked VIP Mock-up [${mockup.name} (${mockup.id})]. I would like to reserve pre-order production slot #01.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3.5 bg-gradient-to-r from-amber-300 to-amber-200 text-black hover:from-white hover:to-neutral-100 rounded-full font-mono text-xs uppercase tracking-[0.16em] font-extrabold flex items-center justify-center gap-2 transition-all shadow-glow-gold hover:scale-105"
                        >
                          <span>Reserve Slot #01 via WhatsApp</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* 1. Purchase CTA Button */}
                        <button
                          onClick={() => handlePurchaseAccess(mockup.name)}
                          className="w-full py-3.5 bg-white text-black hover:bg-amber-200 rounded-full font-mono text-xs uppercase tracking-[0.18em] font-extrabold flex items-center justify-center gap-2 transition-all shadow-glow hover:scale-[1.02]"
                        >
                          <span>Purchase Access ({formatGHS(CONFIG.VIP_ACCESS_PRICE_GHS)})</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <div className="text-[10px] text-neutral-500 uppercase tracking-widest text-center font-mono">
                          — ENTER VIP PIN CODE —
                        </div>

                        {/* 2. PIN Unlock Input & Button */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={currentPin}
                            onChange={(e) => handlePinChange(mockup.id, e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUnlock(mockup.id)}
                            placeholder={`VIP PIN (Try ${CONFIG.VIP_PIN})`}
                            className="flex-1 bg-white/[0.04] border border-white/15 focus:border-amber-400/80 rounded-full px-4 py-2.5 text-xs font-mono text-white placeholder-neutral-500 uppercase tracking-wider focus:outline-none transition-colors"
                          />
                          <button
                            onClick={() => handleUnlock(mockup.id)}
                            className="px-5 py-2.5 bg-white/10 hover:bg-white text-white hover:text-black rounded-full font-mono text-xs uppercase tracking-widest font-bold transition-all border border-white/15 hover:border-white shadow-glow-sm"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                          <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-xs font-sans flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                          </div>
                        )}

                        {/* Success Message */}
                        {success && !error && (
                          <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
