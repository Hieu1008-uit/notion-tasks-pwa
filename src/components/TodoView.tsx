import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  FolderPlus,
  Pencil,
  CalendarDays,
  Layers,
  Bot,
  Mic,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, Project, ThemeMode } from '../types';
import { EditBoardModal } from './EditBoardModal';
import { PASTEL_COLOR_PRESETS } from '../types';

interface TodoViewProps {
  tasks: Task[];
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onToggleCompleteTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTaskModal: () => void;
  onAddProject: (name: string, color: string, pastelBg: string, textColor: string) => void;
  onUpdateProject: (updatedProject: Project) => void;
  onDeleteProject: (projectId: string) => void;
  onNavigateToSchedule: (projectName: string) => void;
  theme: ThemeMode;
  onOpenTemplatesModal?: () => void;
  onOpenAIModal?: () => void;
  onOpenVoiceModal?: () => void;
  isPro?: boolean;
  onOpenProModal?: () => void;
}

export const TodoView: React.FC<TodoViewProps> = ({
  tasks,
  projects,
  activeProjectId,
  onSelectProject,
  onToggleCompleteTask,
  onDeleteTask,
  onOpenNewTaskModal,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  onNavigateToSchedule,
  theme,
  onOpenTemplatesModal,
  onOpenAIModal,
  onOpenVoiceModal,
  isPro = false,
  onOpenProModal,
}) => {
  const [showAddBoardInput, setShowAddBoardInput] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const FREE_BOARD_LIMIT = 5;
  const isAtLimit = !isPro && projects.length >= FREE_BOARD_LIMIT;

  const isDark = theme === 'dark';

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0] || {
    id: 'p-default',
    name: 'General',
    color: '#059669',
    pastelBg: '#a7f3d0',
    textColor: '#065f46',
    darkBg: '#064e3b',
    darkTextColor: '#6ee7b7',
    streak: 0,
    history: {}
  };

  const projectTasks = tasks.filter(t => t.project === activeProject.name);
  const completedCount = projectTasks.filter(t => t.completed).length;

  const handleCheckTask = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: [activeProject.color, '#60a5fa', '#34d399', '#fbbf24']
    });
    onToggleCompleteTask(taskId);
  };

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim()) return;
    if (isAtLimit) {
      onOpenProModal?.();
      setShowAddBoardInput(false);
      return;
    }
    const preset = PASTEL_COLOR_PRESETS[projects.length % PASTEL_COLOR_PRESETS.length];
    onAddProject(newBoardName.trim(), preset.color, preset.pastelBg, preset.textColor);
    setNewBoardName('');
    setShowAddBoardInput(false);
  };

  const handleBoardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) return;
    onNavigateToSchedule(activeProject.name);
  };

  return (
    <div className="max-w-xl mx-auto w-full pb-24 pt-2">
      {/* Stacked Pastel Folder Tabs Header (Exact style from user's image!) */}
      <div className="relative pt-4">
        {/* Inactive Folder Tabs Peeking from the Top */}
        <div className="flex flex-col -space-y-6 px-3">
          {projects
            .filter(p => p.id !== activeProject.id)
            .map((proj, idx) => {
              const bg = isDark ? (proj.darkBg || proj.pastelBg) : proj.pastelBg;
              const text = isDark ? (proj.darkTextColor || proj.textColor) : proj.textColor;

              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj.id)}
                  style={{ 
                    backgroundColor: bg, 
                    color: text,
                    zIndex: idx + 1,
                  }}
                  className="rounded-t-3xl px-6 pt-3.5 pb-9 cursor-pointer hover:brightness-95 hover:-translate-y-0.5 transition-all shadow-xs border-t border-x border-white/50 dark:border-white/10 flex items-center justify-between select-none"
                  title={`Mở board ${proj.name}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tight">
                      {proj.name}
                    </span>
                  </div>
                  <span className="text-xs font-semibold opacity-70">
                    {tasks.filter(t => t.project === proj.name && t.completed).length} of {tasks.filter(t => t.project === proj.name).length} Tasks
                  </span>
                </div>
              );
            })}
        </div>

        {/* Active Foreground Folder Card */}
        <div 
          onClick={handleBoardClick}
          style={{ 
            backgroundColor: isDark ? (activeProject.darkBg || activeProject.pastelBg) : activeProject.pastelBg, 
            color: isDark ? (activeProject.darkTextColor || activeProject.textColor) : activeProject.textColor,
            zIndex: 20
          }}
          className="relative rounded-3xl p-7 shadow-xl shadow-slate-300/40 dark:shadow-slate-950/60 border border-white/70 dark:border-white/10 transition-all duration-300 -mt-2 cursor-pointer group"
          title="Nhấn vào board để mở Schedule Today chỉ gồm các task của board này"
        >
          {/* Card Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">
                  {activeProject.name}
                </h2>
                {/* Edit Board Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                  className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-current transition-colors opacity-75 hover:opacity-100"
                  title="Chỉnh sửa màu sắc & tên board"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-1 text-xs font-bold opacity-80">
                <span>{completedCount} of {projectTasks.length} Tasks</span>
                <span>•</span>
                <span className="flex items-center gap-1 opacity-90 group-hover:underline">
                  <CalendarDays className="w-3.5 h-3.5" />
                  <span>Bấm vào thẻ để xem Schedule Today ↗</span>
                </span>
              </div>
            </div>

            {/* Quick add in active folder */}
            <div className="flex items-center gap-2">
              {onOpenVoiceModal && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenVoiceModal();
                  }}
                  className="text-white text-xs font-bold px-3 py-2 rounded-full shadow-sm hover:opacity-90 hover:scale-102 transition-all flex items-center gap-1 bg-black/20 hover:bg-black/30 backdrop-blur-xs"
                  title="Lên lịch nhanh bằng giọng nói tiếng Việt"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Nói để thêm</span>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenNewTaskModal();
                }}
                style={{ backgroundColor: activeProject.color }}
                className="text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-sm hover:opacity-90 hover:scale-102 transition-all flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm việc</span>
              </button>
            </div>
          </div>

          {/* Task Items List */}
          <div className="space-y-3.5">
            {projectTasks.length === 0 ? (
              <div className="py-8 text-center text-xs opacity-75 italic bg-white/20 dark:bg-black/20 rounded-2xl border border-white/30 dark:border-white/10">
                Thư mục này chưa có công việc. Bấm "Thêm việc" để tạo mới!
              </div>
            ) : (
              projectTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={(e) => handleCheckTask(task.id, e)}
                  className="flex items-center justify-between group/item cursor-pointer select-none py-1.5 px-2 rounded-xl hover:bg-white/30 dark:hover:bg-black/20 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Soft Rounded Checkbox */}
                    <div 
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'border-current bg-current/15' 
                          : 'border-current/60 bg-transparent group-hover/item:border-current'
                      }`}
                    >
                      {task.completed && (
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      )}
                    </div>

                    {/* Task Title with colored strikethrough */}
                    <div className="flex flex-col">
                      <span 
                        className={`text-sm font-semibold tracking-tight transition-all ${
                          task.completed 
                            ? 'line-through opacity-70 decoration-current decoration-2' 
                            : 'opacity-90'
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.startTime && (
                        <span className="text-[11px] font-mono opacity-65 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {task.startTime} - {task.endTime}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="opacity-0 group-hover/item:opacity-60 hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10"
                    title="Xóa task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Switcher Dots and Add Board */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectProject(p.id)}
            style={{ 
              backgroundColor: p.id === activeProject.id ? p.color : (isDark ? '#475569' : '#cbd5e1'),
              width: p.id === activeProject.id ? '24px' : '8px',
            }}
            className="h-2 rounded-full transition-all duration-300"
            title={p.name}
          />
        ))}

        {showAddBoardInput ? (
          <form onSubmit={handleCreateBoard} className="ml-2">
            <input
              type="text"
              autoFocus
              placeholder="Tên Board mới..."
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              onBlur={() => setShowAddBoardInput(false)}
              className="text-xs px-3 py-1 rounded-full border border-blue-500 bg-white dark:bg-slate-800 dark:text-slate-100 focus:outline-none shadow-xs font-medium"
            />
          </form>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 ml-2">
            <button
              onClick={() => {
                if (isAtLimit) {
                  onOpenProModal?.();
                } else {
                  setShowAddBoardInput(true);
                }
              }}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-bold px-2.5 py-1 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-2xs"
              title={isAtLimit ? 'Đã đạt giới hạn 5 Boards của bản Free. Bấm để nâng cấp PRO' : 'Thêm thư mục/bảng mới'}
            >
              {isAtLimit ? <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> : <FolderPlus className="w-3.5 h-3.5" />}
              <span>{isAtLimit ? 'Thêm board (Nâng Pro)' : 'Thêm board'}</span>
              {!isPro && (
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {projects.length}/5
                </span>
              )}
            </button>

            {onOpenVoiceModal && (
              <button
                onClick={onOpenVoiceModal}
                className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 flex items-center gap-1 font-bold px-2.5 py-1 rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/40 shadow-2xs"
                title="Lên lịch nhanh bằng giọng nói tiếng Việt"
              >
                <Mic className="w-3.5 h-3.5 text-rose-500" />
                <span>Nói để lên lịch</span>
              </button>
            )}

            {onOpenTemplatesModal && (
              <button
                onClick={onOpenTemplatesModal}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 font-bold px-2.5 py-1 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-all bg-white/40 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 shadow-2xs"
                title="Chọn từ thư viện mẫu công việc có sẵn"
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                <span>Kho Mẫu</span>
              </button>
            )}

            {onOpenAIModal && (
              <button
                onClick={onOpenAIModal}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 font-bold px-2.5 py-1 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-all bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/50 dark:border-indigo-800/40 shadow-2xs"
                title="Dùng AI phân rã mục tiêu và tạo Board mới"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Tạo Board</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit Board Modal */}
      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={activeProject}
        onSave={onUpdateProject}
        onDelete={onDeleteProject}
        totalProjects={projects.length}
      />
    </div>
  );
};
