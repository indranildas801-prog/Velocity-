import React from 'react';
import { motion } from 'motion/react';

export default function HUDOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden opacity-40">
      {/* Scanning Line */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent h-1/4 animate-scan" />
      
      {/* Corner Brackets */}
      <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-neon-blue/30" />
      <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-neon-blue/30" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-neon-blue/30" />
      <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-neon-blue/30" />

      {/* Side Data Readouts */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 space-y-8 font-mono text-[8px] text-neon-blue/40 uppercase tracking-widest vertical-text hidden lg:block">
        <div className="animate-pulse">System Status: Optimal</div>
        <div className="animate-pulse [animation-delay:1s]">Neural Link: Stable</div>
        <div className="animate-pulse [animation-delay:2s]">Buffer: 0.002ms</div>
      </div>

      <div className="absolute right-4 top-1/2 -translate-y-1/2 space-y-8 font-mono text-[8px] text-neon-red/40 uppercase tracking-widest vertical-text hidden lg:block">
        <div className="animate-pulse">Velocity: 1.2Tb/s</div>
        <div className="animate-pulse [animation-delay:1.5s]">Core Temp: 32°C</div>
        <div className="animate-pulse [animation-delay:0.5s]">Protocol: V-2.0</div>
      </div>

      {/* Center Circle Decors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] border border-neon-blue/5 rounded-full animate-spin-slow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] border border-neon-red/5 rounded-full animate-spin [animation-duration:15s] direction-reverse" />
    </div>
  );
}
