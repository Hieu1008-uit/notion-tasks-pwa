import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TodayView } from './components/TodayView';
import { TodoView } from './components/TodoView';
import { ContributionsView } from './components/ContributionsView';
import { NewTaskModal } from './components/NewTaskModal';
import { AuthModal } from './components/AuthModal';
import { InstallAppModal } from './components/InstallAppModal';
import { ProModal } from './components/ProModal';
import { TemplatesModal } from './components/TemplatesModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import type { TabType, Task, Project, ThemeMode, User, UserData } from './types';
import { INITIAL_TASKS, INITIAL_PROJECTS } from './data/mockData';
import { ApiClient } from './services/api';
import confetti from 'canvas-confetti';

export function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('todo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultSlot, setModalDefaultSlot] = useState<string | undefined>(undefined);
  const [filterProject, setFilterProject] = useState<string | null>(null);

  // User Auth & Cloud Sync State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pastel_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isAIAssistantModalOpen, setIsAIAssistantModalOpen] = useState(false);

  // Pro status state
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('pastel_is_pro') === 'true';
  });

  // Theme Mode (Light / Dark)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (theme === 'dark') {
      root.classList.add('dark');
      if (meta) meta.setAttribute('content', 'dark');
    } else {
      root.classList.remove('dark');
      if (meta) meta.setAttribute('content', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Active project ID in Tasks view
  const [activeProjectId, setActiveProjectId] = useState<string>('p-1');

  // Pomodoro Focus state
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Real Focus Time accumulated in seconds
  const [totalFocusSeconds, setTotalFocusSeconds] = useState<number>(() => {
    const saved = localStorage.getItem('pastel_focus_seconds_v3');
    return saved ? Number(saved) : 0;
  });

  // Persistent Projects (Clean slate initialization)
  const [projects, setProjects] = useState<Project[]>(() => {
    if (!localStorage.getItem('pastel_v3_clean_init')) {
      localStorage.removeItem('pastel_projects');
      localStorage.removeItem('pastel_tasks');
      localStorage.removeItem('pastel_habits');
      localStorage.removeItem('pastel_projects_v2');
      localStorage.removeItem('pastel_tasks_v2');
      localStorage.setItem('pastel_v3_clean_init', 'true');
      return INITIAL_PROJECTS;
    }
    const saved = localStorage.getItem('pastel_projects_v3');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // Persistent Tasks (Clean slate: starts with 0 tasks)
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (!localStorage.getItem('pastel_v3_clean_init')) {
      return INITIAL_TASKS;
    }
    const saved = localStorage.getItem('pastel_tasks_v3');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Sync state to LocalStorage and user's cloud cache
  useEffect(() => {
    localStorage.setItem('pastel_projects_v3', JSON.stringify(projects));
    localStorage.setItem('pastel_tasks_v3', JSON.stringify(tasks));
    localStorage.setItem('pastel_focus_seconds_v3', totalFocusSeconds.toString());

    // If user is logged in, sync their account cloud backup
    if (currentUser) {
      const userData: UserData = {
        tasks,
        projects,
        totalFocusSeconds,
        lastSyncedAt: new Date().toISOString(),
      };
      localStorage.setItem(`pastel_user_data_${currentUser.id}`, JSON.stringify(userData));
      ApiClient.syncUserData(userData);
    }
  }, [projects, tasks, totalFocusSeconds, currentUser]);

  // Initial cloud fetch on mount if logged in
  useEffect(() => {
    if (currentUser && ApiClient.getToken()) {
      ApiClient.fetchUserData().then(remoteData => {
        if (remoteData) {
          if (remoteData.projects && remoteData.projects.length > 0) setProjects(remoteData.projects);
          if (remoteData.tasks) setTasks(remoteData.tasks);
        }
      });
    }
  }, []);

  // Pomodoro timer loop: counts down pomodoro and accumulates real focus seconds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds(prev => prev - 1);
        setTotalFocusSeconds(prev => prev + 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#34d399', '#f43f5e']
      });
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, pomodoroSeconds]);

  // User Login Handler (restores their cloud synced tasks/projects)
  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('pastel_current_user', JSON.stringify(user));

    // Try fetching from backend first
    const remoteData = await ApiClient.fetchUserData();
    if (remoteData) {
      if (remoteData.projects && remoteData.projects.length > 0) setProjects(remoteData.projects);
      if (remoteData.tasks) setTasks(remoteData.tasks);
      return;
    }

    // Check if user has previously saved local data
    const savedUserData = localStorage.getItem(`pastel_user_data_${user.id}`);
    if (savedUserData) {
      try {
        const parsed: UserData = JSON.parse(savedUserData);
        if (parsed.projects && parsed.projects.length > 0) setProjects(parsed.projects);
        if (parsed.tasks) setTasks(parsed.tasks);
        if (typeof parsed.totalFocusSeconds === 'number') setTotalFocusSeconds(parsed.totalFocusSeconds);
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    }
  };

  // User Logout Handler
  const handleLogout = () => {
    ApiClient.clearToken();
    setCurrentUser(null);
    localStorage.removeItem('pastel_current_user');
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = (minutes: number) => {
    setIsTimerRunning(false);
    setPomodoroSeconds(minutes * 60);
  };

  const handleAdjustSeconds = (deltaSeconds: number) => {
    setPomodoroSeconds(prev => Math.max(60, prev + deltaSeconds));
  };

  const handleSetCustomMinutes = (minutes: number) => {
    setIsTimerRunning(false);
    setPomodoroSeconds(minutes * 60);
  };

  const handleSelectActiveTask = (taskId: string, durationMinutes?: number) => {
    setActiveTaskId(taskId);
    if (durationMinutes && durationMinutes > 0) {
      setIsTimerRunning(false);
      setPomodoroSeconds(durationMinutes * 60);
    }
  };

  const handleToggleCompleteTask = (taskId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    let targetTaskProject: string | undefined;
    let willBeCompleted = false;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        willBeCompleted = !t.completed;
        targetTaskProject = t.project;
        return {
          ...t,
          completed: willBeCompleted,
          completedAt: willBeCompleted ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));

    if (targetTaskProject && willBeCompleted) {
      setProjects(prevProjects => prevProjects.map(p => {
        if (p.name === targetTaskProject) {
          const prevHistory = p.history || {};
          const currentDayCount = prevHistory[todayStr] || 0;
          return {
            ...p,
            streak: currentDayCount === 0 ? (p.streak || 0) + 1 : (p.streak || 1),
            history: {
              ...prevHistory,
              [todayStr]: Math.min(4, currentDayCount + 1),
            }
          };
        }
        return p;
      }));
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleSaveNewTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      completed: false,
    };
    setTasks(prev => [newTask, ...prev]);
  };

  // Add new Board (starts clean with 0 streak and {} history)
  const handleAddProject = (name: string, color: string, pastelBg: string, textColor: string) => {
    const newProj: Project = {
      id: `p-${Date.now()}`,
      name,
      color,
      pastelBg,
      textColor,
      streak: 0,
      history: {},
      icon: 'folder'
    };
    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProj.id);
  };

  // Update existing Board
  const handleUpdateProject = (updatedProject: Project) => {
    const oldProject = projects.find(p => p.id === updatedProject.id);

    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));

    if (oldProject && oldProject.name !== updatedProject.name) {
      setTasks(prev => prev.map(t => {
        if (t.project === oldProject.name) {
          return { ...t, project: updatedProject.name, tagColor: updatedProject.color };
        }
        return t;
      }));
      if (filterProject === oldProject.name) {
        setFilterProject(updatedProject.name);
      }
    }
  };

  // Delete Board
  const handleDeleteProject = (projectId: string) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    if (!projectToDelete) return;

    const remaining = projects.filter(p => p.id !== projectId);
    setProjects(remaining);

    setTasks(prev => prev.filter(t => t.project !== projectToDelete.name));

    if (activeProjectId === projectId && remaining.length > 0) {
      setActiveProjectId(remaining[0].id);
    }
    if (filterProject === projectToDelete.name) {
      setFilterProject(null);
    }
  };

  const handleNavigateToSchedule = (projectName: string) => {
    setFilterProject(projectName);
    setCurrentTab('today');
  };

  const handleCheckinProject = (projectId: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const prevHistory = p.history || {};
        const currentCount = prevHistory[todayStr] || 0;
        return {
          ...p,
          streak: currentCount === 0 ? (p.streak || 0) + 1 : (p.streak || 1),
          history: {
            ...prevHistory,
            [todayStr]: Math.min(4, currentCount + 1),
          }
        };
      }
      return p;
    }));
  };

  const handleOpenModal = (defaultTimeSlot?: string) => {
    setModalDefaultSlot(defaultTimeSlot);
    setIsModalOpen(true);
  };

  // Reset entire app to pristine clean slate (0 data)
  const handleResetAllData = () => {
    if (window.confirm('Bạn có muốn đặt lại toàn bộ dữ liệu về trạng thái ban đầu (0 task, 0 streak, 0h tập trung)?')) {
      setProjects(INITIAL_PROJECTS);
      setTasks([]);
      setTotalFocusSeconds(0);
      setActiveTaskId(null);
      setPomodoroSeconds(25 * 60);
      setIsTimerRunning(false);
      setFilterProject(null);
      localStorage.setItem('pastel_projects_v3', JSON.stringify(INITIAL_PROJECTS));
      localStorage.setItem('pastel_tasks_v3', JSON.stringify([]));
      localStorage.setItem('pastel_focus_seconds_v3', '0');
    }
  };

  // Upgrade to Pro handler (VietQR MBBank payment confirmation)
  const handleProUpgradeSuccess = (plan: 'monthly' | 'lifetime') => {
    setIsPro(true);
    localStorage.setItem('pastel_is_pro', 'true');
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        isPro: true,
        proPlan: plan,
        proSince: new Date().toISOString()
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('pastel_current_user', JSON.stringify(updatedUser));
    }
  };

  // Apply Pre-made Template handler
  const handleApplyTemplate = (newBoard: Project, newTasks: Task[]) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== newBoard.id);
      return [...filtered, newBoard];
    });
    setTasks(prev => [...newTasks, ...prev]);
    setActiveProjectId(newBoard.id);
    setCurrentTab('todo');
  };

  // Apply AI Assistant Schedule Plan
  const handleApplyAIPlan = (newBoard: Project, newTasks: Task[]) => {
    setProjects(prev => {
      const exists = prev.some(p => p.name.toLowerCase() === newBoard.name.toLowerCase());
      if (exists) return prev;
      return [...prev, newBoard];
    });
    setTasks(prev => [...newTasks, ...prev]);
    setActiveProjectId(newBoard.id);
    setFilterProject(newBoard.name);
    setCurrentTab('today');
  };

  const completedCount = tasks.filter(t => t.completed).length;

  const maxStreak = projects.length > 0
    ? Math.max(0, ...projects.map(p => p.streak || 0))
    : 0;

  const userIsPro = isPro || Boolean(currentUser?.isPro);

  return (
    <div className="min-h-screen bg-[#f1f4f9] dark:bg-[#0f172a] text-[#1e293b] dark:text-[#f8fafc] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-700 transition-colors duration-250">
      {/* Soft Rounded Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'today') setFilterProject(null);
          setCurrentTab(tab);
        }}
        onOpenNewTaskModal={() => handleOpenModal()}
        completedCount={completedCount}
        totalCount={tasks.length}
        streak={maxStreak}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onResetAllData={handleResetAllData}
        user={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenProModal={() => setIsProModalOpen(true)}
        onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        onOpenAIModal={() => setIsAIAssistantModalOpen(true)}
        isPro={userIsPro}
      />

      {/* Main Responsive Canvas */}
      <main className="max-w-5xl w-full mx-auto px-6 flex-1 pb-28 md:pb-8">
        {currentTab === 'today' && (
          <TodayView
            tasks={tasks}
            projects={projects}
            filterProject={filterProject}
            onClearFilter={() => setFilterProject(null)}
            onToggleCompleteTask={handleToggleCompleteTask}
            onOpenNewTaskModal={handleOpenModal}
            onSelectActiveTask={handleSelectActiveTask}
            activeTaskId={activeTaskId}
            pomodoroSeconds={pomodoroSeconds}
            isTimerRunning={isTimerRunning}
            onToggleTimer={handleToggleTimer}
            onResetTimer={handleResetTimer}
            onAdjustSeconds={handleAdjustSeconds}
            onSetCustomMinutes={handleSetCustomMinutes}
            theme={theme}
            onOpenAIModal={() => setIsAIAssistantModalOpen(true)}
            onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
          />
        )}

        {currentTab === 'todo' && (
          <TodoView
            tasks={tasks}
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={setActiveProjectId}
            onToggleCompleteTask={handleToggleCompleteTask}
            onDeleteTask={handleDeleteTask}
            onOpenNewTaskModal={() => handleOpenModal()}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onNavigateToSchedule={handleNavigateToSchedule}
            theme={theme}
            onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
            onOpenAIModal={() => setIsAIAssistantModalOpen(true)}
          />
        )}

        {currentTab === 'contributions' && (
          <ContributionsView
            projects={projects}
            tasks={tasks}
            onCheckinProject={handleCheckinProject}
            maxStreak={maxStreak}
            theme={theme}
            totalFocusSeconds={totalFocusSeconds}
          />
        )}
      </main>

      {/* Modals */}
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveTask={handleSaveNewTask}
        defaultTimeSlot={modalDefaultSlot}
        projects={projects}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      <ProModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={handleProUpgradeSuccess}
        user={currentUser}
        isAlreadyPro={userIsPro}
      />

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />

      <AIAssistantModal
        isOpen={isAIAssistantModalOpen}
        onClose={() => setIsAIAssistantModalOpen(false)}
        onApplyPlan={handleApplyAIPlan}
        existingProjects={projects}
      />
    </div>
  );
}

export default App;
