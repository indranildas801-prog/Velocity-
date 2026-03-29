import React from 'react';
import { motion } from 'motion/react';
import { Settings as SettingsIcon, Globe, Zap, Database, Shield, Info } from 'lucide-react';
import Logo from './Logo';
import { ChatMode, Language } from '../lib/gemini';
import { cn } from '../lib/utils';

interface SettingsProps {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  deferredPrompt: any;
  setDeferredPrompt: (prompt: any) => void;
}

export default function Settings({ mode, setMode, language, setLanguage, deferredPrompt, setDeferredPrompt }: SettingsProps) {
  const languages: { code: Language; label: string }[] = [
    { code: 'bn', label: 'Bengali (বাংলা)' },
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'ja', label: 'Japanese (日本語)' },
    { code: 'es', label: 'Spanish (Español)' },
    { code: 'ar', label: 'Arabic (العربية)' },
  ];

  const modes: { id: ChatMode; label: string; desc: string }[] = [
    { id: 'normal', label: 'Normal', desc: 'Balanced and efficient responses' },
    { id: 'creative', label: 'Creative', desc: 'Imaginative and expressive tone' },
    { id: 'passionate', label: 'Passionate', desc: 'High energy and emotional engagement' },
  ];

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold neon-text-blue">SYSTEM CONFIG</h2>
          <p className="text-white/40 text-sm">Adjust AI core parameters</p>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-neon-blue mb-4">
          <Globe size={18} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Language Protocol</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={cn(
                "glass-panel p-4 rounded-xl text-center transition-all border-white/5",
                language === lang.code ? "bg-neon-blue/20 border-neon-blue text-neon-blue" : "hover:bg-white/5"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-neon-red mb-4">
          <Zap size={18} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Personality Matrix</h3>
        </div>
        <div className="space-y-3">
          {modes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "w-full glass-panel p-4 rounded-xl text-left transition-all border-white/5 flex items-center justify-between",
                mode === m.id ? "bg-neon-red/20 border-neon-red" : "hover:bg-white/5"
              )}
            >
              <div>
                <div className={cn("font-bold", mode === m.id ? "text-neon-red" : "text-white")}>{m.label}</div>
                <div className="text-xs text-white/40">{m.desc}</div>
              </div>
              {mode === m.id && <div className="w-2 h-2 rounded-full bg-neon-red animate-pulse" />}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-2 text-white/60 mb-4">
          <Database size={18} />
          <h3 className="font-bold uppercase tracking-wider text-sm">Memory & Security</h3>
        </div>
        <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-green-500" />
              <div>
                <div className="font-bold">Encryption Status</div>
                <div className="text-xs text-white/40">End-to-end neural encryption active</div>
              </div>
            </div>
            <div className="text-xs font-mono text-green-500">SECURE</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-neon-blue" />
              <div>
                <div className="font-bold">Claude Protocol</div>
                <div className="text-xs text-white/40">Anthropic Neural Engine</div>
              </div>
            </div>
            <div className="text-xs font-mono text-neon-blue">READY</div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-neon-red" />
              <div>
                <div className="font-bold">Evergent Core</div>
                <div className="text-xs text-white/40">Subscription & Billing Protocol</div>
              </div>
            </div>
            <div className="text-xs font-mono text-neon-red">READY</div>
          </div>

          {deferredPrompt && (
            <div className="flex items-center justify-between p-4 bg-neon-blue/10 rounded-xl border border-neon-blue/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                  <Logo size="sm" />
                </div>
                <div>
                  <div className="font-bold text-neon-blue">Install Velocity AI</div>
                  <div className="text-[10px] text-white/40 uppercase tracking-widest">Add to home screen</div>
                </div>
              </div>
              <button 
                onClick={handleInstall}
                className="px-4 py-2 bg-neon-blue text-black text-xs font-bold rounded-lg hover:scale-105 transition-transform"
              >
                INSTALL
              </button>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Info size={20} className="text-neon-blue" />
              <div>
                <div className="font-bold">Local Storage</div>
                <div className="text-xs text-white/40">Chat history and tasks stored locally</div>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-xs font-mono text-neon-red hover:underline"
            >
              WIPE MEMORY
            </button>
          </div>
        </div>
      </section>

      <div className="pt-8 text-center text-white/20 text-xs">
        VELOCITY AI VERSION 2.0.4-BETA<br/>
        ENCRYPTED SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}
      </div>
    </div>
  );
}
