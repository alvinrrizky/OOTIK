
import React from 'react';
import type { User } from '../types.ts';

interface SidebarProps {
  teamData: User[];
}

const Sidebar: React.FC<SidebarProps> = ({ teamData }) => {
  return (
    <aside className="hidden lg:flex flex-col w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tim Saya</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Daftar anggota tim</p>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <ul className="space-y-3">
          {teamData.map(member => (
            <li key={member.id}>
              <a href="#" className="flex items-center p-2 space-x-3 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors">
                <img className="w-10 h-10 rounded-full" src={member.avatar} alt={member.name} />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.position}</p>
                  <p className={`text-xs font-bold mt-1 ${member.role === 'Ketua Tim' ? 'text-violet-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    {member.role}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
