import React, { useState } from 'react';
// Fix: Add .ts extension to import path.
import type { TeamMember } from '../types.ts';
// Fix: Add .tsx extension to import path.
import TeamMemberDetailModal from './TeamMemberDetailModal.tsx';
// Fix: Add .tsx extension to import path.
import ProgressBar from './ProgressBar.tsx';
// Fix: Add .tsx extension to import path.
import { LEVEL_THRESHOLDS } from '../constants.tsx';

interface TeamViewProps {
  teamMembers: TeamMember[];
  onSummarizeClick: () => void;
}

const TeamMemberCard: React.FC<{ member: TeamMember; onClick: () => void }> = ({ member, onClick }) => {
  const currentLevelPoints = LEVEL_THRESHOLDS[member.level - 1] ?? 0;
  const nextLevelPoints = LEVEL_THRESHOLDS[member.level] ?? member.points;
  const pointsForLevel = member.points - currentLevelPoints;
  const pointsToNextLevel = nextLevelPoints - currentLevelPoints;

  const todoCount = member.activities.filter(a => a.status === 'To Do').length;
  const pendingCount = member.activities.filter(a => a.status === 'Pending').length;
  const completedCount = member.activities.filter(a => a.status === 'Completed').length;

  return (
    <div 
        className="bg-white dark:bg-slate-800/50 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-5 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer flex flex-col"
        onClick={onClick}
    >
      <div className="flex flex-col items-center text-center flex-grow">
        <img className="w-20 h-20 rounded-full mb-4 ring-4 ring-offset-4 ring-violet-500 ring-offset-white dark:ring-offset-slate-800" src={member.avatar} alt={member.name} />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{member.name}</h3>
        <div className="mt-4 w-full">
            <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-semibold text-violet-600 dark:text-violet-400">Level {member.level}</span>
                <span className="text-slate-600 dark:text-slate-400">{member.points} XP</span>
            </div>
            <ProgressBar value={pointsForLevel} max={pointsToNextLevel} />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 w-full grid grid-cols-3 text-center">
          <div>
            <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{todoCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">To Do</p>
          </div>
          <div>
            <p className="text-lg font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
          </div>
          <div>
            <p className="text-lg font-bold text-emerald-500">{completedCount}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed</p>
          </div>
        </div>
    </div>
  );
};

const TeamView: React.FC<TeamViewProps> = ({ teamMembers, onSummarizeClick }) => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member);
  };

  const handleCloseModal = () => {
    setSelectedMember(null);
  };

  return (
    <div className="p-4 sm:p-0">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Team Overview</h1>
          <button
              onClick={onSummarizeClick}
              className="flex items-center space-x-2 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
              >
              <span>✨</span>
              <span className="text-sm">Rekap Aktivitas Tim</span>
          </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {teamMembers.map(member => (
          <TeamMemberCard key={member.id} member={member} onClick={() => handleMemberClick(member)} />
        ))}
      </div>
      
      {selectedMember && (
        <TeamMemberDetailModal
          isOpen={!!selectedMember}
          onClose={handleCloseModal}
          member={selectedMember}
        />
      )}
    </div>
  );
};

export default TeamView;