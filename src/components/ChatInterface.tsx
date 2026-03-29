import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Mic, Image as ImageIcon, Loader2, User, Bot, Trash2, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateChatResponse, ChatMode, Language } from '../lib/gemini';
import { cn } from '../lib/utils';
import jsPDF from 'jspdf';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  image?: string;
}

interface ChatInterfaceProps {
  mode: ChatMode;
  language: Language;
}

export default function ChatInterface({ mode, language }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('velocity_chat_history');
    return saved ? JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('velocity_chat_history', JSON.stringify(messages));
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      image: selectedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await generateChatResponse(input, history, mode, language, userMessage.image);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || 'I am sorry, I could not process that.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      // Voice response if enabled (optional, could add a toggle)
      if (window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.lang = language === 'bn' ? 'bn-BD' : language === 'hi' ? 'hi-IN' : 'en-US';
        // window.speechSynthesis.speak(utterance); // Uncomment to enable auto-speak
      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Velocity AI Chat History", 20, 20);
    doc.setFontSize(12);
    
    let y = 30;
    messages.forEach(m => {
      const text = `${m.role === 'user' ? 'User' : 'Velocity AI'}: ${m.content}`;
      const lines = doc.splitTextToSize(text, 170);
      if (y + lines.length * 7 > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, 20, y);
      y += lines.length * 7 + 5;
    });
    
    doc.save("velocity-chat.pdf");
  };

  const clearChat = () => {
    if (confirm("Clear all chat history?")) {
      setMessages([]);
      localStorage.removeItem('velocity_chat_history');
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold neon-text-blue">COMMAND CENTER</h2>
        <div className="flex gap-2">
          <button onClick={exportToPDF} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neon-blue" title="Export PDF">
            <Download size={20} />
          </button>
          <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-neon-red" title="Clear Chat">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 custom-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center animate-pulse">
              <Bot size={40} />
            </div>
            <p className="text-center">Velocity AI is ready for your commands.<br/>Switch modes or languages in settings.</p>
          </div>
        )}
        
        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-4",
              m.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-neon-red/20 text-neon-red" : "bg-neon-blue/20 text-neon-blue"
            )}>
              {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            
            <div className={cn(
              "max-w-[80%] p-4 rounded-2xl glass-panel",
              m.role === 'user' ? "rounded-tr-none border-neon-red/30" : "rounded-tl-none border-neon-blue/30"
            )}>
              {m.image && (
                <img src={m.image} alt="Uploaded" className="max-w-full h-auto rounded-lg mb-2 border border-white/10" />
              )}
              <div className="markdown-body text-sm sm:text-base">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              <div className="text-[10px] mt-2 opacity-40 text-right">
                {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-lg bg-neon-blue/20 text-neon-blue flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div className="glass-panel p-4 rounded-2xl rounded-tl-none border-neon-blue/30 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-neon-blue" />
              <span className="text-sm text-neon-blue/60">Processing data...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 mb-2 p-2 glass-panel rounded-lg flex items-center gap-2"
            >
              <img src={selectedImage} alt="Preview" className="w-12 h-12 rounded object-cover" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-neon-red hover:bg-neon-red/10 p-1 rounded"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 border-white/10 focus-within:border-neon-blue/50 transition-colors">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 hover:bg-white/5 rounded-xl text-white/60 hover:text-neon-blue transition-colors"
          >
            <ImageIcon size={20} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            className="hidden" 
          />
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Enter command..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm sm:text-base py-3"
          />
          
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="p-3 bg-neon-blue/20 text-neon-blue rounded-xl hover:bg-neon-blue/30 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
