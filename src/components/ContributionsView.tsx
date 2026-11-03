import React from 'react';
import { 
  Flame, 
  Droplets, 
  BookOpen, 
  Code, 
  Dumbbell, 
  Coffee, 
  Sparkles, 
  Folder, 
  Clock, 
  CheckCircle2,
  CheckCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Project, Task, ThemeMode } from '../types';

interface ContributionsViewProps {
  projects: Project[];
  tasks: Task[];
  onCheckinProject: (projectId: string) => void;
  maxStreak: number;
  theme: ThemeMode;
  totalFocusSeconds: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ContributionsView: React.FC<ContributionsViewProps> = ({
  projects,
  tasks,
  onCheckinProject,
  maxStreak,
  theme,
  totalFocusSeconds,
}) => {
  const isDark = theme === 'dark';
  const completedTaskCount = tasks.filter(t => t.completed).length;

  // Real Focus Time display
  const focusHours = Math.floor(totalFocusSeconds / 3600);
  const focusMinutes = Math.floor((totalFocusSeconds % 3600) / 60);
  const focusDisplay = focusHours > 0 
    ? `${focusHours}h ${focusMinutes}m` 
    : (focusMinutes > 0 ? `${focusMinutes}m` : (totalFocusSeconds > 0 ? `${totalFocusSeconds}s` : '0m'));

  // Real Success Rate display
  const successRate = tasks.length > 0 ? Math.round((completedTaskCount / tasks.length) * 100) : 0;

  const renderHeatmapGrid = (history: Record<string, number>, baseColor: string) => {
    const today = new Date();
    const weeks: { dateStr: string; level: number }[][] = [];
    
    for (let w = 51; w >= 0; w--) {
      const weekDays: { dateStr: string; level: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - (w * 7 + (6 - d)));
        const dateStr = targetDate.toISOString().split('T')[0];
        const level = history[dateStr] || 0;
        weekDays.push({ dateStr, level });
      }
      weeks.push(weekDays);
    }

    const getColorForLevel = (level: number) => {
      if (level === 0) return isDark ? '#334155' : '#f1f5f9';
      if (level === 1) return `${baseColor}40`;
      if (level === 2) return `${baseColor}75`;
      if (level === 3) return `${baseColor}aa`;
      return baseColor;
    };

    return (
      <div className="overflow-x-auto pb-2">
        <div className="flex text-[10px] text-slate-400 dark:text-slate-500 mb-1.5 pl-6 gap-[38px] font-mono">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>

        <div className="flex gap-1.5 items-center">
          <div className="flex flex-col gap-[3px] text-[9px] text-slate-400 dark:text-slate-500 pr-1 font-mono">
            <span>M</span>
            <span>W</span>
            <span>F</span>
          </div>

          <div className="flex gap-[3px]">
            {weeks.map((week, wIndex) => (
              <div key={wIndex} className="flex flex-col gap-[3px]">
                {week.map((day, dIndex) => (
                  <div
                    key={dIndex}
                    title={`${day.dateStr}: ${day.level} check-ins`}
                    className="w-[11px] h-[11px] rounded-[3px] transition-all hover:scale-125 cursor-pointer"
                    style={{ backgroundColor: getColorForLevel(day.level) }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const getProjectIcon = (icon?: Project['icon']) => {
    switch (icon) {
      case 'droplets': return <Droplets className="w-4 h-4" />;
      case 'book-open': return <BookOpen className="w-4 h-4" />;
      case 'code': return <Code className="w-4 h-4" />;
      case 'dumbbell': return <Dumbbell className="w-4 h-4" />;
      case 'coffee': return <Coffee className="w-4 h-4" />;
      case 'sparkles': return <Sparkles className="w-4 h-4" />;
      default: return <Folder className="w-4 h-4" />;
    }
  };

  const handleCheckin = (projectId: string, e: React.MouseEvent, color: string) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: [color, '#2563eb', '#fbbf24']
    });
    onCheckinProject(projectId);
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 pb-24">
      {/* 4 Key Metrics Row (100% Real-time dynamic based on actual usage) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* 1. Completed Tasks */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Completed</div>
          <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">{completedTaskCount}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>{completedTaskCount > 0 ? `${completedTaskCount} task hoàn thành` : 'Chưa có task hoàn thành'}</span>
          </div>
        </div>

        {/* 2. Streak */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Streak</div>
          <div className="text-2xl font-black text-amber-500 mt-1 font-mono flex items-center gap-1">
            <Flame className="w-5 h-5 fill-amber-500" />
            {maxStreak}d
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
            {maxStreak > 0 ? 'Đồng bộ toàn hệ thống' : 'Bắt đầu chuỗi hôm nay'}
          </div>
        </div>

        {/* 3. Real Focus Time */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Focus Time</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono flex items-center gap-1">
            <Clock className="w-5 h-5" />
            {focusDisplay}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
            {totalFocusSeconds > 0 ? 'Thời gian tập trung thực tế' : 'Chưa có phiên tập trung'}
          </div>
        </div>

        {/* 4. Real Success Rate */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">Success Rate</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{successRate}%</div>
          <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
            {tasks.length > 0 ? `${completedTaskCount}/${tasks.length} task đã xong` : 'Chưa có công việc'}
          </div>
        </div>
      </div>

      {/* Categorized Habit Boards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              Categorised Habit Boards
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
              Tự động tích lũy dữ liệu khi bạn check-in hoặc hoàn thành task ({projects.length} boards)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {projects.map((proj) => {
            const boardTasks = tasks.filter(t => t.project === proj.name);
            const boardCompleted = boardTasks.filter(t => t.completed).length;

            return (
              <div 
                key={proj.id} 
                className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-3 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-xs"
                      style={{ backgroundColor: proj.color }}
                    >
                      {getProjectIcon(proj.icon)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>{proj.name}</span>
                        <span 
                          className="text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold"
                          style={{ 
                            backgroundColor: isDark ? (proj.darkBg || proj.pastelBg) : proj.pastelBg, 
                            color: isDark ? (proj.darkTextColor || proj.textColor) : proj.textColor 
                          }}
                        >
                          🔥 {proj.streak || 0}d streak
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-400 font-medium mt-0.5">
                        {boardCompleted} / {boardTasks.length} task đã hoàn thành
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleCheckin(proj.id, e, proj.color)}
                    className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 transition-all shadow-2xs hover:scale-102"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Check-in today</span>
                  </button>
                </div>

                {/* Heatmap for this Board */}
                {renderHeatmapGrid(proj.history || {}, proj.color)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
