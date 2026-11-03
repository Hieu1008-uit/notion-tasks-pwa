import React, { useState } from 'react';
import { 
  Plus, 
  Flame, 
  Sun, 
  Moon, 
  CheckSquare, 
  Activity, 
  Calendar, 
  Home, 
  RotateCcw,
  Smartphone,
  LogIn,
  LogOut,
  CloudCheck,
  ChevronDown
} from 'lucide-react';
import type { TabType, ThemeMode, User } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenNewTaskModal: () => void;
  completedCount: number;
  totalCount: number;
  streak: number;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onResetAllData?: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenInstallModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewTaskModal,
  completedCount,
  totalCount,
  streak,
  theme,
  onToggleTheme,
  onResetAllData,
  user,
  onOpenAuth,
  onLogout,
  onOpenInstallModal,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <>
      {/* Top Header */}
      <header className="max-w-5xl mx-auto w-full pt-8 pb-4 px-6 select-none relative z-30">
        <div className="flex items-center justify-between">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Tasks
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse mt-1" />
            </div>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-400 mt-0.5">
              {totalCount > 0 
                ? `Create your categorised task boards • ${completedCount} of ${totalCount} completed (${percent}%)`
                : 'Create your categorised task boards • Bắt đầu tạo công việc đầu tiên'}
            </p>
          </div>

          {/* Desktop Navigation Tabs (Soft Floating Pill Style) */}
          <div className="hidden md:flex items-center gap-1.5 bg-white dark:bg-slate-800/90 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700/70">
            <button
              onClick={() => onSelectTab('today')}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                currentTab === 'today'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>To Day</span>
            </button>

            <button
              onClick={() => onSelectTab('todo')}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                currentTab === 'todo'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Tasks</span>
            </button>

            <button
              onClick={() => onSelectTab('contributions')}
              className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all ${
                currentTab === 'contributions'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Habits</span>
            </button>
          </div>

          {/* Right Floating Actions */}
          <div className="flex items-center gap-2.5">
            {/* Streak pill synced with Habits */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2 rounded-full border border-amber-200/60 dark:border-amber-800/40 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streak}d Streak</span>
            </div>

            {/* Install to Phone Button */}
            <button
              onClick={onOpenInstallModal}
              className="hidden sm:flex w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 transition-all hover:scale-105 active:scale-95"
              title="Cài đặt ứng dụng về điện thoại (PWA)"
              aria-label="Cài đặt App"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Reset All Data Button */}
            {onResetAllData && (
              <button
                onClick={onResetAllData}
                className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all hover:scale-105 active:scale-95"
                title="Đặt lại toàn bộ dữ liệu về trạng thái ban đầu"
                aria-label="Reset all data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Light / Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95"
              title={theme === 'dark' ? 'Chuyển sang chế độ Sáng (Light Mode)' : 'Chuyển sang chế độ Tối (Dark Mode)'}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 fill-amber-400 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
              ) : (
                <Moon className="w-4 h-4 fill-slate-700 text-slate-700 transition-transform duration-300 rotate-0 hover:-rotate-45" />
              )}
            </button>

            {/* User Account / Sign In Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 pr-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-sm transition-all"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 max-w-[80px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Dropdown Popover */}
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-3xl p-4 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col gap-3 animate-in fade-in duration-150 z-50 text-slate-800 dark:text-slate-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-slate-700 object-cover"
                      />
                      <div className="overflow-hidden">
                        <p className="text-xs font-black truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email || user.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <CloudCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Đã đồng bộ đám mây</span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenInstallModal();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Cài đặt app vào điện thoại</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold text-red-600 dark:text-red-400 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-full shadow-2xl shadow-blue-900/15 border border-slate-200/80 dark:border-slate-700/80 px-5 py-2.5 flex items-center justify-between">
        {/* Tasks Tab */}
        <button
          onClick={() => onSelectTab('todo')}
          className="flex flex-col items-center gap-0.5 relative py-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <Home className={`w-5 h-5 ${currentTab === 'todo' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
          {currentTab === 'todo' && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute -bottom-1" />
          )}
        </button>

        {/* To Day Tab */}
        <button
          onClick={() => onSelectTab('today')}
          className="flex flex-col items-center gap-0.5 relative py-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <Calendar className={`w-5 h-5 ${currentTab === 'today' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
          {currentTab === 'today' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 absolute -bottom-1" />
          )}
        </button>

        {/* Center Floating Elevated Blue Plus Button on Mobile */}
        <button
          onClick={onOpenNewTaskModal}
          className="w-12 h-12 -mt-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all border-4 border-[#f1f4f9] dark:border-[#0f172a]"
          title="Thêm công việc mới"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Habits Tab */}
        <button
          onClick={() => onSelectTab('contributions')}
          className="flex flex-col items-center gap-0.5 relative py-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
        >
          <Activity className={`w-5 h-5 ${currentTab === 'contributions' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
          {currentTab === 'contributions' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 absolute -bottom-1" />
          )}
        </button>

        {/* User Account or Install on Mobile */}
        <button
          onClick={user ? onOpenInstallModal : onOpenAuth}
          className="flex flex-col items-center gap-0.5 relative py-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
          title={user ? 'Cài đặt app điện thoại' : 'Đăng nhập'}
        >
          {user ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-6 h-6 rounded-full border border-blue-500"
            />
          ) : (
            <LogIn className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          )}
        </button>
      </div>
    </>
  );
};
