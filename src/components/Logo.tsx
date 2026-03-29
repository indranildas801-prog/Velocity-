import React from 'react';
import { cn } from '../lib/utils';

export default function Logo({ className, size = "md" }: { className?: string, size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
    xl: "w-64 h-64"
  };

  return (
    <div className={cn("relative flex items-center justify-center", sizes[size], className)}>
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 rounded-full bg-neon-blue/10 blur-xl animate-pulse" />
      
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_20px_rgba(0,242,255,0.6)]"
      >
        <defs>
          <linearGradient id="v-gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2ff" />
            <stop offset="50%" stopColor="#7000ff" />
            <stop offset="100%" stopColor="#ff003c" />
          </linearGradient>
          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feComposite in="SourceGraphic" in2="blur" operator="over"/>
          </filter>
        </defs>
        
        {/* Background Geometric Accents */}
        <circle cx="50" cy="50" r="48" stroke="rgba(0, 242, 255, 0.1)" strokeWidth="0.5" strokeDasharray="4 4" className="animate-spin-slow" />
        <circle cx="50" cy="50" r="42" stroke="rgba(255, 0, 60, 0.1)" strokeWidth="0.5" strokeDasharray="2 8" className="animate-spin [animation-duration:15s] direction-reverse" />

        {/* Left Wing (Blue) - Layered */}
        <path 
          d="M15 25 L45 85 L50 75 L25 20 Z" 
          fill="#00f2ff" 
          fillOpacity="0.2"
        />
        <path 
          d="M10 20 L45 80 L50 70 L25 15 Z" 
          fill="#00f2ff" 
          filter="url(#neon-glow)"
          className="animate-pulse"
        />
        
        {/* Right Wing (Red) - Layered */}
        <path 
          d="M85 25 L55 85 L50 75 L75 20 Z" 
          fill="#ff003c" 
          fillOpacity="0.2"
        />
        <path 
          d="M90 20 L55 80 L50 70 L75 15 Z" 
          fill="#ff003c" 
          filter="url(#neon-glow)"
          className="animate-pulse [animation-delay:1s]"
        />

        {/* Center Sharp V - Core */}
        <path 
          d="M20 25 L50 90 L80 25 L50 75 Z" 
          fill="url(#v-gradient-main)" 
          className="drop-shadow-[0_0_10px_rgba(112,0,255,0.8)]"
        />

        {/* Inner Core Pulse */}
        <circle cx="50" cy="65" r="2" fill="white" className="animate-pulse">
          <animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}
