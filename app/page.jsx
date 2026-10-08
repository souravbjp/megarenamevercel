'use client';

import { useState, useEffect } from 'react';

export default function MegaRenamerApp() {
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Rename Studio States
  const [renameMode, setRenameMode] = useState('prefix');
  const [inputText, setInputText] = useState('');
  const [replaceTarget, setReplaceTarget] = useState('');
  
  // Progress States
  const [isRenaming, setIsRenaming] = useState(false);
  const [progress, setProgress] = useState(0);

  // Global Counter (Landing Page)
  const [globalCount, setGlobalCount] = useState(5430120);

  useEffect(() => {
    // Checking if opened inside Telegram
    if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      // Telegram initData thakle bujhbe eta Telegram er vitor theke open hoyeche
      if (tg.initData) {
        setIsInTelegram(true);
        // Sync theme with Telegram
        document.body.style.backgroundColor = tg.themeParams.bg_color || '#121212';
        document.body.style.color = tg.themeParams.text_color || '#ffffff';
      }
    }

    // Fake live counter animation for landing page
    const interval = setInterval(() => {
      setGlobalCount(prev => prev + Math.floor(Math.random() * 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Live Preview Logic
  const generatePreview = () => {
    const sampleOld = "K-Drama_Episode_01.mp4";
    const name = "K-Drama_Episode_01";
    const ext = ".mp4";

    if (!inputText && renameMode !== 'replace') return sampleOld;

    switch (renameMode) {
      case 'prefix': return `${inputText}${sampleOld}`;
      case 'suffix': return `${name}${inputText}${ext}`;
      case 'replace': 
        return replaceTarget ? sampleOld.replace(replaceTarget, inputText) : sampleOld;
      case 'number': return `00001${ext}`;
      case 'template': 
        return inputText.replace('{n}', name).replace('{i}', '1').replace('{ext}', ext);
      default: return sampleOld;
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsLoggedIn(true);
    }, 1500);
  };

  const startRename = () => {
    setIsRenaming(true);
    let current = 0;
    const progInterval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(progInterval);
        setTimeout(() => {
          setIsRenaming(false);
          setProgress(0);
          if (window.Telegram?.WebApp) {
             window.Telegram.WebApp.showAlert("Mach 3x Rename Successful!");
             window.Telegram.WebApp.close(); // Auto close app after success
          }
        }, 500);
      }
    }, 400);
  };

  // ==========================================
  // 1. LANDING PAGE (Browser UI - Ads/Features)
  // ==========================================
  if (!isInTelegram) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Mega.nz Bulk Renamer Bot
          </h1>
          <p className="text-xl text-gray-300">
            The world's fastest Telegram bot for managing Mega.nz files & folders.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-bold text-blue-400">Mach 3x Speed</h3>
              <p className="text-sm text-gray-400 mt-2">Rename 10,000+ files in seconds with parallel batch processing.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-xl font-bold text-green-400">Anti-Ban System</h3>
              <p className="text-sm text-gray-400 mt-2">JA3 TLS Spoofing keeps your Mega and Telegram accounts 100% safe.</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <div className="text-3xl mb-3">📁</div>
              <h3 className="text-xl font-bold text-yellow-400">Folder Support</h3>
              <p className="text-sm text-gray-400 mt-2">Deep recursive renaming for both files and nested folders.</p>
            </div>
          </div>

          <div className="mt-12 bg-gray-800/50 p-6 rounded-2xl">
            <p className="text-gray-400 uppercase tracking-widest text-sm">Global Files Renamed</p>
            <p className="text-4xl font-mono font-bold text-white mt-2">
              {globalCount.toLocaleString()}+
            </p>
          </div>

          <div className="mt-10">
            <a href="https://t.me/YourBotUsername" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              Open Bot on Telegram
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. TELEGRAM WEB APP (Dashboard UI)
  // ==========================================
  return (
    <div className="min-h-screen p-4 font-sans flex flex-col max-w-md mx-auto">
      
      {/* LOGIN SCREEN */}
      {!isLoggedIn ? (
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Secure Login</h1>
            <p className="text-sm opacity-70 mt-2">Connect your Mega.nz account</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold opacity-70 uppercase">Email</label>
              <input type="email" required className="w-full mt-1 p-3 rounded-xl bg-black/20 border border-white/10 focus:border-blue-500 outline-none transition-all" placeholder="example@mega.nz" />
            </div>
            <div>
              <label className="text-xs font-bold opacity-70 uppercase">Password</label>
              <input type="password" required className="w-full mt-1 p-3 rounded-xl bg-black/20 border border-white/10 focus:border-blue-500 outline-none transition-all" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-4 mt-4 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-all flex justify-center">
              {loading ? <span className="animate-spin text-xl">⏳</span> : 'Connect Account'}
            </button>
          </form>
        </div>
      ) : (
        
        /* RENAME STUDIO SCREEN */
        <div className="flex-1 flex flex-col animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Rename Studio</h2>
            <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold">Connected</div>
          </div>

          <div className="space-y-6 flex-1">
            {/* Mode Selector */}
            <div>
              <label className="text-xs font-bold opacity-70 uppercase mb-2 block">Select Mode</label>
              <select 
                value={renameMode} 
                onChange={(e) => {setRenameMode(e.target.value); setInputText('');}}
                className="w-full p-3 rounded-xl bg-black/20 border border-white/10 outline-none"
              >
                <option value="prefix">Add Prefix</option>
                <option value="suffix">Add Suffix</option>
                <option value="replace">Text Replace</option>
                <option value="template">Custom Template</option>
                <option value="number">Sequential Numbers</option>
              </select>
            </div>

            {/* Dynamic Inputs */}
            {renameMode !== 'number' && (
              <div className="animate-fade-in space-y-3">
                {renameMode === 'replace' && (
                  <div>
                    <label className="text-xs font-bold opacity-70 uppercase">Target Text (Old)</label>
                    <input type="text" value={replaceTarget} onChange={(e) => setReplaceTarget(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-black/20 border border-white/10 outline-none" placeholder="e.g. Episode" />
                  </div>
                )}
                <div>
                  <label className="text-xs font-bold opacity-70 uppercase">
                    {renameMode === 'replace' ? 'New Text' : 'Input Pattern'}
                  </label>
                  <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full mt-1 p-3 rounded-xl bg-black/20 border border-white/10 outline-none" placeholder={renameMode === 'template' ? 'e.g. {i}_{n}{ext}' : 'Type here...'} />
                </div>
              </div>
            )}

            {/* LIVE PREVIEW ENGINE */}
            <div className="p-4 rounded-xl border border-blue-500/30 bg-blue-500/10 mt-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">LIVE PREVIEW</div>
              <p className="text-xs opacity-60 mt-1 line-through">K-Drama_Episode_01.mp4</p>
              <p className="text-sm font-bold mt-1 text-blue-400 break-all">{generatePreview()}</p>
            </div>
            
            {/* Folder Tree UI Concept */}
            <div className="p-4 rounded-xl border border-white/10 bg-black/20">
               <p className="text-xs font-bold opacity-70 uppercase mb-2">Target Scope</p>
               <div className="flex items-center text-sm opacity-80">
                  <span className="mr-2">📁</span> Root Directory / All Folders
               </div>
            </div>
          </div>

          {/* DYNAMIC PROGRESS BAR & ACTION BUTTON */}
          <div className="mt-6 pt-4 border-t border-white/10">
            {isRenaming ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-blue-400">Renaming (Mach 3x)...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-white/10">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-300 ease-out relative" style={{ width: `${progress}%` }}>
                    <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
                       {/* Shiny animated effect on progress bar */}
                       <div className="w-full h-full bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={startRename} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg">
                🚀 Start Mach 3x Rename
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
