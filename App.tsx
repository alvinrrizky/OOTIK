
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import MarkdownIt from 'markdown-it';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CalendarView from './components/CalendarView';
import TeamView from './components/TeamView';
import HistoryView from './components/HistoryView';
import NewActivityModal from './components/NewActivityModal';
import ActivityDetailModal from './components/ActivityDetailModal';
import EvidenceModal from './components/EvidenceModal';
import SummaryModal from './components/SummaryModal';
import SplashScreen from './components/SplashScreen';
import type { Activity, ActivityStatus, Evidence, User, ViewType, Team } from './types';
import { ICONS } from './constants';

// Mock Data
const mockUsers: User[] = [
    {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        position: 'Senior Frontend Developer',
        email: 'alex.johnson@example.com',
    },
    {
        id: 2,
        name: 'Siti',
        avatar: 'https://i.pravatar.cc/150?u=siti',
        position: 'Backend Developer',
        email: 'siti@example.com',
    },
    {
        id: 3,
        name: 'Joko',
        avatar: 'https://i.pravatar.cc/150?u=joko',
        position: 'DevOps Engineer',
        email: 'joko@example.com',
    },
    {
        id: 4,
        name: 'Ani',
        avatar: 'https://i.pravatar.cc/150?u=ani',
        position: 'QA Engineer',
        email: 'ani@example.com',
    },
];

const mockTeams: Team[] = [
    {
        id: 1,
        name: 'Tim Management TIK',
        members: [
            { user: mockUsers[0], role: 'Ketua Tim' },
            { user: mockUsers[1], role: 'Anggota' },
        ]
    },
    {
        id: 2,
        name: 'Tim Keamanan',
        members: [
            { user: mockUsers[2], role: 'Ketua Tim' },
            { user: mockUsers[3], role: 'Anggota' },
        ]
    }
];

const mockActivities: Activity[] = [
    {
        id: 1,
        title: 'Design landing page mockups',
        description: 'Create high-fidelity mockups for the new landing page in Figma.',
        date: '2025-10-25',
        time: '14:00',
        category: 'Project',
        status: 'In Progress',
        assignee: mockUsers[0],
    },
    {
        id: 2,
        title: 'Develop API for user authentication',
        description: 'Implement JWT-based authentication for the user login and registration endpoints.',
        date: '2025-10-26',
        category: 'Project',
        status: 'To Do',
        assignee: mockUsers[1],
    },
    {
        id: 3,
        title: 'Review team performance',
        description: 'Quarterly performance review meeting with the development team.',
        date: '2025-10-25',
        time: '10:00',
        category: 'Team',
        status: 'Completed',
        assignee: mockUsers[0],
        evidence: { type: 'text', content: 'Meeting notes have been sent to all participants.'},
    },
     {
        id: 4,
        title: 'Submit monthly expense report',
        description: 'Compile and submit the expense report for October.',
        date: '2025-10-24',
        category: 'Personal',
        status: 'Completed',
        assignee: mockUsers[0],
        evidence: { type: 'text', content: 'Report submitted via HR portal.'},
    },
    {
        id: 5,
        title: 'Fix login button bug',
        description: 'The login button is not responsive on mobile devices.',
        date: '2025-10-25',
        category: 'Urgent',
        status: 'Pending',
        assignee: mockUsers[0],
        evidence: { type: 'text', content: 'Waiting for confirmation from QA on the fix.'},
    },
    {
        id: 6,
        title: 'Deploy staging server updates',
        description: 'Deploy the latest changes from the develop branch to the staging environment.',
        date: '2025-10-27',
        category: 'Project',
        status: 'To Do',
        assignee: mockUsers[2],
    },
    {
        id: 7,
        title: 'Plan team lunch',
        description: 'Organize a team lunch for the end of the month.',
        date: '2025-10-29',
        category: 'Team',
        status: 'To Do',
        assignee: mockUsers[0],
    },
];


const App: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [teams] = useState<Team[]>(mockTeams);
  const [user] = useState<User>(mockUsers[0]);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [theme, setTheme] = useState('light');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [evidenceMode, setEvidenceMode] = useState<'complete' | 'pend'>('complete');
  const [activityToUpdate, setActivityToUpdate] = useState<number | null>(null);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [summaryTitle, setSummaryTitle] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const md = new MarkdownIt();

  const allUsers = useMemo(() => {
    const userMap = new Map<number, User>();
    teams.forEach(team => {
        team.members.forEach(member => {
            if (!userMap.has(member.user.id)) {
                userMap.set(member.user.id, member.user);
            }
        });
    });
    return Array.from(userMap.values());
  }, [teams]);


  useEffect(() => {
    const localTheme = localStorage.getItem('theme');
    if (localTheme) {
      setTheme(localTheme);
      document.documentElement.classList.toggle('dark', localTheme === 'dark');
    }

    const timer = setTimeout(() => {
        setIsAppLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleViewDetails = (id: number) => {
    const activity = activities.find(a => a.id === id) || null;
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };
  
  const handleAddNewTask = (newTaskData: Omit<Activity, 'id' | 'status' | 'assignee' | 'evidence' | 'reopened' | 'reopenEvidence'>) => {
    const newActivity: Activity = {
        ...newTaskData,
        id: Date.now(),
        status: 'To Do',
        assignee: user,
    };
    setActivities(prev => [newActivity, ...prev]);
  }

  const handleUpdateStatus = (id: number, status: ActivityStatus, evidence?: Evidence) => {
    setActivities(prev => prev.map(activity => {
        if (activity.id === id) {
            const updatedActivity = { ...activity, status };

            // Handle evidence submission
            if (evidence) {
                // If completing a task that was in 'Re-Open' state
                if (activity.status === 'Re-Open' && status === 'Completed') {
                    updatedActivity.reopenEvidence = evidence;
                } 
                // For the first completion or for pending status
                else if (status === 'Completed' || status === 'Pending') {
                    updatedActivity.evidence = evidence;
                }
            }
            
            // Handle specific status change logic
            if (status === 'In Progress') {
                delete updatedActivity.evidence;
            }

            if (status === 'Re-Open') {
                updatedActivity.reopened = true;
            }

            return updatedActivity;
        }
        return activity;
    }));
    setIsDetailModalOpen(false);
    setIsEvidenceModalOpen(false);
    setActivityToUpdate(null);
  };

  const handleDelete = (id: number) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    setIsDetailModalOpen(false);
  }

  const handleCompleteClick = (id: number) => {
    setActivityToUpdate(id);
    setEvidenceMode('complete');
    setIsEvidenceModalOpen(true);
    setIsDetailModalOpen(false);
  }

  const handlePendingClick = (id: number) => {
    setActivityToUpdate(id);
    setEvidenceMode('pend');
    setIsEvidenceModalOpen(true);
    setIsDetailModalOpen(false);
  }

  const handleEvidenceSubmit = (evidence: Evidence) => {
    if (activityToUpdate) {
        handleUpdateStatus(activityToUpdate, evidenceMode === 'complete' ? 'Completed' : 'Pending', evidence);
    }
  }

  const generateTeamSummary = async (date: string) => {
    setIsSummaryModalOpen(true);
    setIsSummaryLoading(true);
    setSummaryContent('');
    setSummaryTitle('✨ Rekap Aktivitas Tim');

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const teamActivitiesText = allUsers.map(member => {
        const memberActivities = activities.filter(a => a.assignee.id === member.id && a.date === date);
        if (memberActivities.length === 0) return `Anggota: ${member.name}\nTugas: Tidak ada tugas untuk hari ini.`;
        return `Anggota: ${member.name}\nTugas:\n${memberActivities.map(task => `- ${task.title} (Status: ${task.status})`).join('\n')}`;
      }).join('\n\n');

      const prompt = `
        Berdasarkan data aktivitas tim berikut untuk tanggal ${date}, buat ringkasan singkat tentang kemajuan tim. 
        Sorot setiap hambatan atau tugas yang tertunda. Jika seorang anggota tidak memiliki tugas, sebutkan itu. Format output sebagai Markdown dalam Bahasa Indonesia.
        
        Data:
        ${teamActivitiesText}
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const rawText = response.text;
      setSummaryContent(md.render(rawText));

    } catch (error) {
      console.error("Error generating summary:", error);
      setSummaryContent("<p>Maaf, saya tidak dapat membuat ringkasan saat ini. Silakan periksa konsol untuk kesalahan.</p>");
    } finally {
      setIsSummaryLoading(false);
    }
  };
  
  const generateMyActivitySummary = async (date: Date) => {
    setIsSummaryModalOpen(true);
    setIsSummaryLoading(true);
    setSummaryContent('');
    setSummaryTitle('👤 Rekap Aktivitas Saya');

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const selectedMonth = date.getMonth();
      const selectedYear = date.getFullYear();

      const userActivities = activities.filter(a => {
        const activityDate = new Date(a.date);
        const userTimezoneOffset = activityDate.getTimezoneOffset() * 60000;
        const localActivityDate = new Date(activityDate.getTime() + userTimezoneOffset);
        return a.assignee.id === user.id && localActivityDate.getMonth() === selectedMonth && localActivityDate.getFullYear() === selectedYear
      });

      const userActivitiesText = userActivities.length > 0 
        ? userActivities.map(task => `- ${task.title} (Status: ${task.status}, Tenggat: ${task.date})`).join('\n')
        : "Tidak ada aktivitas untuk periode ini.";

      const prompt = `
        Berdasarkan data aktivitas berikut untuk ${user.name} selama ${date.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}, 
        buat ringkasan singkat tentang kemajuannya. Sorot pencapaian utama, area di mana tugas tertunda, 
        dan produktivitas secara keseluruhan. Format output sebagai Markdown dalam Bahasa Indonesia.
        
        Data:
        ${userActivitiesText}
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const rawText = response.text;
      setSummaryContent(md.render(rawText));

    } catch (error) {
      console.error("Error generating my activity summary:", error);
      setSummaryContent("<p>Maaf, saya tidak dapat membuat ringkasan saat ini. Silakan periksa konsol untuk kesalahan.</p>");
    } finally {
      setIsSummaryLoading(false);
    }
  };


  const renderView = () => {
    const myActivities = activities.filter(a => a.assignee.id === user.id);
    switch (activeView) {
      case 'dashboard':
        return <CalendarView activities={myActivities} onActivityClick={handleViewDetails} />;
      case 'history':
        return <HistoryView 
                    activities={myActivities} 
                    onViewDetails={handleViewDetails} 
                    onGenerateSummary={generateMyActivitySummary}
                    isSummaryLoading={isSummaryLoading}
                />;
      case 'team':
        return <TeamView 
                    teamData={allUsers} 
                    activities={activities} 
                    onViewActivityDetails={handleViewDetails}
                    onGenerateSummary={generateTeamSummary}
                    isSummaryLoading={isSummaryLoading}
                />;
      default:
        return <CalendarView activities={myActivities} onActivityClick={handleViewDetails} />;
    }
  };

  if (isAppLoading) {
    return <SplashScreen isFadingOut={!isAppLoading} />;
  }

  return (
    <div className={`relative min-h-screen lg:flex text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 ${isAppLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Sidebar 
            teamData={teams}
            isSidebarOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activeView={activeView}
            onViewChange={handleViewChange}
        />
        
        <div className="flex flex-col flex-1 bg-slate-100 dark:bg-slate-900 lg:rounded-none lg:shadow-none lg:border-none rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <Header 
              user={user} 
              onNewTaskClick={() => setIsNewTaskModalOpen(true)}
              theme={theme}
              toggleTheme={toggleTheme}
              onMenuClick={() => setIsSidebarOpen(true)}
            />
            <main className="flex-1 p-2 sm:p-4 md:p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
        
        {/* Floating Action Button for Mobile */}
        <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
            aria-label="Create New Task"
        >
          {ICONS.PLUS}
        </button>

        <NewActivityModal 
          isOpen={isNewTaskModalOpen} 
          onClose={() => setIsNewTaskModalOpen(false)}
          onSubmit={handleAddNewTask}
        />
        
        <ActivityDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          activity={selectedActivity}
          onComplete={handleCompleteClick}
          onPending={handlePendingClick}
          onSetInProgress={(id) => handleUpdateStatus(id, 'In Progress')}
          onReopen={(id) => handleUpdateStatus(id, 'Re-Open')}
          onBackToTodo={(id) => handleUpdateStatus(id, 'To Do')}
          onDelete={handleDelete}
        />
        
        <EvidenceModal
            isOpen={isEvidenceModalOpen}
            onClose={() => setIsEvidenceModalOpen(false)}
            onSubmit={handleEvidenceSubmit}
            taskTitle={activities.find(a => a.id === activityToUpdate)?.title || ''}
            mode={evidenceMode}
        />

        <SummaryModal 
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          title={summaryTitle}
          summary={summaryContent}
          isLoading={isSummaryLoading}
        />

    </div>
  );
};

export default App;