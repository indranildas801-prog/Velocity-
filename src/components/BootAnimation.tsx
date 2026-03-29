import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function BootAnimation({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const bootLogs = [
    "INITIALIZING CORE SYSTEMS...",
    "LOADING NEURAL NETWORK...",
    "ESTABLISHING SECURE CONNECTION...",
    "SYNCING WITH SATELLITE NETWORK...",
    "CALIBRATING VOICE MODULE...",
    "VELOCITY AI ONLINE."
  ];

  useEffect(() => {
    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[currentLog]]);
        currentLog++;
      }
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 font-mono overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 cyber-grid opacity-10" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative mb-12 z-10"
      >
        <div className="absolute inset-0 bg-neon-blue/20 blur-3xl animate-pulse" />
        <Logo size="xl" />
        
        {/* Rotating HUD Elements */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
          className="absolute -inset-8 border border-dashed border-neon-blue/20 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          className="absolute -inset-16 border border-dashed border-neon-red/10 rounded-full"
        />
      </motion.div>

      <div className="w-full max-w-md z-10">
        <div className="flex justify-between text-[10px] text-neon-blue mb-2 tracking-widest">
          <span className="animate-pulse">SYSTEM_INITIALIZATION_SEQUENCE</span>
          <span>{progress}%</span>
        </div>
        <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-neon-blue shadow-[0_0_10px_#00f2ff]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 h-40 overflow-hidden text-[10px] text-neon-blue/40 space-y-1 w-full max-w-md z-10 font-mono">
        <AnimatePresence>
          {logs.map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <span className="text-neon-red opacity-50">[{new Date().getTime().toString().slice(-6)}]</span>
              <span className="text-neon-blue/60">{log}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Decorative HUD corners */}
      <div className="absolute top-8 left-8 w-24 h-24 border-t border-l border-neon-blue/20" />
      <div className="absolute top-8 right-8 w-24 h-24 border-t border-r border-neon-blue/20" />
      <div className="absolute bottom-8 left-8 w-24 h-24 border-b border-l border-neon-blue/20" />
      <div className="absolute bottom-8 right-8 w-24 h-24 border-b border-r border-neon-blue/20" />
    </div>
  );
}
