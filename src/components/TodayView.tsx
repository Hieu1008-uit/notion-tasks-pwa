import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Plus, 
  Play, 
  Pause, 
  RotateCcw, 
  Edit3, 
  Clock, 
  Filter, 
  X, 
  Zap,
  CalendarCheck2,
  Bot,
  Layers,
  Users,
  Mic,
  Sparkles,
  Radio
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, Project, ThemeMode } from '../types';
import { LofiPlayer } from './LofiPlayer';
import { FocusPet } from './FocusPet';

interface TodayViewProps {
  tasks: Task[];
  projects: Project[];
  filterProject: string | null;
  onClearFilter: () => void;
  onToggleCompleteTask: (taskId: string) => void;
  onOpenNewTaskModal: (defaultTimeSlot?: string) => void;
  onSelectActiveTask: (taskId: string, durationMinutes?: number) => void;
  activeTaskId: string | null;
  pomodoroSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: (minutes: number) => void;
  onAdjustSeconds: (deltaSeconds: number) => void;
  onSetCustomMinutes: (minutes: number) => void;
  theme: ThemeMode;
  onOpenAIModal?: () => void;
  onOpenTemplatesModal?: () => void;
  onOpenVoiceModal?: () => void;
  onOpenStudyRoomModal?: () => void;
  onOpenWrappedModal?: () => void;
}

// Full-day coverage from 07:00 to 23:00 for the general timeline
const HOURS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00', '23:00'
];

export const TodayView: React.FC<TodayViewProps> = ({
  tasks,
  projects,
  filterProject,
  onClearFilter,
  onToggleCompleteTask,
  onOpenNewTaskModal,
  onSelectActiveTask,
  activeTaskId,
  pomodoroSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onAdjustSeconds,
  onSetCustomMinutes,
  theme,
  onOpenAIModal,
  onOpenTemplatesModal,
  onOpenVoiceModal,
  onOpenStudyRoomModal,
  onOpenWrappedModal,
}) => {
  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [customInputVal, setCustomInputVal] = useState(Math.floor(pomodoroSeconds / 60).toString());
  const [currentTime, setCurrentTime] = useState(new Date());

  const isDark = theme === 'dark';

  // Real-time ticker to detect active & upcoming tasks in real time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Check every 10 seconds
    return () => clearInterval(timer);
  }, []);

  // Filter tasks if filterProject is active
  const displayedTasks = filterProject 
    ? tasks.filter(t => t.project === filterProject)
    : tasks;

  const activeTask = tasks.find(t => t.id === activeTaskId);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCheckin = (taskId: string, e: React.MouseEvent, color?: string) => {
    e.stopPropagation();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: [color || '#2563eb', '#34d399', '#f43f5e', '#fbbf24']
    });
    onToggleCompleteTask(taskId);
  };

  const calculateTaskDuration = (start: string, end: string) => {
    try {
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);
      const diff = (endH * 60 + endM) - (startH * 60 + startM);
      return diff > 0 ? diff : 25;
    } catch {
      return 25;
    }
  };

  const getTasksForHour = (hourStr: string) => {
    return displayedTasks.filter(t => t.startTime.startsWith(hourStr.slice(0, 2)));
  };

  const getProjectDetails = (projectName?: string): Project => {
    return projects.find(p => p.name === projectName) || projects[0] || {
      id: 'p-default',
      name: projectName || 'General',
      color: '#059669',
      pastelBg: '#a7f3d0',
      textColor: '#065f46',
      darkBg: '#064e3b',
      darkTextColor: '#6ee7b7',
      streak: 0,
      history: {}
    };
  };

  const handleSaveCustomMinutes = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(customInputVal, 10);
    if (!isNaN(val) && val > 0 && val <= 360) {
      onSetCustomMinutes(val);
    }
    setIsEditingMinutes(false);
  };

  const parseTimeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const getTaskRealTimeStatus = (task: Task) => {
    if (!task.startTime || !task.endTime) return { isCurrent: false, isUpcoming: false, minutesUntil: 0 };
    
    const startM = parseTimeToMinutes(task.startTime);
    const endM = parseTimeToMinutes(task.endTime);

    const isCurrent = currentMinutes >= startM && currentMinutes < endM && !task.completed;
    const minutesUntil = startM - currentMinutes;
    const isUpcoming = minutesUntil > 0 && minutesUntil <= 45 && !task.completed;

    return { isCurrent, isUpcoming, minutesUntil };
  };

  // Render a single task card (reusable between filtered list and hourly timeline)
  const renderTaskCard = (task: Task) => {
    const proj = getProjectDetails(task.project);
    const isFocused = activeTaskId === task.id;
    const { isCurrent, isUpcoming, minutesUntil } = getTaskRealTimeStatus(task);

    const bg = isDark ? (proj.darkBg || proj.pastelBg) : proj.pastelBg;
    const text = isDark ? (proj.darkTextColor || proj.textColor) : proj.textColor;
    const borderColor = isCurrent ? proj.color : (isDark ? `${proj.color}50` : `${proj.color}40`);

    return (
      <div
        key={task.id}
        style={{
          backgroundColor: bg,
          borderColor: borderColor,
          color: text,
        }}
        className={`p-4.5 rounded-2xl border transition-all duration-300 select-none transform-gpu ${
          'hover:scale-[1.025] hover:shadow-lg cursor-pointer'
        } ${
          isCurrent 
            ? 'scale-[1.035] shadow-xl ring-2 ring-blue-500/80 py-5 my-1.5' 
            : 'shadow-xs'
        } ${
          isUpcoming ? 'ring-2 ring-amber-400/80 shadow-md' : ''
        } ${
          isFocused ? 'ring-2 ring-offset-2 ring-blue-600' : ''
        } ${
          task.completed ? 'opacity-60 brightness-95' : ''
        }`}
        onClick={() => {
          const duration = calculateTaskDuration(task.startTime, task.endTime);
          onSelectActiveTask(task.id, duration);
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Rounded Checkbox */}
            <button
              onClick={(e) => handleCheckin(task.id, e, proj.color)}
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                task.completed 
                  ? 'border-current bg-current/20' 
                  : 'border-current/70 bg-white/40 dark:bg-black/30 hover:border-current'
              }`}
              title={task.completed ? 'Đánh dấu chưa xong' : 'Check-in hoàn thành!'}
            >
              {task.completed && (
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-sm font-bold tracking-tight break-words ${
                  task.completed ? 'line-through opacity-70 decoration-current decoration-2' : ''
                }`}>
                  {task.title}
                </span>

                {/* Real-time "ĐANG DIỄN RA" Badge */}
                {isCurrent && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-xs animate-pulse shrink-0">
                    <Zap className="w-3 h-3 fill-white" />
                    <span>Đang diễn ra</span>
                  </span>
                )}

                {/* Real-time "SẮP DIỄN RA" Alert Badge */}
                {isUpcoming && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs animate-bounce shrink-0">
                    <Clock className="w-3 h-3" />
                    <span>Sắp tới giờ ({minutesUntil}p)</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] font-semibold opacity-85">
                <span className="font-mono flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  {task.startTime} - {task.endTime}
                </span>
                <span className="shrink-0">•</span>
                <span 
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs max-w-[120px] sm:max-w-none truncate"
                  style={{ backgroundColor: proj.color }}
                  title={task.project}
                >
                  {task.project}
                </span>
              </div>
            </div>
          </div>

          {/* Focus Button */}
          {!task.completed && (
            <button
              data-testid="task-focus-btn"
              onClick={(e) => {
                e.stopPropagation();
                const duration = calculateTaskDuration(task.startTime, task.endTime);
                onSelectActiveTask(task.id, duration);
                if (!isTimerRunning) onToggleTimer();
              }}
              style={{ backgroundColor: proj.color }}
              className="text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs hover:opacity-90 hover:scale-105 transition-all shrink-0"
            >
              {isFocused && isTimerRunning ? 'Đang tập trung' : 'Focus'}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-6 pb-24">
      {/* Active Board Filter Banner */}
      {filterProject && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 px-4 sm:px-5 rounded-2xl bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 shadow-xs animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2 min-w-0">
            <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="text-xs text-blue-900 dark:text-blue-200 font-medium truncate">
              Đang lọc theo Board: <strong className="font-bold text-blue-700 dark:text-blue-300">{filterProject}</strong> ({displayedTasks.length} task)
            </span>
          </div>
          <button
            onClick={onClearFilter}
            className="flex items-center gap-1 text-xs font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-800 hover:bg-blue-100/60 dark:hover:bg-slate-700 px-3 py-1 rounded-full border border-blue-300 dark:border-blue-700 transition-colors shadow-2xs shrink-0 self-start sm:self-auto"
          >
            <X className="w-3.5 h-3.5" />
            <span>Xem tất cả task</span>
          </button>
        </div>
      )}

      {/* Live Study Room Widget Banner (Study With Me & Đua Top YPT) */}
      <div 
        onClick={onOpenStudyRoomModal}
        className="cursor-pointer group p-4 rounded-3xl bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-cyan-50/80 dark:from-slate-800/90 dark:via-indigo-950/30 dark:to-slate-800/90 border border-blue-200/70 dark:border-blue-900/40 shadow-xs hover:shadow-md transition-all hover:scale-[1.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        title="Nhấn để mở Phòng học ảo & Bảng xếp hạng UIT"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0 group-hover:rotate-6 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
                👥 28 sinh viên UIT đang tập trung cùng bạn
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                Live
              </span>
            </div>
            {/* Overlapping student avatar bubbles */}
            <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex -space-x-1.5 overflow-hidden py-0.5">
                {['nam_uit', 'linh_uit', 'phuc_uit', 'tram_uit'].map((seed, i) => (
                  <img
                    key={i}
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${seed}`}
                    alt="Friend"
                    className="inline-block w-5 h-5 rounded-full ring-2 ring-white dark:ring-slate-800 bg-slate-200"
                  />
                ))}
              </div>
              <span className="opacity-90">
                Nam (42m) • Linh (25m) • Khoa (58m)...
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenStudyRoomModal?.();
            }}
            className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all group-hover:scale-105 cursor-pointer flex items-center gap-1"
          >
            <span>Vào phòng học ↗</span>
          </button>
        </div>
      </div>

      {/* 1. Soft Minimalist Pomodoro Focus Bubble Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 shadow-md shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-100 dark:border-slate-700/80 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Focus Mascot Pet with Sprout Evolution & Distraction Detection */}
        <div className="shrink-0 flex justify-center">
          <FocusPet
            isTimerRunning={isTimerRunning}
            pomodoroSeconds={pomodoroSeconds}
            initialMinutes={25}
          />
        </div>

        <div className="space-y-1 text-center md:text-left flex-1 min-w-0">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Focus Timer
            </span>
          </div>
          <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-xs truncate mx-auto md:mx-0">
            {activeTask ? activeTask.title : 'Chọn công việc để bắt đầu phiên tập trung'}
          </div>
        </div>

        {/* Big Interactive Timer with Steppers */}
        <div className="flex flex-col items-center">
          {isEditingMinutes ? (
            <form onSubmit={handleSaveCustomMinutes} className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="360"
                autoFocus
                value={customInputVal}
                onChange={(e) => setCustomInputVal(e.target.value)}
                className="w-20 text-center font-mono text-2xl font-black bg-slate-50 dark:bg-slate-900 border border-blue-500 rounded-xl px-2 py-1 text-slate-800 dark:text-slate-100 focus:outline-none"
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">phút</span>
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Lưu
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onAdjustSeconds(-5 * 60)}
                disabled={pomodoroSeconds <= 60}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono text-xs font-bold transition-all disabled:opacity-30"
                title="Giảm 5 phút"
              >
                -5
              </button>

              <div 
                onClick={() => {
                  setCustomInputVal(Math.floor(pomodoroSeconds / 60).toString());
                  setIsEditingMinutes(true);
                }}
                className="text-3xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1 group"
                title="Click để nhập số phút tùy chỉnh"
              >
                <span>{formatTimer(pomodoroSeconds)}</span>
                <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
              </div>

              <button
                onClick={() => onAdjustSeconds(5 * 60)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono text-xs font-bold transition-all"
                title="Tăng 5 phút"
              >
                +5
              </button>
            </div>
          )}

          {/* Quick preset bubble pills */}
          <div className="flex items-center gap-1.5 mt-2">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => onResetTimer(mins)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                  pomodoroSeconds === mins * 60
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {mins}m
              </button>
            ))}
            <button
              onClick={() => onResetTimer(5)}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all ${
                pomodoroSeconds === 5 * 60
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
              }`}
            >
              5m nghỉ
            </button>
          </div>
        </div>

        {/* Start / Pause Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleTimer}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all shadow-md ${
              isTimerRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:scale-102'
            }`}
          >
            {isTimerRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isTimerRunning ? 'Tạm dừng' : 'Bắt đầu Focus'}</span>
          </button>
          {pomodoroSeconds !== 25 * 60 && (
            <button
              onClick={() => onResetTimer(25)}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 transition-colors"
              title="Đặt lại 25m"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lofi Soundscapes Bar for Pomodoro */}
      <LofiPlayer compact className="w-full" />

      {/* 2. Schedule Today */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {filterProject ? `Lịch trình: ${filterProject}` : 'Schedule Today'}
            </h3>
            <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">
              Khung giờ thực tế: <strong className="text-slate-600 dark:text-slate-300 font-mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong> • {displayedTasks.length} task {filterProject ? 'trong board' : 'đã lên lịch'}
            </p>
          </div>
          
          <div className="flex items-center gap-1.5 flex-wrap">
            {onOpenVoiceModal && (
              <button
                onClick={onOpenVoiceModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-all hover:scale-102 shadow-2xs"
                title="Lên lịch siêu tốc bằng giọng nói tiếng Việt"
              >
                <Mic className="w-3.5 h-3.5 text-rose-500" />
                <span>Nói để lên lịch</span>
              </button>
            )}
            {onOpenWrappedModal && (
              <button
                onClick={onOpenWrappedModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 text-xs font-black hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all hover:scale-102 shadow-2xs"
                title="Xem tổng kết năng suất tuần phong cách Story 9:16 Spotify Wrapped"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Flex Story</span>
              </button>
            )}
            {onOpenAIModal && (
              <button
                onClick={onOpenAIModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all hover:scale-102"
                title="Dùng AI phân rã mục tiêu vào lịch trình"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Lên lịch</span>
              </button>
            )}
            {onOpenTemplatesModal && (
              <button
                onClick={onOpenTemplatesModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all hover:scale-102"
                title="Áp dụng mẫu công việc có sẵn"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Kho Mẫu</span>
              </button>
            )}
          </div>
        </div>

        {/* CONDITION: When filtering by a specific Board, ONLY show the tasks of that board! No empty slots! */}
        {filterProject ? (
          displayedTasks.length === 0 ? (
            /* Empty state for filtered Board */
            <div className="p-8 text-center bg-white dark:bg-slate-800/90 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-sm space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                <CalendarCheck2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Chưa có task nào được lên lịch cho hôm nay
                </h4>
                <p className="text-xs text-slate-400 dark:text-slate-400">
                  Board <strong>{filterProject}</strong> hiện chưa có công việc nào trong Schedule Today.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <button
                  onClick={() => onOpenNewTaskModal()}
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full shadow-sm transition-all"
                >
                  + Thêm việc cho board này
                </button>
                <button
                  onClick={onClearFilter}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-800 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-4 py-2 rounded-full transition-all"
                >
                  Xem tất cả task
                </button>
              </div>
            </div>
          ) : (
            /* List of tasks ONLY for this board (no empty slots!) */
            <div className="space-y-3">
              {displayedTasks
                .slice()
                .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                .map((task) => (
                  <div key={task.id} className="flex items-start gap-4">
                    {/* Time indicator */}
                    <div className="w-12 pt-3 font-mono text-xs font-bold text-slate-400 dark:text-slate-500 text-right shrink-0">
                      {task.startTime.slice(0, 5)}
                    </div>
                    {/* Task Card with Board's matching color & real-time expansion */}
                    <div className="flex-1 min-w-0">
                      {renderTaskCard(task)}
                    </div>
                  </div>
                ))}
            </div>
          )
        ) : (
          /* General Timeline with hourly slots (when not filtered) */
          <div className="space-y-3">
            {HOURS.map((hour) => {
              const slotTasks = getTasksForHour(hour);

              return (
                <div key={hour} className="flex items-start gap-4 group">
                  {/* Hour Label */}
                  <span className="w-12 pt-3 font-mono text-xs font-bold text-slate-400 dark:text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors select-none text-right">
                    {hour}
                  </span>

                  {/* Content Block */}
                  <div className="flex-1 min-w-0 min-h-[58px]">
                    {slotTasks.length > 0 ? (
                      <div className="space-y-2.5">
                        {slotTasks.map((task) => renderTaskCard(task))}
                      </div>
                    ) : (
                      /* Empty Slot */
                      <div 
                        onClick={() => onOpenNewTaskModal(hour)}
                        className="h-14 rounded-2xl border-2 border-dashed border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400/80 dark:hover:border-blue-500/80 bg-white/40 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between px-4 text-xs font-medium text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all cursor-pointer group/slot shadow-2xs"
                      >
                        <span className="italic opacity-80">
                          Trống — bấm để lên lịch khung {hour}
                        </span>
                        <Plus className="w-4 h-4 opacity-0 group-hover/slot:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
