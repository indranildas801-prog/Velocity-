import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Trophy, ArrowRight, RefreshCcw, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateQuiz, Language } from '../lib/gemini';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function Quiz({ language }: { language: Language }) {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const startQuiz = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const data = await generateQuiz(topic, language);
      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].correctIndex) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        if (score + (index === questions[currentIndex].correctIndex ? 1 : 0) >= 3) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00f2ff', '#ff003c', '#ffffff']
          });
        }
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="animate-spin text-neon-blue" />
        <p className="neon-text-blue font-mono animate-pulse">GENERATING NEURAL CHALLENGE...</p>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue mb-6 border-2 border-neon-blue"
        >
          <Trophy size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold mb-2">CHALLENGE COMPLETE</h2>
        <p className="text-white/60 mb-8">Your cognitive performance score:</p>
        <div className="text-6xl font-bold neon-text-blue mb-12">
          {score} / {questions.length}
        </div>
        <button
          onClick={() => {
            setQuestions([]);
            setTopic('');
          }}
          className="flex items-center gap-2 px-8 py-3 bg-neon-blue/20 text-neon-blue rounded-xl hover:bg-neon-blue/30 transition-all border border-neon-blue/30"
        >
          <RefreshCcw size={20} />
          NEW CHALLENGE
        </button>
      </div>
    );
  }

  if (questions.length > 0) {
    const q = questions[currentIndex];
    return (
      <div className="max-w-2xl mx-auto p-4 h-full flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <span className="text-xs font-mono text-neon-blue">QUESTION {currentIndex + 1} OF {questions.length}</span>
          <div className="h-1 w-32 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neon-blue transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold mb-8">{q.question}</h2>

        <div className="grid gap-4">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={cn(
                "glass-panel p-4 rounded-xl text-left transition-all border-white/5",
                selectedAnswer === i && (i === q.correctIndex ? "bg-green-500/20 border-green-500" : "bg-neon-red/20 border-neon-red"),
                selectedAnswer !== null && i === q.correctIndex && "bg-green-500/20 border-green-500",
                selectedAnswer === null && "hover:border-neon-blue/50 hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 h-full flex flex-col items-center justify-center">
      <div className="w-20 h-20 rounded-2xl bg-neon-blue/20 flex items-center justify-center text-neon-blue mb-8 animate-float">
        <Brain size={40} />
      </div>
      <h2 className="text-3xl font-bold mb-2 text-center">KNOWLEDGE MATRIX</h2>
      <p className="text-white/40 text-center mb-12">Initialize a subject-specific cognitive assessment.</p>
      
      <div className="w-full space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic (e.g. Astrophysics, History, Sports)"
          className="w-full glass-panel px-6 py-4 rounded-2xl focus:outline-none focus:border-neon-blue/50 transition-colors text-center"
        />
        <button
          onClick={startQuiz}
          disabled={!topic.trim()}
          className="w-full flex items-center justify-center gap-2 py-4 bg-neon-blue/20 text-neon-blue rounded-2xl hover:bg-neon-blue/30 transition-all border border-neon-blue/30 font-bold disabled:opacity-50"
        >
          INITIALIZE QUIZ
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
