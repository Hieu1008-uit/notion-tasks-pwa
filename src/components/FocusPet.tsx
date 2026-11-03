import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Heart, 
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FocusPetProps {
  isTimerRunning: boolean;
  pomodoroSeconds: number;
  initialMinutes?: number;
  className?: string;
}

export const FocusPet: React.FC<FocusPetProps> = ({
  isTimerRunning,
  pomodoroSeconds,
  initialMinutes = 25,
  className = '',
}) => {
  const [distractions, setDistractions] = useState<number>(() => {
    const saved = localStorage.getItem('pastel_focus_distractions');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isSulking, setIsSulking] = useState(false);
  const [customBubble, setCustomBubble] = useState<string | null>(null);
  const [showWarningToast, setShowWarningToast] = useState(false);

  const totalSeconds = initialMinutes * 60;
  const elapsedSeconds = Math.max(0, totalSeconds - pomodoroSeconds);
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  // Growth Stage: 1 (0-4m), 2 (5-14m), 3 (15-24m), 4 (25m+)
  const growthStage = pomodoroSeconds === 0
    ? 4
    : elapsedMinutes < 5
    ? 1
    : elapsedMinutes < 15
    ? 2
    : elapsedMinutes < 25
    ? 3
    : 4;

  const petState = isSulking
    ? ('sulking' as const)
    : pomodoroSeconds === 0
    ? ('bloomed' as const)
    : isTimerRunning
    ? ('focused' as const)
    : ('happy' as const);

  const speechBubble = customBubble || (
    isSulking
      ? 'Bắt quả tang bạn vừa chuyển tab sang lướt web! Mầm hờn dỗi rồi đó 🥺🥀'
      : pomodoroSeconds === 0
      ? 'Nở hoa rực rỡ rồi! Xuất sắc quá, bạn đã hoàn thành trọn vẹn hiệp này 🌸🎉'
      : !isTimerRunning
      ? 'Bấm "Bắt đầu Focus" để giúp bé mầm lớn nhanh nha 🌱✨'
      : growthStage === 1
      ? 'Hạt mầm vừa thức giấc! Hãy giữ nhịp thở và tập trung nha 🌱'
      : growthStage === 2
      ? 'Chồi non đang vươn lên đón nắng nè! Đã được hơn 5 phút rồi 🌿'
      : growthStage === 3
      ? 'Cây non khỏe khoắn lắm rồi! Sắp về đích 25 phút rồi cố lên 🌳🔥'
      : 'Sắp nở hoa rồi bạn ơi, tuyệt vời ông mặt trời 🌸✨'
  );

  // Visibility Detection: Catch tab switches while timer is actively running
  useEffect(() => {
    let returnTimer: ReturnType<typeof setTimeout> | null = null;

    const handleVisibilityChange = () => {
      if (document.hidden && isTimerRunning) {
        // User switched tab to Facebook/TikTok/etc. while timer running!
        setDistractions(prev => {
          const next = prev + 1;
          localStorage.setItem('pastel_focus_distractions', next.toString());
          return next;
        });

        setIsSulking(true);
        setCustomBubble('Bắt quả tang bạn vừa chuyển tab sang lướt web! Mầm hờn dỗi rồi đó 🥺🥀');
        setShowWarningToast(true);
      } else if (!document.hidden && isTimerRunning) {
        // User returned back
        setCustomBubble('Hoan hô bạn đã quay lại! Cùng mầm tập trung tiếp nhé 💪✨');
        returnTimer = setTimeout(() => {
          setIsSulking(false);
          setCustomBubble(null);
          setShowWarningToast(false);
        }, 3500);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (returnTimer) clearTimeout(returnTimer);
    };
  }, [isTimerRunning]);

  const handleResetDistractions = () => {
    setDistractions(0);
    localStorage.setItem('pastel_focus_distractions', '0');
    setIsSulking(false);
    setCustomBubble('Đã đặt lại số lần xao nhãng về 0! Cùng bắt đầu lại thật tập trung nào 🌱');
  };

  const handlePetClick = () => {
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.6 },
      colors: ['#a7f3d0', '#fbcfe8', '#fef08a', '#93c5fd']
    });

    if (isSulking) {
      setCustomBubble('Thôi mầm tha cho bạn đó! Hứa là không chuyển tab linh tinh nữa nha 🥺✨');
      setIsSulking(false);
    } else {
      setCustomBubble('Cảm ơn bạn đã xoa đầu mầm! Yêu bạn nhiều ❤️🌱');
      setTimeout(() => setCustomBubble(null), 3000);
    }
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Distraction Alert Toast Popup */}
      {showWarningToast && (
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 w-max max-w-xs px-3.5 py-1.5 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-lg shadow-rose-500/30 flex items-center gap-1.5 animate-bounce">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Bắt quả tang lướt web khác! Cây bị héo 🥀</span>
        </div>
      )}

      {/* Cute Interactive Speech Bubble */}
      <div className="relative mb-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-700/95 border border-slate-200/80 dark:border-slate-600 shadow-sm max-w-[240px] text-center transform transition-all">
        <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
          {speechBubble}
        </p>
        {/* Bubble pointer caret */}
        <div className="w-2.5 h-2.5 bg-white/95 dark:bg-slate-700/95 border-r border-b border-slate-200/80 dark:border-slate-600 absolute -bottom-1.5 left-1/2 -translate-x-1/2 rotate-45" />
      </div>

      {/* Pastel Mascot Character (Sprout / Pet SVG with fluid animations) */}
      <div 
        onClick={handlePetClick}
        className="relative cursor-pointer group hover:scale-105 active:scale-95 transition-transform"
        title="Bấm vào bé mầm để tương tác hoặc dỗ dành!"
      >
        <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all ${
          petState === 'sulking'
            ? 'bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-700 shadow-md shadow-rose-200/40'
            : petState === 'bloomed'
            ? 'bg-gradient-to-tr from-pink-100 to-amber-100 dark:from-pink-950/40 dark:to-amber-950/40 border-2 border-pink-300 dark:border-pink-700 shadow-lg shadow-pink-200/50'
            : isTimerRunning
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 shadow-md shadow-emerald-200/40'
            : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600'
        }`}>
          {/* SVG Plant Graphic based on Growth Stage & Sulking State */}
          {petState === 'sulking' ? (
            /* Sulking / Wilted Plant 🥀 */
            <svg viewBox="0 0 100 100" className="w-18 h-18 text-rose-400 drop-shadow-sm animate-pulse">
              {/* Pot */}
              <path d="M30 70 L35 90 Q50 94 65 90 L70 70 Z" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
              {/* Drooping Stem */}
              <path d="M50 70 Q52 50 35 45" fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" />
              {/* Drooping Wilted Leaf */}
              <path d="M35 45 Q25 40 28 55 Q35 52 35 45" fill="#fda4af" stroke="#f43f5e" strokeWidth="1.5" />
              {/* Teary eyes */}
              <circle cx="45" cy="78" r="2" fill="#64748b" />
              <circle cx="55" cy="78" r="2" fill="#64748b" />
              {/* Sad Mouth */}
              <path d="M46 84 Q50 81 54 84" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
              {/* Teardrop */}
              <circle cx="43" cy="82" r="1.5" fill="#38bdf8" />
            </svg>
          ) : growthStage === 1 ? (
            /* Stage 1: Tiny Sprout 🌱 */
            <svg viewBox="0 0 100 100" className={`w-18 h-18 text-emerald-500 drop-shadow-sm ${isTimerRunning ? 'animate-bounce duration-1000' : ''}`}>
              {/* Pot */}
              <path d="M30 70 L35 90 Q50 94 65 90 L70 70 Z" fill="#fed7aa" stroke="#fdba74" strokeWidth="2" />
              {/* Tiny Stem */}
              <path d="M50 70 L50 48" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              {/* Two baby leaves */}
              <path d="M50 48 Q40 40 42 34 Q50 38 50 48" fill="#a7f3d0" stroke="#10b981" strokeWidth="1.5" />
              <path d="M50 48 Q60 40 58 34 Q50 38 50 48" fill="#6ee7b7" stroke="#10b981" strokeWidth="1.5" />
              {/* Cute Smiling Face on Pot */}
              <circle cx="45" cy="79" r="2" fill="#78350f" />
              <circle cx="55" cy="79" r="2" fill="#78350f" />
              {/* Rosy Cheeks */}
              <circle cx="41" cy="81" r="2" fill="#fca5a5" opacity="0.8" />
              <circle cx="59" cy="81" r="2" fill="#fca5a5" opacity="0.8" />
              <path d="M47 83 Q50 86 53 83" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : growthStage === 2 ? (
            /* Stage 2: Growing Seedling 🌿 */
            <svg viewBox="0 0 100 100" className={`w-18 h-18 text-emerald-600 drop-shadow-sm ${isTimerRunning ? 'animate-pulse' : ''}`}>
              <path d="M30 70 L35 90 Q50 94 65 90 L70 70 Z" fill="#bfdbfe" stroke="#93c5fd" strokeWidth="2" />
              <path d="M50 70 Q48 45 50 35" fill="none" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
              {/* 4 Green Leaves */}
              <path d="M50 55 Q35 50 38 42 Q50 46 50 55" fill="#a7f3d0" stroke="#059669" strokeWidth="1.5" />
              <path d="M50 48 Q65 44 62 36 Q50 40 50 48" fill="#6ee7b7" stroke="#059669" strokeWidth="1.5" />
              <path d="M50 35 Q40 25 45 20 Q50 26 50 35" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
              <path d="M50 35 Q60 25 55 20 Q50 26 50 35" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
              {/* Happy Face */}
              <circle cx="45" cy="79" r="2" fill="#1e3a8a" />
              <circle cx="55" cy="79" r="2" fill="#1e3a8a" />
              <circle cx="41" cy="81" r="2.5" fill="#f472b6" opacity="0.7" />
              <circle cx="59" cy="81" r="2.5" fill="#f472b6" opacity="0.7" />
              <path d="M46 83 Q50 87 54 83" fill="none" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : growthStage === 3 ? (
            /* Stage 3: Lush Tree 🌳 */
            <svg viewBox="0 0 100 100" className={`w-18 h-18 text-emerald-700 drop-shadow-md ${isTimerRunning ? 'animate-pulse' : ''}`}>
              <path d="M30 70 L35 90 Q50 94 65 90 L70 70 Z" fill="#ddd6fe" stroke="#c4b5fd" strokeWidth="2" />
              <path d="M50 70 L50 36" fill="none" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
              {/* Rich Canopy Clouds */}
              <circle cx="40" cy="32" r="14" fill="#6ee7b7" />
              <circle cx="60" cy="32" r="14" fill="#34d399" />
              <circle cx="50" cy="22" r="16" fill="#10b981" />
              {/* Cute Nerd Glasses 👓 */}
              <rect x="40" y="76" width="8" height="6" rx="2" fill="none" stroke="#4c1d95" strokeWidth="1.5" />
              <rect x="52" y="76" width="8" height="6" rx="2" fill="none" stroke="#4c1d95" strokeWidth="1.5" />
              <line x1="48" y1="79" x2="52" y2="79" stroke="#4c1d95" strokeWidth="1.5" />
              <path d="M47 85 Q50 88 53 85" fill="none" stroke="#4c1d95" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            /* Stage 4: Blooming Flower 🌸 */
            <svg viewBox="0 0 100 100" className="w-18 h-18 drop-shadow-lg animate-bounce duration-1000">
              <path d="M30 70 L35 90 Q50 94 65 90 L70 70 Z" fill="#fef08a" stroke="#fde047" strokeWidth="2" />
              <path d="M50 70 L50 40" fill="none" stroke="#059669" strokeWidth="4" strokeLinecap="round" />
              {/* Leaves */}
              <path d="M50 55 Q35 50 38 42 Q50 46 50 55" fill="#86efac" />
              <path d="M50 50 Q65 46 62 38 Q50 42 50 50" fill="#86efac" />
              {/* Blossom Petals */}
              <circle cx="50" cy="24" r="8" fill="#f472b6" />
              <circle cx="38" cy="30" r="8" fill="#fb7185" />
              <circle cx="62" cy="30" r="8" fill="#fb7185" />
              <circle cx="42" cy="42" r="8" fill="#f472b6" />
              <circle cx="58" cy="42" r="8" fill="#f472b6" />
              {/* Flower Core */}
              <circle cx="50" cy="33" r="8" fill="#fde047" stroke="#eab308" strokeWidth="1" />
              {/* Excited Face on Pot */}
              <circle cx="44" cy="79" r="2" fill="#854d0e" />
              <circle cx="56" cy="79" r="2" fill="#854d0e" />
              <circle cx="40" cy="80" r="2.5" fill="#fda4af" />
              <circle cx="60" cy="80" r="2.5" fill="#fda4af" />
              <path d="M46 83 Q50 89 54 83" fill="#f43f5e" stroke="#854d0e" strokeWidth="1" />
            </svg>
          )}
        </div>
      </div>

      {/* Progress & Distraction Indicators */}
      <div className="flex items-center gap-2 mt-2">
        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300">
          Giai đoạn {growthStage}/4
        </span>

        {distractions > 0 ? (
          <button
            onClick={handleResetDistractions}
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 flex items-center gap-1 hover:bg-rose-100 transition-colors"
            title="Bấm để đặt lại số lần xao nhãng"
          >
            <AlertTriangle className="w-2.5 h-2.5" />
            <span>Xao nhãng: {distractions}</span>
            <RefreshCw className="w-2.5 h-2.5 opacity-60 hover:opacity-100" />
          </button>
        ) : (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 fill-emerald-500" />
            <span>100% Tập trung</span>
          </span>
        )}
      </div>
    </div>
  );
};
