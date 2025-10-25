import React, { useState } from 'react';
import type { Team, ViewType, Role } from '../types';

interface SidebarProps {
  teamData: Team[];
  isSidebarOpen: boolean;
  onClose: () => void;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const RoleIcon: React.FC<{ role: Role }> = ({ role }) => {
    if (role === 'Ketua Tim') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 8a2 2 0 00-2-2h-2V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2H4a2 2 0 00-2 2v2h2v4H2v2a2 2 0 002 2h12a2 2 0 002-2v-2h2v-4h-2V8z" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
    );
};


const Sidebar: React.FC<SidebarProps> = ({ teamData, isSidebarOpen, onClose, activeView, onViewChange }) => {
  const [openTeamIds, setOpenTeamIds] = useState<number[]>(() => teamData.map(team => team.id));

  const toggleTeam = (id: number) => {
    setOpenTeamIds(prev =>
      prev.includes(id)
        ? prev.filter(teamId => teamId !== id)
        : [...prev, id]
    );
  };
  
  const navItems: { id: ViewType; label: string; icon: React.ReactElement }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'My Activity',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'team',
      label: 'Team',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 transform bg-white dark:bg-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto lg:h-auto lg:w-80 lg:flex-shrink-0 border-r border-slate-200 dark:border-slate-700 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center">
                    <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-sky-500">
                        OOTIK
                    </h1>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    aria-label="Close sidebar"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {/* Navigation */}
            <nav className="mb-8">
                <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Menu</h3>
                <ul>
                  {navItems.map(item => (
                    <li key={item.id}>
                      <button
                        onClick={() => onViewChange(item.id)}
                        className={`
                          w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-md font-semibold transition-colors
                          ${activeView === item.id 
                            ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'}
                        `}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
            </nav>

            {/* Team Members */}
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                <h3 className="px-3 mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Team</h3>
                 <div className="space-y-1">
                    {teamData.map(team => (
                        <div key={team.id}>
                            <button
                                onClick={() => toggleTeam(team.id)}
                                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
                            >
                                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">{team.name}</span>
                                <svg className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform ${openTeamIds.includes(team.id) ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openTeamIds.includes(team.id) && (
                                <ul className="pl-3 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-600 animate-fade-in-down">
                                    {team.members.map(member => (
                                        <li key={member.user.id}>
                                            <a href="#" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                                                <img src={member.user.avatar} alt={member.user.name} className="w-8 h-8 rounded-full" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{member.user.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.user.position}</p>
                                                </div>
                                                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400" title={member.role}>
                                                    <RoleIcon role={member.role} />
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;