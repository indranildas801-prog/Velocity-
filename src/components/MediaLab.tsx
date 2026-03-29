import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Video, Image as ImageIcon, FileText, Loader2, Play, Download, Key, ExternalLink } from 'lucide-react';
import { generateImage } from '../lib/gemini';
import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function MediaLab() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ type: 'image' | 'video'; url: string } | null>(null);
  const [status, setStatus] = useState('');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    } else {
      setHasKey(true); // Fallback for local dev
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Assume success per guidelines
    }
  };

  const getAI = () => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
    return new GoogleGenAI({ apiKey });
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatus('Synthesizing visual data...');
    try {
      const url = await generateImage(prompt);
      if (url) setResult({ type: 'image', url });
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('not found')) {
        setHasKey(false);
      }
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatus('Initializing Veo engine...');
    try {
      const ai = getAI();
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        setStatus('Rendering temporal frames...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || "";
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: { 'x-goog-api-key': apiKey },
        });
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setResult({ type: 'video', url });
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('PERMISSION_DENIED') || error.message?.includes('not found')) {
        setHasKey(false);
      } else {
        alert("Video generation failed. Ensure you have a valid API key with Veo access.");
      }
    } finally {
      setIsGenerating(false);
      setStatus('');
    }
  };

  if (hasKey === false) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neon-red/10 flex items-center justify-center text-neon-red border border-neon-red/30">
          <Key size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">API KEY REQUIRED</h2>
          <p className="text-white/40 max-w-md">
            Advanced media generation (Veo/Imagen) requires a paid Google Cloud project API key.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={handleSelectKey}
            className="w-full py-4 bg-neon-blue text-black font-bold rounded-2xl hover:scale-105 transition-transform"
          >
            SELECT API KEY
          </button>
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-neon-blue hover:underline flex items-center justify-center gap-1"
          >
            Learn about billing <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center text-neon-blue">
          <Video size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold neon-text-blue">MEDIA LAB</h2>
          <p className="text-white/40 text-sm">Advanced asset generation protocols</p>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-white/5 space-y-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the visual asset you wish to manifest..."
          className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none h-32 custom-scrollbar"
        />
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleGenerateImage}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-neon-blue/20 text-neon-blue rounded-2xl hover:bg-neon-blue/30 transition-all border border-neon-blue/30 font-bold disabled:opacity-50"
          >
            <ImageIcon size={20} />
            GENERATE IMAGE
          </button>
          <button
            onClick={handleGenerateVideo}
            disabled={isGenerating || !prompt.trim()}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-neon-red/20 text-neon-red rounded-2xl hover:bg-neon-red/30 transition-all border border-neon-red/30 font-bold disabled:opacity-50"
          >
            <Video size={20} />
            GENERATE VIDEO
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl border-white/5 overflow-hidden relative flex items-center justify-center min-h-[300px]">
        {isGenerating ? (
          <div className="text-center space-y-4">
            <Loader2 size={48} className="animate-spin text-neon-blue mx-auto" />
            <p className="neon-text-blue font-mono animate-pulse">{status}</p>
          </div>
        ) : result ? (
          <div className="w-full h-full p-4 flex flex-col items-center justify-center gap-4">
            {result.type === 'image' ? (
              <img src={result.url} alt="Generated" className="max-w-full max-h-full rounded-2xl shadow-2xl" />
            ) : (
              <video src={result.url} controls className="max-w-full max-h-full rounded-2xl shadow-2xl" />
            )}
            <a 
              href={result.url} 
              download={`velocity-${result.type}-${Date.now()}`}
              className="flex items-center gap-2 px-6 py-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm"
            >
              <Download size={16} />
              DOWNLOAD ASSET
            </a>
          </div>
        ) : (
          <div className="text-white/10 text-center">
            <Play size={64} className="mx-auto mb-4 opacity-5" />
            <p>Awaiting generation parameters...</p>
          </div>
        )}
      </div>
    </div>
  );
}
