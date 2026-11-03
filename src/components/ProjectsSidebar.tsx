import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Plus, 
  Clock,
  Minus,
  Edit2,
  Check
} from 'lucide-react';
import type { Project, Task } from '../types';

interface ProjectsSidebarProps {
  projects: Project[];
  tasks: Task[];
  selectedProject: string | 'all';
  onSelectProject: (projectId: string | 'all') => void;
  onAddProject: (name: string, color: string) => void;
  pomodoroSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTimer: (minutes: number) => void;
  onAdjustSeconds: (deltaSeconds: number) => void;
  onSetCustomMinutes: (minutes: number) => void;
  activeTaskTitle?: string;
}

export const ProjectsSidebar: React.FC<ProjectsSidebarProps> = ({
  projects,
  tasks,
  selectedProject,
  onSelectProject,
  onAddProject,
  pomodoroSeconds,
  isTimerRunning,
  onToggleTimer,
  onResetTimer,
  onAdjustSeconds,
  onSetCustomMinutes,
  activeTaskTitle,
}) => {
  const [showAddProjectInput, setShowAddProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Editable minutes state
  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [customInputVal, setCustomInputVal] = useState(Math.floor(pomodoroSeconds / 60).toString());

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    const colors = ['#a74127', '#06b6d4', '#7c3aed', '#588157', '#d97706'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    onAddProject(newProjectName.trim(), randomColor);
    setNewProjectName('');
    setShowAddProjectInput(false);
  };

  const handleSaveCustomMinutes = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = parseInt(customInputVal, 10);
    if (!isNaN(val) && val > 0 && val <= 360) {
      onSetCustomMinutes(val);
    }
    setIsEditingMinutes(false);
  };

  return (
    <div className="w-72 shrink-0 space-y-6">
      {/* 1. Projects Section (BeaverPlans Style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-[#8c8479] font-semibold tracking-wider uppercase px-1">
          <span>PROJECTS</span>
          <span 
            onClick={() => onSelectProject('all')}
            className="text-[11px] font-normal normal-case text-[#a74127] cursor-pointer hover:underline"
          >
            Tất cả ({tasks.length})
          </span>
        </div>

        {/* Project List */}
        <div className="space-y-1">
          <button
            onClick={() => onSelectProject('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
              selectedProject === 'all'
                ? 'bg-[#efe0d9] text-[#a74127] font-semibold'
                : 'text-[#6e675d] hover:bg-[#eae5dc] hover:text-[#36312a]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#a74127]" />
              <span>Tất cả công việc</span>
            </div>
            <span className="text-[11px] opacity-75">{tasks.length}</span>
          </button>

          {projects.map((proj) => {
            const count = tasks.filter(t => t.project === proj.name).length;
            const isSelected = selectedProject === proj.name;

            return (
              <button
                key={proj.id}
                onClick={() => onSelectProject(proj.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#efe0d9] text-[#a74127] font-semibold'
                    : 'text-[#6e675d] hover:bg-[#eae5dc] hover:text-[#36312a]'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span 
                    className="w-2 h-2 rounded-full shrink-0" 
                    style={{ backgroundColor: proj.color }} 
                  />
                  <span className="truncate">{proj.name}</span>
                </div>
                <span className="text-[11px] opacity-75">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Add Project Button (Dashed like BeaverPlans) */}
        {showAddProjectInput ? (
          <form onSubmit={handleCreateProject} className="pt-1">
            <input
              type="text"
              autoFocus
              placeholder="Tên project mới (Enter để lưu)..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onBlur={() => setShowAddProjectInput(false)}
              className="w-full bg-[#faf8f4] border border-[#a74127] rounded-md px-3 py-2 text-xs text-[#36312a] focus:outline-none"
            />
          </form>
        ) : (
          <button
            onClick={() => setShowAddProjectInput(true)}
            className="w-full py-2 px-3 border border-dashed border-[#ccc5b9] hover:border-[#a74127] text-[#8c8479] hover:text-[#a74127] text-xs font-semibold rounded-md transition-all text-center tracking-wider uppercase flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ ADD PROJECT</span>
          </button>
        )}
      </div>

      {/* 2. Customizable Pomodoro Focus Card (Warm Paper Aesthetic) */}
      <div className="bg-[#faf8f4] border border-[#ded7cc] rounded-lg p-4 shadow-xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#a74127]">
            <Clock className="w-3.5 h-3.5" />
            <span>Thời gian Focus</span>
          </div>
          <button
            onClick={() => {
              setCustomInputVal(Math.max(1, Math.floor(pomodoroSeconds / 60)).toString());
              setIsEditingMinutes(!isEditingMinutes);
            }}
            className="text-[11px] text-[#8c8479] hover:text-[#a74127] flex items-center gap-1 bg-[#efe0d9]/60 px-2 py-0.5 rounded transition-colors"
            title="Tự nhập số phút tùy chỉnh"
          >
            <Edit2 className="w-3 h-3" />
            <span>Tùy chỉnh</span>
          </button>
        </div>

        {/* Big Warm Time Display with +/- Quick Adjust Steppers */}
        <div className="bg-[#f4f1ea] rounded-md border border-[#e5dfd5] p-3">
          {isEditingMinutes ? (
            /* Direct Minute Input Mode */
            <form onSubmit={handleSaveCustomMinutes} className="flex flex-col items-center gap-2 py-1">
              <span className="text-[11px] text-[#7c756b] font-medium">Nhập số phút mong muốn:</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="360"
                  autoFocus
                  value={customInputVal}
                  onChange={(e) => setCustomInputVal(e.target.value)}
                  className="w-20 text-center font-mono text-2xl font-bold bg-[#ffffff] border border-[#a74127] rounded-md px-2 py-1 text-[#36312a] focus:outline-none"
                />
                <span className="text-xs font-semibold text-[#6e675d]">phút</span>
                <button
                  type="submit"
                  className="p-2 rounded bg-[#a74127] text-white hover:bg-[#8f3620] transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Interactive Clock with Steppers */
            <div>
              <div className="flex items-center justify-between px-2">
                {/* -5m button */}
                <button
                  onClick={() => onAdjustSeconds(-5 * 60)}
                  disabled={pomodoroSeconds <= 60}
                  className="p-1 rounded text-[#8c8479] hover:text-[#a74127] hover:bg-[#eae5dc] disabled:opacity-30 transition-all font-mono text-[11px] font-bold"
                  title="Giảm 5 phút"
                >
                  -5m
                </button>

                {/* Clickable Time Digits */}
                <div 
                  onClick={() => {
                    setCustomInputVal(Math.max(1, Math.floor(pomodoroSeconds / 60)).toString());
                    setIsEditingMinutes(true);
                  }}
                  className="text-3xl font-extrabold font-mono text-[#36312a] tracking-wider cursor-pointer hover:text-[#a74127] transition-colors"
                  title="Bấm vào để nhập số phút bất kỳ"
                >
                  {formatTimer(pomodoroSeconds)}
                </div>

                {/* +5m button */}
                <button
                  onClick={() => onAdjustSeconds(5 * 60)}
                  className="p-1 rounded text-[#8c8479] hover:text-[#a74127] hover:bg-[#eae5dc] transition-all font-mono text-[11px] font-bold"
                  title="Thêm 5 phút"
                >
                  +5m
                </button>
              </div>

              {/* Sub-label */}
              <div className="text-[11px] text-[#8c8479] text-center mt-1 truncate">
                {activeTaskTitle ? `Đang làm: ${activeTaskTitle}` : 'Bấm số để đổi phút hoặc dùng +/-'}
              </div>
            </div>
          )}
        </div>

        {/* Quick Duration Preset Pills */}
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase font-semibold text-[#8c8479] px-0.5 tracking-wider">
            Chọn mốc thời gian nhanh:
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[15, 25, 45, 60].map((mins) => (
              <button 
                key={mins}
                onClick={() => onResetTimer(mins)} 
                className={`text-xs py-1 rounded transition-all font-medium ${
                  Math.floor(pomodoroSeconds / 60) === mins && !isTimerRunning
                    ? 'bg-[#efe0d9] text-[#a74127] font-bold shadow-2xs border border-[#e5d4cb]' 
                    : 'text-[#6e675d] bg-[#f4f1ea] hover:bg-[#eae5dc] border border-[#e5dfd5]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1 pt-0.5">
            <button 
              onClick={() => onResetTimer(90)} 
              className={`text-xs py-1 rounded transition-all font-medium ${
                Math.floor(pomodoroSeconds / 60) === 90 && !isTimerRunning
                  ? 'bg-[#efe0d9] text-[#a74127] font-bold border border-[#e5d4cb]' 
                  : 'text-[#6e675d] bg-[#f4f1ea] hover:bg-[#eae5dc] border border-[#e5dfd5]'
              }`}
            >
              90m (Deep Work)
            </button>
            <button 
              onClick={() => onResetTimer(5)} 
              className={`text-xs py-1 rounded transition-all font-medium ${
                Math.floor(pomodoroSeconds / 60) === 5 && !isTimerRunning
                  ? 'bg-[#efe0d9] text-[#a74127] font-bold border border-[#e5d4cb]' 
                  : 'text-[#6e675d] bg-[#f4f1ea] hover:bg-[#eae5dc] border border-[#e5dfd5]'
              }`}
            >
              5m nghỉ giải lao
            </button>
          </div>
        </div>

        {/* Fine-tune Steppers (-1m / +1m) */}
        <div className="flex items-center justify-between text-xs text-[#7c756b] px-1 pt-0.5">
          <span className="text-[11px] text-[#8c8479]">Tinh chỉnh từng phút:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onAdjustSeconds(-60)}
              disabled={pomodoroSeconds <= 60}
              className="p-1 rounded bg-[#f4f1ea] border border-[#ded7cc] hover:bg-[#eae5dc] text-[#56514a] disabled:opacity-30 transition-colors"
              title="Giảm 1 phút"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono font-semibold text-[#36312a]">
              {Math.floor(pomodoroSeconds / 60)} phút
            </span>
            <button
              onClick={() => onAdjustSeconds(60)}
              className="p-1 rounded bg-[#f4f1ea] border border-[#ded7cc] hover:bg-[#eae5dc] text-[#56514a] transition-colors"
              title="Tăng 1 phút"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Start / Pause Control */}
        <button
          onClick={onToggleTimer}
          className={`w-full py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
            isTimerRunning 
              ? 'bg-[#d97706] text-white hover:bg-[#b45309]' 
              : 'bg-[#a74127] text-white hover:bg-[#8f3620]'
          }`}
        >
          {isTimerRunning ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          <span>{isTimerRunning ? 'Tạm dừng phiên này' : 'Bắt đầu Focus'}</span>
        </button>
      </div>
    </div>
  );
};
