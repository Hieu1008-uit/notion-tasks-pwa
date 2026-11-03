import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Trophy, 
  Flame, 
  Sparkles, 
  Radio, 
  GraduationCap, 
  Medal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { User, Task } from '../types';

interface StudyRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  totalFocusSeconds: number;
  isTimerRunning: boolean;
  activeTask?: Task | null;
}

interface PeerStudent {
  id: string;
  name: string;
  major: string;
  taskTitle: string;
  focusMinutesToday: number;
  avatarSeed: string;
  status: 'focusing' | 'break';
  color: string;
}

const UIT_STUDENTS: PeerStudent[] = [
  { id: 'uit-1', name: 'Nguyễn Văn Nam', major: 'Kỹ thuật Phần mềm (KTPM2022)', taskTitle: 'Đồ án Java & Spring Boot Web Service', focusMinutesToday: 142, avatarSeed: 'nam_uit', status: 'focusing', color: '#3b82f6' },
  { id: 'uit-2', name: 'Trần Thị Mai Linh', major: 'Hệ thống Thông tin (HTTT2023)', taskTitle: 'Luyện đề IELTS Reading & Cam 18', focusMinutesToday: 95, avatarSeed: 'linh_uit', status: 'focusing', color: '#10b981' },
  { id: 'uit-3', name: 'Lê Hoàng Phúc', major: 'Khoa học Máy tính (KHMT2021)', taskTitle: 'Fine-tune mô hình AI Llama 3 & PyTorch', focusMinutesToday: 180, avatarSeed: 'phuc_uit', status: 'focusing', color: '#8b5cf6' },
  { id: 'uit-4', name: 'Đặng Tuấn Kiệt', major: 'An toàn Thông tin (ATTT2022)', taskTitle: 'Phân tích mã độc Ransomware Reverse Engineering', focusMinutesToday: 68, avatarSeed: 'kiet_uit', status: 'break', color: '#ef4444' },
  { id: 'uit-5', name: 'Hoàng Thị Thu Trâm', major: 'Thương mại Điện tử (TMĐT2023)', taskTitle: 'Thiết kế giao diện Mobile App trên Figma', focusMinutesToday: 110, avatarSeed: 'tram_uit', status: 'focusing', color: '#ec4899' },
  { id: 'uit-6', name: 'Phạm Đức Anh', major: 'Mạng máy tính (MMT2024)', taskTitle: 'Cấu hình OSPF Routing trên Cisco Packet Tracer', focusMinutesToday: 75, avatarSeed: 'anh_uit', status: 'focusing', color: '#06b6d4' },
  { id: 'uit-7', name: 'Võ Minh Khoa', major: 'Khoa học Dữ liệu (KHDL2022)', taskTitle: 'Trực quan hóa dữ liệu EDA Python Pandas', focusMinutesToday: 135, avatarSeed: 'khoa_uit', status: 'focusing', color: '#f59e0b' },
  { id: 'uit-8', name: 'Bùi Ngọc Thảo', major: 'Kỹ thuật Máy tính (KTMT2023)', taskTitle: 'Lập trình Vi điều khiển STM32 nhúng', focusMinutesToday: 82, avatarSeed: 'thao_uit', status: 'break', color: '#14b8a6' },
];

interface LeaderboardItem {
  rank: number;
  name: string;
  major: string;
  totalHours: number;
  streak: number;
  badge?: string;
  isCurrentUser?: boolean;
}

export const StudyRoomModal: React.FC<StudyRoomModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  totalFocusSeconds,
  isTimerRunning,
  activeTask,
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'leaderboard'>('live');
  const [cheers, setCheers] = useState<{ id: number; emoji: string; x: number }[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'today' | 'month'>('week');

  // Real-time calculated hours for user
  const userHours = Math.max(0.5, +(totalFocusSeconds / 3600).toFixed(1));
  const userMinutesToday = Math.round(totalFocusSeconds / 60);

  // Floating cheers reaction trigger
  const handleSendReaction = (emoji: string) => {
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40; // Percentage offset
    setCheers(prev => [...prev, { id, emoji, x }]);

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#3b82f6', '#ec4899', '#f59e0b', '#10b981']
    });

    setTimeout(() => {
      setCheers(prev => prev.filter(c => c.id !== id));
    }, 2000);
  };

  const LEADERBOARD_DATA: LeaderboardItem[] = [
    { rank: 1, name: 'Nguyễn Văn Nam', major: 'KTPM2022 • UIT', totalHours: 48.5, streak: 24, badge: '🥇 Vua Tập Trung' },
    { rank: 2, name: 'Trần Thị Mai Linh', major: 'HTTT2023 • UIT', totalHours: 42.0, streak: 19, badge: '🥈 Siêu Cày Cuốc' },
    { rank: 3, name: 'Lê Hoàng Phúc', major: 'KHMT2021 • UIT', totalHours: 39.2, streak: 16, badge: '🥉 Thần Đèn UIT' },
    { rank: 4, name: 'Võ Minh Khoa', major: 'KHDL2022 • UIT', totalHours: 35.8, streak: 12 },
    { rank: 5, name: 'Hoàng Thị Thu Trâm', major: 'HTTT2022 • UIT', totalHours: 31.4, streak: 14 },
    { rank: 6, name: 'Đặng Tuấn Kiệt', major: 'ATTT2021 • UIT', totalHours: 29.0, streak: 11 },
    { rank: 7, name: 'Phạm Đức Anh', major: 'MMT2024 • UIT', totalHours: 27.5, streak: 9 },
    { rank: 8, name: 'Bùi Ngọc Thảo', major: 'CNPM2023 • UIT', totalHours: 26.2, streak: 8 },
    { rank: 9, name: 'Nguyễn Hữu Tài', major: 'KHMT2022 • UIT', totalHours: 24.8, streak: 10 },
    { rank: 10, name: 'Huỳnh Tấn Đạt', major: 'HTTT2024 • UIT', totalHours: 23.0, streak: 7 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating animated cheer emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
          {cheers.map(c => (
            <div
              key={c.id}
              style={{ left: `${c.x}%` }}
              className="absolute bottom-16 text-3xl animate-bounce duration-1000 transform -translate-x-1/2 opacity-90"
            >
              {c.emoji}
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors"
          title="Đóng modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Phòng Học Ảo & Đua Top UIT
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-2xs">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>Live</span>
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Study With Me phong cách YeolPumTa (YPT) dành riêng cho sinh viên Đại học Công nghệ Thông tin
            </p>
          </div>
        </div>

        {/* Quick Tabs Switcher (Live Study vs Leaderboard) */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-700/60 mb-6">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'live'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Phòng Học Trực Tiếp (28 Online)</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Bảng Vàng Tuần UIT (Leaderboard)</span>
          </button>
        </div>

        {/* Tab 1: Live Study Room */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            {/* User's Own Live Status Card */}
            <div className={`p-4 rounded-2xl border-2 transition-all ${
              isTimerRunning 
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={currentUser?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${currentUser?.name || 'uit_student'}`}
                      alt="You"
                      className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 object-cover border-2 border-white dark:border-slate-800"
                    />
                    <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 ${isTimerRunning ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                        {currentUser?.name || 'Bạn (Sinh viên UIT)'}
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        Bạn
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {isTimerRunning 
                        ? `Đang tập trung: "${activeTask ? activeTask.title : 'Phiên Pomodoro'}"`
                        : 'Hiện chưa bật đồng hồ Focus. Bật timer để lên sóng cùng bạn bè!'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {userMinutesToday} phút
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400">
                    hôm nay
                  </span>
                </div>
              </div>
            </div>

            {/* Cheers & Encouragement Reactions Bar */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/70 dark:from-slate-900/60 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Gửi lời cổ vũ phòng học:</span>
              </span>
              <div className="flex items-center gap-2">
                {[
                  { emoji: '👏', label: 'Vỗ tay' },
                  { emoji: '🔥', label: 'Cháy quá' },
                  { emoji: '❤️', label: 'Thả tim' },
                  { emoji: '🎉', label: 'Tuyệt vời' },
                  { emoji: '☕', label: 'Nạp năng lượng' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendReaction(item.emoji)}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 hover:scale-125 active:scale-95 transition-all text-base flex items-center justify-center shadow-2xs border border-slate-200 dark:border-slate-600 cursor-pointer"
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* List of Fellow UIT Students */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {UIT_STUDENTS.map((peer) => (
                <div
                  key={peer.id}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-700/80 transition-all flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/notionists/svg?seed=${peer.avatarSeed}`}
                        alt={peer.name}
                        className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 object-cover"
                      />
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${
                        peer.status === 'focusing' ? 'bg-emerald-500' : 'bg-amber-400'
                      }`} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                          {peer.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          • {peer.major.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                        <span className="truncate">{peer.taskTitle}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                      {peer.focusMinutesToday}m
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      peer.status === 'focusing' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                    }`}>
                      {peer.status === 'focusing' ? 'Đang học' : 'Nghỉ 5m'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: YPT Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            {/* Period Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Medal className="w-4 h-4 text-amber-500" />
                <span>Chiến Thần Năng Suất UIT</span>
              </span>
              <div className="flex items-center gap-1 text-[11px] font-bold bg-slate-100 dark:bg-slate-700 p-1 rounded-xl">
                {(['today', 'week', 'month'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={`px-2.5 py-0.5 rounded-lg transition-all ${
                      selectedPeriod === p 
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs font-black' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {p === 'today' ? 'Hôm nay' : p === 'week' ? 'Tuần này' : 'Tháng này'}
                  </button>
                ))}
              </div>
            </div>

            {/* User Personal Standing Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black text-base flex items-center justify-center shadow-md shadow-amber-500/25">
                  #12
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                      {currentUser?.name || 'Bạn'}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                      Top 5% UIT
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                    Năng suất cao hơn 86% sinh viên UIT trong tuần này!
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                  {userHours}h
                </div>
                <span className="text-[10px] font-bold text-slate-400">
                  tổng tuần
                </span>
              </div>
            </div>

            {/* Top 10 List */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {LEADERBOARD_DATA.map((item) => {
                const isTop1 = item.rank === 1;
                const isTop2 = item.rank === 2;
                const isTop3 = item.rank === 3;

                return (
                  <div
                    key={item.rank}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isTop1
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/60 shadow-xs'
                        : isTop2
                        ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-300 dark:border-slate-700'
                        : isTop3
                        ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/40'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Number */}
                      <span className={`w-7 text-center font-mono font-black text-sm shrink-0 ${
                        isTop1 ? 'text-amber-500 text-base' : isTop2 ? 'text-slate-400' : isTop3 ? 'text-orange-500' : 'text-slate-400'
                      }`}>
                        #{item.rank}
                      </span>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {item.name}
                          </span>
                          {item.badge && (
                            <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {item.major}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 text-right">
                      <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-500">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{item.streak}d</span>
                      </div>
                      <div className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">
                        {item.totalHours}h
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>Đồng bộ thời gian thực mỗi 10 giây</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
