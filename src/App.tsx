import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  CheckSquare, 
  BrainCircuit, 
  Settings as SettingsIcon, 
  Info, 
  Home, 
  Menu, 
  X, 
  Mic, 
  MicOff,
  Navigation,
  Activity,
  Video
} from 'lucide-react';
import BootAnimation from './components/BootAnimation';
import ChatInterface from './components/ChatInterface';
import ToDoList from './components/ToDoList';
import Quiz from './components/Quiz';
import Settings from './components/Settings';
import About from './components/About';
import MediaLab from './components/MediaLab';
import Logo from './components/Logo';
import HUDOverlay from './components/HUDOverlay';
import { ChatMode, Language } from './lib/gemini';
import { cn } from './lib/utils';

type Page = 'home' | 'chat' | 'todo' | 'quiz' | 'medialab' | 'settings' | 'about';

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>('normal');
  const [language, setLanguage] = useState<Language>('bn');
  const [isListening, setIsListening] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  useEffect(() => {
    // Request location on mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
        },
        () => setLocation("Access Denied")
      );
    }
  }, []);

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    
    if (isListening) {
      setIsListening(false);
    } else {
      setIsListening(true);
      // Logic for speech recognition would go here
      // For now just a visual toggle
      setTimeout(() => setIsListening(false), 3000);
    }
  };

  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'chat', icon: MessageSquare, label: 'Chat' },
    { id: 'medialab', icon: Video, label: 'Media Lab' },
    { id: 'todo', icon: CheckSquare, label: 'To-Do' },
    { id: 'quiz', icon: BrainCircuit, label: 'Quiz' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
    { id: 'about', icon: Info, label: 'About' },
  ];

  if (isBooting) {
    return <BootAnimation onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white flex overflow-hidden selection:bg-neon-blue/30">
      <HUDOverlay />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-20 hover:w-64 transition-all duration-300 glass-panel border-r border-white/5 z-40 group">
        <div className="p-4 flex items-center gap-4 border-b border-white/5 mb-4">
          <Logo size="sm" className="shrink-0" />
          <span className="font-bold tracking-tighter text-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap neon-text-blue">VELOCITY AI</span>
        </div>
        
        <nav className="flex-1 px-3 space-y-2 mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-xl transition-all group/item",
                currentPage === item.id ? "bg-neon-blue/20 text-neon-blue" : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={24} className="shrink-0" />
              <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-4 px-2 text-white/20 group-hover:text-white/40 transition-colors">
            <Navigation size={18} className="shrink-0" />
            <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{location || "LOCATING..."}</span>
          </div>
          <div className="flex items-center gap-4 px-2 text-white/20 group-hover:text-white/40 transition-colors">
            <Activity size={18} className="shrink-0" />
            <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">SYSTEM STABLE</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-panel border-b border-white/5 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-bold tracking-tighter">VELOCITY</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-white/60">
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-dark-bg border-r border-white/10 z-50 lg:hidden p-6"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <Logo size="sm" />
                  <span className="font-bold tracking-tighter text-xl">VELOCITY AI</span>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-white/40">
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id as Page);
                      setIsSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl transition-all",
                      currentPage === item.id ? "bg-neon-blue/20 text-neon-blue" : "text-white/40 hover:bg-white/5"
                    )}
                  >
                    <item.icon size={24} />
                    <span className="font-bold">{item.label}</span>
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 relative pt-16 lg:pt-0 overflow-hidden flex flex-col">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-blue/5 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-red/5 blur-[100px] rounded-full -z-10" />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {currentPage === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="w-80 h-80 border border-dashed border-neon-blue/20 rounded-full"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute inset-4 border border-dashed border-neon-red/10 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        filter: ["drop-shadow(0 0 20px rgba(0,242,255,0.2))", "drop-shadow(0 0 40px rgba(0,242,255,0.5))", "drop-shadow(0 0 20px rgba(0,242,255,0.2))"]
                      }}
                      transition={{ repeat: Infinity, duration: 4 }}
                    >
                      <Logo size="xl" />
                    </motion.div>
                  </div>
                </div>

                <div className="space-y-4 max-w-2xl relative">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neon-blue tracking-[0.5em] uppercase"
                  >
                    System Online
                  </motion.div>
                  <h1 className="text-6xl sm:text-8xl font-black tracking-tighter">
                    VELOCITY <span className="neon-text-blue">AI</span>
                  </h1>
                  <p className="text-white/60 text-lg sm:text-2xl font-light tracking-wide">
                    The next evolution of personal intelligence.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button 
                    onClick={() => setCurrentPage('chat')}
                    className="px-8 py-4 bg-neon-blue text-black font-bold rounded-2xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,242,255,0.4)]"
                  >
                    INITIALIZE CHAT
                  </button>
                  <button 
                    onClick={() => setCurrentPage('todo')}
                    className="px-8 py-4 glass-panel font-bold rounded-2xl hover:bg-white/10 transition-colors border-white/10"
                  >
                    VIEW PROTOCOLS
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-8 pt-12 text-white/20 font-mono text-[10px] sm:text-xs">
                  <div className="space-y-1">
                    <div className="text-neon-blue">NEURAL LINK</div>
                    <div>ACTIVE</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-neon-red">LATENCY</div>
                    <div>12MS</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-white">ENCRYPTION</div>
                    <div>AES-256</div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentPage === 'chat' && <ChatInterface key="chat" mode={mode} language={language} />}
            {currentPage === 'medialab' && <MediaLab key="medialab" />}
            {currentPage === 'todo' && <ToDoList key="todo" />}
            {currentPage === 'quiz' && <Quiz key="quiz" language={language} />}
            {currentPage === 'settings' && (
              <Settings 
                key="settings" 
                mode={mode} 
                setMode={setMode} 
                language={language} 
                setLanguage={setLanguage} 
              />
            )}
            {currentPage === 'about' && <About key="about" />}
          </AnimatePresence>
        </div>

        {/* Global Voice Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleVoice}
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
              isListening ? "bg-neon-red animate-pulse" : "bg-neon-blue text-black"
            )}
          >
            {isListening ? <MicOff size={28} /> : <Mic size={28} />}
            {isListening && (
              <div className="absolute inset-0 rounded-full border-4 border-neon-red animate-ping opacity-50" />
            )}
          </motion.button>
        </div>
      </main>
    </div>
  );
}
