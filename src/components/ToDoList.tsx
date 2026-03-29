import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, CheckCircle2, Circle, Calendar, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function ToDoList() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('velocity_todos');
    return saved ? JSON.parse(saved).map((t: any) => ({ ...t, createdAt: new Date(t.createdAt) })) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('velocity_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: input,
      completed: false,
      createdAt: new Date()
    };
    setTodos([newTodo, ...todos]);
    setInput('');
    
    // Simple notification simulation
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Velocity AI", { body: `Task added: ${input}` });
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-4 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-neon-red/20 flex items-center justify-center text-neon-red">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold neon-text-red">TASK PROTOCOL</h2>
          <p className="text-white/40 text-sm">Manage your daily operations</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add new task..."
          className="flex-1 glass-panel px-4 py-3 rounded-xl focus:outline-none focus:border-neon-red/50 transition-colors"
        />
        <button
          onClick={addTodo}
          className="p-3 bg-neon-red/20 text-neon-red rounded-xl hover:bg-neon-red/30 transition-all"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={cn(
                "glass-panel p-4 rounded-xl flex items-center justify-between group border-white/5",
                todo.completed && "opacity-50"
              )}
            >
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleTodo(todo.id)}
                  className={cn(
                    "transition-colors",
                    todo.completed ? "text-neon-blue" : "text-white/20 hover:text-white/40"
                  )}
                >
                  {todo.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <span className={cn(
                  "text-sm sm:text-base transition-all",
                  todo.completed && "line-through"
                )}>
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-white/20 hover:text-neon-red p-2 rounded-lg hover:bg-neon-red/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {todos.length === 0 && (
          <div className="text-center py-12 text-white/20">
            <Bell size={48} className="mx-auto mb-4 opacity-10" />
            <p>No active tasks in system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
