
import React, { useState, useEffect } from 'react';
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
import type { Activity, ActivityStatus, Evidence, User, ViewType } from './types';

// Mock Data
const mockUsers: User[] = [
    {
        id: 1,
        name: 'Alex Johnson',
        avatar: 'https://i.pravatar.cc/150?u=alex',
        position: 'Senior Frontend Developer',
        email: 'alex.johnson@example.com',
        role: 'Ketua Tim',
    },
    {
        id: 2,
        name: 'Siti',
        avatar: 'https://i.pravatar.cc/150?u=siti',
        position: 'Backend Developer',
        email: 'siti@example.com',
        role: 'Anggota',
    },
    {
        id: 3,
        name: 'Joko',
        avatar: 'https://i.pravatar.cc/150?u=joko',
        position: 'DevOps Engineer',
        email: 'joko@example.com',
        role: 'Anggota',
    },
    {
        id: 4,
        name: 'Ani',
        avatar: 'https://i.pravatar.cc/150?u=ani',
        position: 'QA Engineer',
        email: 'ani@example.com',
        role: 'Anggota',
    },
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
  const [teamData] = useState<User[]>(mockUsers);
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

  const md = new MarkdownIt();

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
              if (evidence) {
                  if (status === 'Completed' && activity.reopened) {
                      updatedActivity.reopenEvidence = evidence;
                  } else {
                      updatedActivity.evidence = evidence;
                  }
              }
              if (status === 'In Progress') {
                  delete updatedActivity.evidence;
              }
              if (status === 'Re-Open') {
                  updatedActivity.reopened = true;
                  updatedActivity.status = 'To Do';
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
      const teamActivitiesText = teamData.map(member => {
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
                    teamData={teamData} 
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
    <div className={`flex h-screen p-4 gap-4 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 ${isAppLoading ? 'opacity-0' : 'opacity-100'}`}>
        <Sidebar 
            teamData={teamData}
        />
        
        <div className="flex flex-col flex-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <Header 
              user={user} 
              activeView={activeView}
              onViewChange={(view) => setActiveView(view)}
              onNewTaskClick={() => setIsNewTaskModalOpen(true)}
              theme={theme}
              toggleTheme={toggleTheme}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderView()}
            </main>
        </div>
        
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
