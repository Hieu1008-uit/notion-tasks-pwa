import React from 'react';
import { 
  Sun, 
  CheckSquare, 
  Activity, 
  Flame, 
  Settings, 
  Search, 
  Plus, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import type { TabType, Task } from '../types';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  tasks: Task[];
  onOpenNewTaskModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  tasks,
  onOpenNewTaskModal,
}) => {
  const pendingTodayCount = tasks.filter(t => !t.completed).length;

  return (
    <aside className="w-64 bg-[#1e1e1e] border-r border-[#2a2a2a] flex flex-col justify-between h-screen select-none">
      {/* Top Workspace Header */}
      <div>
        <div className="p-3 border-b border-[#2a2a2a] flex items-center justify-between hover:bg-[#262626] cursor-pointer transition-colors group">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              N
            </div>
            <div>
              <div className="text-sm font-medium text-[#ededed] leading-tight flex items-center gap-1">
                Notion Focus
                <ChevronDown className="w-3.5 h-3.5 text-[#888888] group-hover:text-white" />
              </div>
              <div className="text-[11px] text-[#888888]">UIT Student Workspace</div>
            </div>
          </div>
          <button 
            onClick={onOpenNewTaskModal}
            className="p-1 rounded hover:bg-[#333333] text-[#888888] hover:text-white transition-colors"
            title="Thêm task mới nhanh"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search */}
        <div className="p-2">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#262626] border border-[#333333] text-[#888888] text-xs cursor-pointer hover:border-[#444444]">
            <Search className="w-3.5 h-3.5" />
            <span>Tìm kiếm task, nhãn...</span>
            <kbd className="ml-auto text-[10px] bg-[#1e1e1e] px-1.5 py-0.5 rounded border border-[#333333]">⌘K</kbd>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-2 space-y-1">
          <div className="text-[10px] uppercase font-semibold text-[#666666] px-2.5 py-1 tracking-wider">
            Không gian làm việc
          </div>

          <button
            onClick={() => onSelectTab('today')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors ${
              currentTab === 'today'
                ? 'bg-[#2a2a2a] text-[#ededed] font-medium'
                : 'text-[#999999] hover:bg-[#252525] hover:text-[#ededed]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sun className={`w-4 h-4 ${currentTab === 'today' ? 'text-amber-400' : 'text-[#888888]'}`} />
              <span>To Day (Time-block)</span>
            </div>
            {pendingTodayCount > 0 && (
              <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#333333] text-amber-300 font-mono">
                {pendingTodayCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('todo')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors ${
              currentTab === 'todo'
                ? 'bg-[#2a2a2a] text-[#ededed] font-medium'
                : 'text-[#999999] hover:bg-[#252525] hover:text-[#ededed]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className={`w-4 h-4 ${currentTab === 'todo' ? 'text-indigo-400' : 'text-[#888888]'}`} />
              <span>To-Do List</span>
            </div>
            <span className="text-[11px] text-[#666666]">{tasks.length}</span>
          </button>

          <button
            onClick={() => onSelectTab('contributions')}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors ${
              currentTab === 'contributions'
                ? 'bg-[#2a2a2a] text-[#ededed] font-medium'
                : 'text-[#999999] hover:bg-[#252525] hover:text-[#ededed]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className={`w-4 h-4 ${currentTab === 'contributions' ? 'text-emerald-400' : 'text-[#888888]'}`} />
              <span>Contributions & Heatmap</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Flame className="w-3 h-3 fill-emerald-400" />
              18d
            </div>
          </button>
        </nav>
      </div>

      {/* Bottom Summary & Stats */}
      <div className="p-3 border-t border-[#2a2a2a] space-y-2">
        <div className="p-2.5 rounded-lg bg-[#252525] border border-[#333333] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Flame className="w-4 h-4 fill-emerald-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#ededed]">Chuỗi 18 Ngày 🔥</div>
            <div className="text-[10px] text-[#888888]">Giữ phong độ tập trung tốt!</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#777777] px-1 pt-1">
          <div className="flex items-center gap-1.5 hover:text-[#aaaaaa] cursor-pointer">
            <Settings className="w-3.5 h-3.5" />
            <span>Cài đặt</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#555555]">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>v1.0 Pro</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
