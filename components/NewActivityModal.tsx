import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Activity, ActivityCategory } from '../types.ts';
import { CATEGORIES } from '../constants.tsx';

interface NewActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTaskData: Omit<Activity, 'id' | 'status' | 'assignee' | 'evidence'>) => void;
}

const NewActivityModal: React.FC<NewActivityModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Project');
  const [points, setPoints] = useState(10);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestPoints = useCallback(async (taskTitle: string) => {
    if (!taskTitle.trim()) return;
    setIsSuggesting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Based on the following task title, suggest an appropriate XP (Experience Points) reward. The task is "${taskTitle}". The XP should be between 5 and 100, reflecting the task's likely complexity and effort. Respond with only a single number.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const suggestedPointsText = response.text.trim();
      const suggestedPoints = parseInt(suggestedPointsText, 10);

      if (!isNaN(suggestedPoints) && suggestedPoints >= 5 && suggestedPoints <= 100) {
        setPoints(Math.round(suggestedPoints / 5) * 5); // Snap to nearest 5
      }
    } catch (error) {
      console.error("Error suggesting points:", error);
      setPoints(10); // Reset to default on error
    } finally {
      setIsSuggesting(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setCategory('Project');
        setPoints(10);
        setIsSuggesting(false);
      }, 200);
      return () => clearTimeout(timer);
    } else {
        setDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (title.trim().length < 5) {
        setPoints(10); // Reset to default for short titles
        return;
    };
    
    const handler = setTimeout(() => {
      handleSuggestPoints(title);
    }, 800); // Debounce for 800ms after user stops typing

    return () => {
      clearTimeout(handler);
    };
  }, [title, handleSuggestPoints]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !category) return;
    onSubmit({
      title,
      description,
      date,
      time: time || undefined,
      category,
      points,
    });
    onClose();
  };
  
  const isSubmitDisabled = !title.trim() || !date || isSuggesting;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg m-4 transform transition-all duration-300 ease-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Create New Task</h3>
          <button type="button" className="text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close modal">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div>
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Title <span className="text-red-500">*</span></label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5" placeholder="e.g., Design new landing page" required />
            </div>
            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5" placeholder="Add more details about the task..."></textarea>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Due Date <span className="text-red-500">*</span></label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5" required />
              </div>
              <div>
                <label htmlFor="time" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Time (Optional)</label>
                <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">Category <span className="text-red-500">*</span></label>
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ActivityCategory)} className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5">
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="points" className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">XP Reward (AI Generated)</label>
                <div className="relative">
                    <input type="number" id="points" value={points} readOnly className="bg-slate-200 dark:bg-slate-900/50 cursor-not-allowed border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {isSuggesting ? (
                            <svg className="animate-spin h-5 w-5 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                             <span className="text-lg">✨</span>
                        )}
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end p-6 space-x-2 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="text-slate-800 dark:text-white bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-700 rounded-lg text-sm px-5 py-2.5 text-center">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitDisabled} className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-violet-300 dark:disabled:bg-violet-800 disabled:cursor-not-allowed">
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewActivityModal;