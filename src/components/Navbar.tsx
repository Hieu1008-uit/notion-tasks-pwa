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
  ChevronDown,
  Crown,
  Sparkles,
  Layers,
  Bot,
  Headphones,
  Users,
  Mic
} from 'lucide-react';
import type { TabType, ThemeMode, User } from '../types';
import { LofiPlayer } from './LofiPlayer';

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
  onOpenProModal: () => void;
  onOpenTemplatesModal: () => void;
  onOpenAIModal: () => void;
  onOpenVoiceModal?: () => void;
  onOpenStudyRoomModal?: () => void;
  onOpenWrappedModal?: () => void;
  isPro?: boolean;
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
  onOpenProModal,
  onOpenTemplatesModal,
  onOpenAIModal,
  onOpenVoiceModal,
  onOpenStudyRoomModal,
  onOpenWrappedModal,
  isPro = false,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLofiPopover, setShowLofiPopover] = useState(false);
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const userIsPro = isPro || Boolean(user?.isPro);

  return (
    <>
      {/* Top Header */}
      <header className="max-w-5xl 2xl:max-w-7xl mx-auto w-full pt-8 pb-4 px-6 select-none relative z-30">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          {/* Brand & Title */}
          <div className="shrink-0 max-w-xs">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Tasks
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse mt-1" />
              {userIsPro && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 text-[10px] font-black uppercase tracking-wider shadow-xs animate-pulse">
                  <Crown className="w-3 h-3 fill-amber-900 text-amber-900" />
                  <span>PRO</span>
                </span>
              )}
            </div>
            <p 
              className="text-xs font-medium text-slate-400 dark:text-slate-400 mt-0.5 hidden sm:block truncate"
              title={totalCount > 0 
                ? `Create your categorised task boards • ${completedCount} of ${totalCount} completed (${percent}%)`
                : 'Create your categorised task boards • Bắt đầu tạo công việc đầu tiên'}
            >
              {totalCount > 0 
                ? `Create your categorised task boards • ${completedCount} of ${totalCount} completed (${percent}%)`
                : 'Create your categorised task boards • Bắt đầu tạo công việc đầu tiên'}
            </p>
          </div>

          {/* Desktop Navigation Tabs (Soft Floating Pill Style) */}
          <div className="hidden md:flex items-center gap-1.5 bg-white dark:bg-slate-800/90 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-700/70 shrink-0">
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
          <div className="flex items-center gap-2">
            {/* Study Room UIT Button */}
            {onOpenStudyRoomModal && (
              <button
                onClick={onOpenStudyRoomModal}
                className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all hover:scale-105 active:scale-95 shadow-xs"
                title="Phòng học ảo Study With Me & Đua Top YPT UIT"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Phòng học UIT</span>
              </button>
            )}

            {/* Flex Story Wrapped Button */}
            {onOpenWrappedModal && (
              <button
                onClick={onOpenWrappedModal}
                className="hidden xl:flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40 hover:bg-purple-100 transition-all hover:scale-105 active:scale-95 shadow-xs"
                title="Tổng kết năng suất tuần Spotify Wrapped phong cách 9:16"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>Flex Story</span>
              </button>
            )}

            {/* Voice Task Button */}
            {onOpenVoiceModal && (
              <button
                onClick={onOpenVoiceModal}
                className="hidden xl:flex w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 items-center justify-center shadow-xs hover:bg-rose-100 text-rose-500 transition-all hover:scale-105 active:scale-95"
                title="Lên lịch bằng giọng nói tiếng Việt"
                aria-label="Voice schedule"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}

            {/* Pro Upgrade / Pro VIP Badge */}
            <button
              onClick={onOpenProModal}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                userIsPro
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-amber-950 shadow-amber-400/25 ring-2 ring-amber-300/60'
                  : 'bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-white shadow-amber-500/25'
              }`}
              title={userIsPro ? 'Tài khoản PRO Vĩnh Viễn' : 'Nâng cấp tài khoản PRO với VietQR'}
            >
              <Crown className={`w-3.5 h-3.5 ${userIsPro ? 'fill-amber-900 text-amber-900' : 'fill-white'}`} />
              <span className="hidden lg:inline">{userIsPro ? 'PRO VIP' : 'Nâng cấp Pro'}</span>
              <span className="lg:hidden">PRO</span>
            </button>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIModal}
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all hover:scale-105 active:scale-95 shadow-xs"
              title="Trợ lý AI Lên lịch thông minh"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Trợ lý AI</span>
            </button>

            {/* Templates Library Button */}
            <button
              onClick={onOpenTemplatesModal}
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:scale-105 active:scale-95 shadow-xs"
              title="Kho Thư viện Mẫu Công việc"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kho Mẫu</span>
            </button>

            {/* Lofi Sound Button & Popover */}
            <div className="relative">
              <button
                onClick={() => setShowLofiPopover(!showLofiPopover)}
                className={`w-9 h-9 rounded-full flex items-center justify-center border shadow-xs transition-all hover:scale-105 active:scale-95 ${
                  showLofiPopover
                    ? 'bg-purple-600 text-white border-purple-600 shadow-purple-500/25'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-purple-600'
                }`}
                title="Âm thanh tập trung Pomodoro (Mưa, Sóng biển, Cafe, Lofi)"
                aria-label="Lofi sound player"
              >
                <Headphones className="w-4 h-4" />
              </button>

              {/* Lofi Popover Modal */}
              {showLofiPopover && (
                <div 
                  className="absolute right-0 mt-2 w-80 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LofiPlayer />
                </div>
              )}
            </div>

            {/* Streak pill synced with Habits */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-full border border-amber-200/60 dark:border-amber-800/40 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streak}d</span>
            </div>

            {/* Install to Phone Button */}
            <button
              onClick={onOpenInstallModal}
              className="hidden 2xl:flex w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 text-blue-600 dark:text-blue-400 transition-all hover:scale-105 active:scale-95"
              title="Cài đặt ứng dụng về điện thoại (PWA)"
              aria-label="Cài đặt App"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Reset All Data Button */}
            {onResetAllData && (
              <button
                onClick={onResetAllData}
                className="hidden 2xl:flex w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 items-center justify-center shadow-xs hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all hover:scale-105 active:scale-95"
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
                  {userIsPro && (
                    <Crown className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                  )}
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
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black truncate">{user.name}</p>
                          {userIsPro && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-400 text-amber-950 font-black text-[9px]">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{user.email || user.phone}</p>
                      </div>
                    </div>

                    {userIsPro ? (
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200/60 dark:border-amber-800/40">
                        <Crown className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                        <span>Tài khoản PRO Vĩnh Viễn</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenProModal();
                        }}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200/60 dark:border-amber-800/40 hover:scale-[1.02] transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>Nâng cấp PRO</span>
                        </span>
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      </button>
                    )}

                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                      <CloudCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Đã đồng bộ đám mây</span>
                    </div>

                    {onOpenStudyRoomModal && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenStudyRoomModal();
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                      >
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span>Phòng học ảo UIT (28 online)</span>
                      </button>
                    )}

                    {onOpenWrappedModal && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenWrappedModal();
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 text-xs font-bold text-purple-700 dark:text-purple-300 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span>Flex Story Wrapped 9:16</span>
                      </button>
                    )}

                    {onOpenVoiceModal && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenVoiceModal();
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors"
                      >
                        <Mic className="w-4 h-4 text-rose-500" />
                        <span>Lên lịch bằng Giọng nói</span>
                      </button>
                    )}

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
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 sm:px-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
                title="Đăng nhập"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Floating Bottom Bar */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-sm bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-full shadow-2xl shadow-blue-900/15 border border-slate-200/80 dark:border-slate-700/80 px-4 py-2 flex items-center justify-between">
        {/* Tasks Tab */}
        <button
          onClick={() => onSelectTab('todo')}
          className="flex flex-col items-center gap-0.5 relative py-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
          title="Tasks"
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
          title="To Day"
        >
          <Calendar className={`w-5 h-5 ${currentTab === 'today' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
          {currentTab === 'today' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 absolute -bottom-1" />
          )}
        </button>

        {/* Center Floating Elevated Blue Plus Button on Mobile */}
        <button
          onClick={onOpenNewTaskModal}
          className="w-11 h-11 -mt-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all border-3 border-[#f1f4f9] dark:border-[#0f172a]"
          title="Thêm công việc mới"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
        </button>

        {/* AI Assistant / Templates on Mobile */}
        <button
          onClick={onOpenAIModal}
          className="flex flex-col items-center gap-0.5 relative py-1 text-indigo-600 dark:text-indigo-400 transition-colors"
          title="Trợ lý AI"
        >
          <Bot className="w-5 h-5" />
        </button>

        {/* Habits Tab */}
        <button
          onClick={() => onSelectTab('contributions')}
          className="flex flex-col items-center gap-0.5 relative py-1 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors"
          title="Habits"
        >
          <Activity className={`w-5 h-5 ${currentTab === 'contributions' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
          {currentTab === 'contributions' && (
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 absolute -bottom-1" />
          )}
        </button>

        {/* Pro / User on Mobile */}
        <button
          onClick={onOpenProModal}
          className="flex flex-col items-center gap-0.5 relative py-1 text-amber-500 transition-colors"
          title="Nâng cấp Pro"
        >
          <Crown className="w-5 h-5 fill-amber-500" />
        </button>
      </div>
    </>
  );
};

