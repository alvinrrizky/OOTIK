import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { marked } from 'marked';

// Component Imports
import Header from './components/Header.tsx';
import ActivityList from './components/ActivityList.tsx';
import GamificationDashboard from './components/GamificationDashboard.tsx';
import NewActivityModal from './components/NewActivityModal.tsx';
import ActivityDetailModal from './components/ActivityDetailModal.tsx';
import EvidenceModal from './components/EvidenceModal.tsx';
import NotificationCenter from './components/NotificationCenter.tsx';
import SplashScreen from './components/SplashScreen.tsx';
import CalendarView from './components/CalendarView.tsx';
import TeamView from './components/TeamView.tsx';
import SummaryModal from './components/SummaryModal.tsx';
import DashboardChart from './components/DashboardChart.tsx';

// Type Imports
import type { User, Activity, Achievement, Notification, Evidence, TeamMember, ActivityStatus, LeaderboardUser } from './types.ts';

// Constant Imports
import { ICONS, LEVEL_THRESHOLDS } from './constants.tsx';

// MOCK DATA
const MOCK_USER: User = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatar: `https://i.pravatar.cc/150?u=jane`,
  level: 3,
  points: 320,
  unlockedAchievementIds: [1],
};

const MOCK_ACTIVITIES: Activity[] = [
    { id: 1, title: 'Finalize Q3 report slides', description: 'Review the data and polish the presentation for the upcoming board meeting.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Completed', category: 'Project', points: 30, assignee: { name: 'Jane Doe', avatar: `https://i.pravatar.cc/150?u=jane` }, evidence: { type: 'text', content: 'Slides are finalized and shared in the project folder.'} },
    { id: 2, title: 'Design new dashboard UI', description: 'Create mockups in Figma for the new user dashboard.', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'To Do', category: 'Project', points: 50, assignee: { name: 'Jane Doe', avatar: `https://i.pravatar.cc/150?u=jane` } },
    { id: 3, title: 'Team brainstorming session', description: 'Lead the weekly brainstorming session for new features.', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '10:30', status: 'To Do', category: 'Team', points: 20, assignee: { name: 'Jane Doe', avatar: `https://i.pravatar.cc/150?u=jane` } },
    { id: 4, title: 'Fix login bug #A45', description: 'Investigate and resolve the intermittent login issue on mobile.', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Pending', category: 'Urgent', points: 45, assignee: { name: 'Jane Doe', avatar: `https://i.pravatar.cc/150?u=jane` } },
    { id: 5, title: 'Update personal portfolio', description: 'Add recent projects to online portfolio website.', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'To Do', category: 'Personal', points: 25, assignee: { name: 'Jane Doe', avatar: `https://i.pravatar.cc/150?u=jane` } },
];

const MOCK_TEAM_MEMBERS: TeamMember[] = [
    { ...MOCK_USER, activities: MOCK_ACTIVITIES },
    { id: 2, name: 'Alex Ray', email: 'alex@example.com', avatar: `https://i.pravatar.cc/150?u=alex`, level: 4, points: 560, unlockedAchievementIds: [1, 2], activities: [
        { id: 6, title: 'Develop API endpoint for user profiles', description: 'Build the new GET and POST endpoints.', date: '2024-07-28', status: 'Completed', category: 'Project', points: 40, assignee: { name: 'Alex Ray', avatar: `https://i.pravatar.cc/150?u=alex` } },
        { id: 7, title: 'Code review for feature branch', description: 'Review pull request #112 from Chloe.', date: '2024-07-30', time: '15:00', status: 'To Do', category: 'Team', points: 15, assignee: { name: 'Alex Ray', avatar: `https://i.pravatar.cc/150?u=alex` } },
    ]},
    { id: 3, name: 'Ben Carter', email: 'ben@example.com', avatar: `https://i.pravatar.cc/150?u=ben`, level: 2, points: 180, unlockedAchievementIds: [1], activities: [
        { id: 8, title: 'Write documentation for new API', description: 'Use Swagger to document all endpoints.', date: '2024-08-05', status: 'To Do', category: 'Project', points: 25, assignee: { name: 'Ben Carter', avatar: `https://i.pravatar.cc/150?u=ben` } },
        { id: 9, title: 'User acceptance testing', description: 'Run through the UAT scripts for the latest build.', date: '2024-08-02', status: 'Pending', category: 'Project', points: 30, assignee: { name: 'Ben Carter', avatar: `https://i.pravatar.cc/150?u=ben` } },
    ]},
    { id: 4, name: 'Chloe Davis', email: 'chloe@example.com', avatar: `https://i.pravatar.cc/150?u=chloe`, level: 3, points: 410, unlockedAchievementIds: [1, 2], activities: [
        { id: 10, title: 'Create marketing assets for launch', description: 'Design social media banners and email templates.', date: '2024-07-29', status: 'Completed', category: 'Project', points: 35, assignee: { name: 'Chloe Davis', avatar: `https://i.pravatar.cc/150?u=chloe` } },
    ]},
];

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 1, title: 'First Strike', description: 'Complete your first task.', icon: '🎯', points: 10 },
  { id: 2, title: 'Task Master', description: 'Complete 10 tasks.', icon: '🧑‍🚀', points: 50 },
  { id: 3, title: 'Level 5 Reached', description: 'Achieve player level 5.', icon: '🌟', points: 100 },
  { id: 4, 'title': 'Project Pro', description: 'Complete 5 project tasks.', icon: '💼', points: 75},
  { id: 5, 'title': 'Team Player', description: 'Complete 5 team tasks.', icon: '🤝', points: 75},
  { id: 6, 'title': 'Firefighter', description: 'Complete 3 urgent tasks.', icon: '🚒', points: 75},
];

const App: React.FC = () => {
    // Global State
    const [isLoading, setIsLoading] = useState(true);
    const [isSplashMounted, setIsSplashMounted] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    const [theme, setTheme] = useState('dark');
    const [user, setUser] = useState<User>(MOCK_USER);
    const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeView, setActiveView] = useState<'dashboard' | 'calendar' | 'team'>('dashboard');

    // Modal State
    const [isNewActivityModalOpen, setIsNewActivityModalOpen] = useState(false);
    const [isActivityDetailModalOpen, setIsActivityDetailModalOpen] = useState(false);
    const [selectedActivityId, setSelectedActivityId] = useState<number | null>(null);
    const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
    const [activityToCompleteId, setActivityToCompleteId] = useState<number | null>(null);
    const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');

    // Derived State
    const selectedActivity = activities.find(a => a.id === selectedActivityId) || null;
    const activityToComplete = activities.find(a => a.id === activityToCompleteId) || null;
    const myActivities = activities.filter(a => a.assignee.name === user.name);
    const leaderboardData: LeaderboardUser[] = [...teamMembers]
        .sort((a, b) => b.points - a.points)
        .map(({ id, name, avatar, level, points }) => ({ id, name, avatar, level, points }));

    // Effects
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setIsFadingOut(true);
            const unmountTimer = setTimeout(() => {
                setIsSplashMounted(false);
            }, 700); // Must match slide-up animation duration
            return () => clearTimeout(unmountTimer);
        }
    }, [isLoading]);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    // Handlers
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const addNotification = useCallback((message: string, type: Notification['type']) => {
        const iconMap = { points: ICONS.POINTS, levelUp: ICONS.LEVEL_UP, achievement: ICONS.ACHIEVEMENT };
        const newNotification: Notification = {
            id: Date.now(),
            message,
            type,
            icon: iconMap[type],
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };
    
    const checkAchievements = useCallback((updatedUser: User, updatedActivities: Activity[]) => {
        const completedCount = updatedActivities.filter(a => a.status === 'Completed' && a.assignee.name === updatedUser.name).length;
        const newAchievements: Achievement[] = [];

        if (!updatedUser.unlockedAchievementIds.includes(1) && completedCount >= 1) newAchievements.push(ALL_ACHIEVEMENTS[0]);
        if (!updatedUser.unlockedAchievementIds.includes(2) && completedCount >= 10) newAchievements.push(ALL_ACHIEVEMENTS[1]);
        if (!updatedUser.unlockedAchievementIds.includes(3) && updatedUser.level >= 5) newAchievements.push(ALL_ACHIEVEMENTS[2]);

        if (newAchievements.length > 0) {
            let totalPointsFromAchievements = 0;
            const newUnlockedIds = [...updatedUser.unlockedAchievementIds];
            
            newAchievements.forEach(ach => {
                if (!newUnlockedIds.includes(ach.id)) {
                    totalPointsFromAchievements += ach.points;
                    newUnlockedIds.push(ach.id);
                    addNotification(`Achievement Unlocked: ${ach.title}!`, 'achievement');
                }
            });

            return {
                points: updatedUser.points + totalPointsFromAchievements,
                unlockedAchievementIds: newUnlockedIds,
            };
        }
        return null;
    }, [addNotification]);

    const handleCompleteTask = (evidence: Evidence) => {
        if (!activityToCompleteId) return;

        let updatedUser = { ...user };
        const updatedActivities = activities.map(act =>
            act.id === activityToCompleteId ? { ...act, status: 'Completed' as ActivityStatus, evidence } : act
        );
        setActivities(updatedActivities);

        const completedActivity = activities.find(act => act.id === activityToCompleteId);
        if (completedActivity) {
            const pointsEarned = completedActivity.points;
            updatedUser.points += pointsEarned;
            addNotification(`+${pointsEarned} XP for completing "${completedActivity.title}"`, 'points');

            let newLevel = updatedUser.level;
            while (newLevel < LEVEL_THRESHOLDS.length && updatedUser.points >= LEVEL_THRESHOLDS[newLevel]) {
                newLevel++;
            }
            if (newLevel > updatedUser.level) {
                updatedUser.level = newLevel;
                addNotification(`You've reached Level ${newLevel}!`, 'levelUp');
            }

            const achievementUpdate = checkAchievements(updatedUser, updatedActivities);
            if (achievementUpdate) {
                updatedUser = { ...updatedUser, ...achievementUpdate };
            }

            setUser(updatedUser);
        }

        setIsEvidenceModalOpen(false);
        setActivityToCompleteId(null);
    };

    const handleReopenTask = (id: number) => {
        setActivities(prev => prev.map(act => act.id === id ? { ...act, status: 'To Do', evidence: undefined } : act));
        setIsActivityDetailModalOpen(false);
    };
    
    const handleAddNewTask = (newTaskData: Omit<Activity, 'id' | 'status' | 'assignee' | 'evidence'>) => {
        const newActivity: Activity = {
            id: Date.now(),
            status: 'To Do',
            assignee: { name: user.name, avatar: user.avatar },
            ...newTaskData,
        };
        setActivities(prev => [newActivity, ...prev]);
    };

    const handleDeleteActivity = (id: number) => {
        if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
            setActivities(prev => prev.filter(act => act.id !== id));
            setIsActivityDetailModalOpen(false);
        }
    };

    const handleSummarizeTeam = async () => {
        setIsSummaryModalOpen(true);
        setIsSummaryLoading(true);
        setSummaryContent('');

        const prompt = `
        Analisis data aktivitas tim berikut dan berikan ringkasan yang singkat dan mendalam dalam format Markdown.

        Ringkasan Anda harus mencakup:
        1.  **Kemajuan Tim Secara Keseluruhan:** Apakah mereka sesuai jalur? Bagaimana momentum secara umum?
        2.  **Pencapaian Utama:** Sorot tugas-tugas penting yang telah selesai.
        3.  **Potensi Hambatan:** Identifikasi anggota dengan banyak tugas 'To Do' atau 'Pending', yang menunjukkan mereka mungkin memerlukan bantuan.
        4.  **Performa Terbaik:** Beri penghargaan kepada anggota dengan tingkat penyelesaian tinggi atau yang telah mendapatkan banyak poin.
        
        Berikut adalah datanya:
        ${teamMembers.map(member => `
        ---
        **Anggota:** ${member.name} (Level ${member.level}, ${member.points} XP)
        **Tugas:**
        ${member.activities.map(act => `- ${act.title} (Status: ${act.status}, Poin: ${act.points}, Tenggat: ${act.date})`).join('\n')}
        `).join('\n')}
        `;
        
        try {
            // Fix: Initialize Gemini client here as per guidelines to use the latest API key.
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            const summaryMarkdown = response.text;
            const summaryHtml = await marked(summaryMarkdown);
            setSummaryContent(summaryHtml);
        } catch (error) {
            console.error("Error generating summary:", error);
            setSummaryContent("<p>Maaf, rekap tidak dapat dibuat saat ini. Silakan periksa konsol untuk error.</p>");
        } finally {
            setIsSummaryLoading(false);
        }
    };

    return (
        <>
            {isSplashMounted && <SplashScreen isFadingOut={isFadingOut} />}

            <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans ${isLoading ? 'opacity-0' : 'animate-fade-in'}`}>
                <Header
                    user={user}
                    activeView={activeView}
                    onViewChange={setActiveView}
                    onNewTaskClick={() => setIsNewActivityModalOpen(true)}
                    theme={theme}
                    toggleTheme={toggleTheme}
                />

                <main className="max-w-screen-2xl mx-auto p-4 sm:p-8">
                    {activeView === 'dashboard' && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2 space-y-8">
                                <DashboardChart activities={myActivities} />
                                <ActivityList
                                    activities={myActivities}
                                    onViewDetails={(id) => { setSelectedActivityId(id); setIsActivityDetailModalOpen(true); }}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                 <GamificationDashboard 
                                    user={user}
                                    allAchievements={ALL_ACHIEVEMENTS}
                                    leaderboardData={leaderboardData}
                                />
                            </div>
                        </div>
                    )}
                    {activeView === 'calendar' && (
                        <CalendarView 
                            activities={myActivities}
                            onActivityClick={(id) => { setSelectedActivityId(id); setIsActivityDetailModalOpen(true); }}
                        />
                    )}
                    {activeView === 'team' && (
                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                             <div className="lg:col-span-2">
                                <TeamView teamMembers={teamMembers} onSummarizeClick={handleSummarizeTeam} />
                             </div>
                              <div className="lg:col-span-1">
                                 <GamificationDashboard 
                                    user={user}
                                    allAchievements={ALL_ACHIEVEMENTS}
                                    leaderboardData={leaderboardData}
                                />
                            </div>
                         </div>
                    )}
                </main>

                <NotificationCenter notifications={notifications} removeNotification={removeNotification} />

                <NewActivityModal 
                    isOpen={isNewActivityModalOpen}
                    onClose={() => setIsNewActivityModalOpen(false)}
                    onSubmit={handleAddNewTask}
                />

                <ActivityDetailModal 
                    isOpen={isActivityDetailModalOpen}
                    onClose={() => setIsActivityDetailModalOpen(false)}
                    activity={selectedActivity}
                    onComplete={(id) => { setActivityToCompleteId(id); setIsEvidenceModalOpen(true); setIsActivityDetailModalOpen(false); }}
                    onReopen={handleReopenTask}
                    onDelete={handleDeleteActivity}
                />
                
                {activityToComplete && (
                    <EvidenceModal
                        isOpen={isEvidenceModalOpen}
                        onClose={() => setIsEvidenceModalOpen(false)}
                        onSubmit={handleCompleteTask}
                        taskTitle={activityToComplete.title}
                    />
                )}
                
                <SummaryModal 
                    isOpen={isSummaryModalOpen}
                    onClose={() => setIsSummaryModalOpen(false)}
                    summary={summaryContent}
                    isLoading={isSummaryLoading}
                />

            </div>
        </>
    );
};

export default App;