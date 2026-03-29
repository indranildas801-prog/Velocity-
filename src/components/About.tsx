import React from 'react';
import { motion } from 'motion/react';
import { Github, Twitter, Mail, ExternalLink, ShieldCheck, Cpu, Zap } from 'lucide-react';
import Logo from './Logo';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto p-4 space-y-12 pb-20">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center"
        >
          <Logo size="lg" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tighter">VELOCITY AI</h1>
        <p className="text-white/40 max-w-md mx-auto">
          The next generation of personal intelligence. Inspired by the legends, built for the future.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
            <Cpu size={20} />
          </div>
          <h3 className="text-xl font-bold">The Core</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Powered by advanced neural architectures, Velocity AI processes information at speeds that redefine human-AI collaboration.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-white/5 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-neon-red/20 flex items-center justify-center text-neon-red">
            <Zap size={20} />
          </div>
          <h3 className="text-xl font-bold">Velocity Protocol</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Our proprietary protocol ensures that every interaction is seamless, intuitive, and lightning fast.
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border-white/5 text-center space-y-6">
        <h3 className="text-2xl font-bold">Created by Indranil Officials</h3>
        <p className="text-white/60">
          A vision to bring Jarvis-level intelligence to every device.
        </p>
        <div className="flex justify-center gap-4">
          <button className="p-3 glass-panel rounded-xl hover:text-neon-blue transition-colors">
            <Github size={20} />
          </button>
          <button className="p-3 glass-panel rounded-xl hover:text-neon-blue transition-colors">
            <Twitter size={20} />
          </button>
          <button className="p-3 glass-panel rounded-xl hover:text-neon-blue transition-colors">
            <Mail size={20} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 text-white/20 text-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} />
          <span>Privacy First Architecture</span>
        </div>
        <p>© 2026 Indranil Officials. All rights reserved.</p>
      </div>
    </div>
  );
}
