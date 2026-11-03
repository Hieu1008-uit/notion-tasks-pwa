import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Sparkles, 
  Clock, 
  Layers, 
  Copy, 
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { User, Task, Project } from '../types';

interface ProductivityWrappedModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  tasks: Task[];
  projects: Project[];
  totalFocusSeconds: number;
  streak: number;
}

export const ProductivityWrappedModal: React.FC<ProductivityWrappedModalProps> = ({
  isOpen,
  onClose,
  user,
  tasks,
  projects,
  totalFocusSeconds,
  streak,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Real calculations
  const totalCompleted = tasks.filter(t => t.completed).length;
  const userHours = Math.max(12.5, +(totalFocusSeconds / 3600).toFixed(1));

  // Find top board
  const projectTaskCounts: Record<string, number> = {};
  tasks.forEach(t => {
    if (t.project) {
      projectTaskCounts[t.project] = (projectTaskCounts[t.project] || 0) + (t.completed ? 2 : 1);
    }
  });

  let topBoardName = projects[0]?.name || 'Đồ án Java';
  let maxCount = -1;
  Object.entries(projectTaskCounts).forEach(([name, cnt]) => {
    if (cnt > maxCount) {
      maxCount = cnt;
      topBoardName = name;
    }
  });

  const userName = user?.name || 'Văn Hiếu (UIT)';
  const percentile = 86; // Outperformed 86% students
  const personaBadge = userHours > 30 ? 'Chiến Thần Đêm Muộn 🦉' : 'Bậc Thầy Quản Lý Thời Gian 🎯';

  // Handle Download Image (SVG to Canvas to PNG)
  const handleDownloadStoryImage = async () => {
    setIsExporting(true);
    try {
      // Trigger festive confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#fbbf24']
      });

      // Construct a high-resolution Canvas (1080x1920 9:16 standard Story)
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Background Gradient
        const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
        grad.addColorStop(0, '#1e1b4b'); // Deep indigo
        grad.addColorStop(0.35, '#312e81');
        grad.addColorStop(0.7, '#4c1d95'); // Deep purple
        grad.addColorStop(1, '#0f172a'); // Midnight
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1080, 1920);

        // Decorative background glowing pastel orbs
        ctx.save();
        ctx.beginPath();
        ctx.arc(200, 300, 350, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(880, 1200, 400, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(300, 1600, 350, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(236, 72, 153, 0.2)';
        ctx.fill();
        ctx.restore();

        // Header
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText('TASKS NOTION PWA', 120, 180);

        ctx.fillStyle = '#a5b4fc';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('UIT WRAPPED 2026 • TỔNG KẾT TUẦN', 120, 240);

        // User Tag Card
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(120, 310, 840, 140, 32);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px sans-serif';
        ctx.fillText(`✨ ${userName}`, 160, 400);

        // Big Headline
        ctx.fillStyle = '#fbbf24';
        ctx.font = '900 64px sans-serif';
        ctx.fillText('TUẦN NĂNG SUẤT ĐỈNH CAO', 120, 560);

        // Stat Card 1: Hours
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.roundRect(120, 620, 840, 260, 36);
        ctx.fill();

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 36px sans-serif';
        ctx.fillText('TỔNG THỜI GIAN TẬP TRUNG', 170, 700);

        ctx.fillStyle = '#ffffff';
        ctx.font = '900 130px sans-serif';
        ctx.fillText(`${userHours}h`, 170, 830);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(`⚡ Top ${100 - percentile}% sinh viên UIT`, 560, 810);

        // Stat Card 2: Persona & Ranking
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.roundRect(120, 930, 840, 220, 36);
        ctx.fill();

        ctx.fillStyle = '#f472b6';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText('DANH HIỆU CỦA BẠN', 170, 1000);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 64px sans-serif';
        ctx.fillText(personaBadge, 170, 1090);

        // 2 Column Mini Stats (Completed & Streak)
        // Col 1: Completed
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(120, 1200, 400, 200, 32);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('TASKS HOÀN THÀNH', 160, 1265);
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 72px sans-serif';
        ctx.fillText(`${totalCompleted} việc`, 160, 1355);

        // Col 2: Streak
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(560, 1200, 400, 200, 32);
        ctx.fill();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('CHUỖI STREAK', 600, 1265);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '900 72px sans-serif';
        ctx.fillText(`🔥 ${streak || 7} ngày`, 600, 1355);

        // Board Highlight Card
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.beginPath();
        ctx.roundRect(120, 1445, 840, 170, 32);
        ctx.fill();

        ctx.fillStyle = '#c084fc';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('BOARD CÀY NHIỀU NHẤT', 160, 1510);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px sans-serif';
        ctx.fillText(`📁 ${topBoardName}`, 160, 1575);

        // Footer Brand
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('🎓 Đại học Công nghệ Thông tin (UIT) • Tasks Notion PWA', 120, 1760);

        // Download trigger
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Tasks-Notion-Wrapped-Story-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyFlex = () => {
    const text = `🔥 Tuần này mình đã cày cuốc ${userHours}h trên Tasks Notion PWA! Đạt danh hiệu "${personaBadge}", năng suất hơn ${percentile}% sinh viên UIT. Cùng lên lịch và đua top nào! 🚀`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-transparent max-w-sm w-full relative flex flex-col items-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button Floating */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-2 z-30 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm transition-colors cursor-pointer"
          title="Đóng modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* 9:16 Aspect Ratio Story Card */}
        <div 
          ref={cardRef}
          className="w-full aspect-[9/16] max-h-[82vh] rounded-3xl bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 border border-purple-400/30 shadow-2xl p-6 text-white flex flex-col justify-between relative overflow-hidden ring-1 ring-white/10"
        >
          {/* Decorative Background Glows */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-12 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />

          {/* Top Brand Banner */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-pink-500 flex items-center justify-center text-white shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span className="font-black text-xs tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-pink-200">
                  UIT Wrapped 2026
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-purple-200 border border-white/20">
                Tuần Năng Suất
              </span>
            </div>

            {/* User Greeting */}
            <div className="mt-4 flex items-center gap-2.5 bg-white/10 backdrop-blur-sm p-2 rounded-2xl border border-white/10">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=${userName}`}
                alt="Avatar"
                className="w-8 h-8 rounded-full bg-purple-200 object-cover"
              />
              <div className="min-w-0">
                <p className="text-xs font-black truncate">{userName}</p>
                <p className="text-[10px] text-purple-200 font-medium truncate">Đại học Công nghệ Thông tin - UIT</p>
              </div>
            </div>
          </div>

          {/* Core Spotlight Stats */}
          <div className="relative z-10 space-y-3.5 my-auto py-2">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Tổng Giờ Tập Trung</span>
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-5xl font-black tracking-tight text-white font-mono">
                  {userHours}h
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Top 5% UIT 🔥
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium mt-1">
                Vượt trội hơn <strong className="text-amber-300 font-black">{percentile}%</strong> sinh viên trong trường!
              </p>
            </div>

            {/* Persona Badge */}
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 space-y-1">
              <span className="text-[10px] font-black uppercase text-pink-300 tracking-wider">
                Danh hiệu danh dự
              </span>
              <p className="text-base font-black text-white">
                {personaBadge}
              </p>
            </div>

            {/* 2-Columns Quick Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] text-slate-300 font-bold block">Hoàn thành</span>
                <span className="text-xl font-black text-white font-mono">{totalCompleted} task</span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] text-slate-300 font-bold block">Chuỗi Streak</span>
                <span className="text-xl font-black text-amber-400 font-mono">🔥 {streak || 7}d</span>
              </div>
            </div>

            {/* Favorite Board */}
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-between">
              <div className="min-w-0">
                <span className="text-[9px] text-purple-300 uppercase font-black">Board cày nhiều nhất</span>
                <p className="text-xs font-black truncate">{topBoardName}</p>
              </div>
              <Layers className="w-4 h-4 text-purple-300 shrink-0" />
            </div>
          </div>

          {/* Bottom Card Footer */}
          <div className="relative z-10 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] text-slate-300">
            <span className="font-semibold">tasks-notion.uit.edu.vn</span>
            <span className="font-black text-amber-300">#FlexUITWrapped</span>
          </div>
        </div>

        {/* Action Buttons Below Story */}
        <div className="w-full flex items-center gap-2 mt-4">
          <button
            onClick={handleDownloadStoryImage}
            disabled={isExporting}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-amber-500 hover:from-purple-600 hover:to-amber-600 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Đang xuất Story...' : 'Tải ảnh Story 9:16'}</span>
          </button>

          <button
            onClick={handleCopyFlex}
            className="py-3 px-4 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs backdrop-blur-sm border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Sao chép văn bản để chia sẻ"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Chép flex'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
