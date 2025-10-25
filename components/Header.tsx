
import React, { useState, useEffect, useRef } from 'react';
import { ICONS } from '../constants.tsx';
import type { User } from '../types.ts';

interface HeaderProps {
  user: User;
  onNewTaskClick: () => void;
  theme: string;
  toggleTheme: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onNewTaskClick, theme, toggleTheme, onMenuClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex items-center">
             {/* Hamburger Menu Icon */}
            <button 
                onClick={onMenuClick}
                className="lg:hidden mr-4 p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                aria-label="Open sidebar"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-sky-500">
                OOTIK
              </h1>
              <span className="hidden sm:block ml-3 text-sm font-semibold text-slate-500 dark:text-slate-400 border-l-2 pl-3 border-slate-300 dark:border-slate-600">
                Output Of TIK
              </span>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={onNewTaskClick}
              className="hidden md:flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
            >
              {ICONS.PLUS}
              <span className="text-sm">New Task</span>
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full text-left hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                 <div className="hidden lg:block">
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate" title={user.position}>{user.position}</p>
                 </div>
                <svg className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform hidden lg:block ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-700 animate-fade-in-down z-50">
                  <div className="p-2">
                    <div className="px-3 py-2">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{user.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    </div>
                    <hr className="border-slate-200 dark:border-slate-600 my-1" />
                    <a href="#" className="block w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md">Profile</a>
                    <a href="#" className="block w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md">Settings</a>
                    <button onClick={toggleTheme} className="w-full text-left flex justify-between items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-md">
                      <span>Theme</span>
                      <span>{theme === 'light' ? '☀️' : '🌙'}</span>
                    </button>
                    <hr className="border-slate-200 dark:border-slate-600 my-1" />
                    <a href="#" className="block w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md">Logout</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;