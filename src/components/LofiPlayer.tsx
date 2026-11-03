import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Waves, 
  Coffee, 
  Music2, 
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import type { SoundType } from '../types';

interface LofiPlayerProps {
  compact?: boolean;
  className?: string;
}

const SOUND_PRESETS: Array<{
  id: SoundType;
  label: string;
  subLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
}> = [
  {
    id: 'rain',
    label: 'Tiếng Mưa',
    subLabel: 'Mưa rào dịu êm',
    icon: CloudRain,
    color: 'text-sky-500',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/40'
  },
  {
    id: 'waves',
    label: 'Sóng Biển',
    subLabel: 'Sóng vỗ bờ cát',
    icon: Waves,
    color: 'text-teal-500',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800/40'
  },
  {
    id: 'cafe',
    label: 'Quán Cà Phê',
    subLabel: 'Không gian ấm cúng',
    icon: Coffee,
    color: 'text-amber-500',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40'
  },
  {
    id: 'lofi',
    label: 'Lofi Chill',
    subLabel: 'Giai điệu thư giãn',
    icon: Music2,
    color: 'text-purple-500',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40'
  }
];

export const LofiPlayer: React.FC<LofiPlayerProps> = ({
  compact = false,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(() => soundEngine.getIsPlaying());
  const [currentSound, setCurrentSound] = useState<SoundType>(() => soundEngine.getCurrentType() || 'rain');
  const [volume, setVolume] = useState(() => Math.round(soundEngine.getVolume() * 100));

  const handleTogglePlay = () => {
    if (isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
    } else {
      soundEngine.play(currentSound, volume / 100);
      setIsPlaying(true);
    }
  };

  const handleSelectSound = (type: SoundType) => {
    setCurrentSound(type);
    if (isPlaying) {
      soundEngine.play(type, volume / 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val / 100);
  };

  const activePreset = SOUND_PRESETS.find(p => p.id === currentSound) || SOUND_PRESETS[0];

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-1.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs ${className}`}>
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isPlaying 
              ? 'bg-purple-600 text-white shadow-xs animate-pulse' 
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 shadow-2xs'
          }`}
          title={isPlaying ? 'Dừng âm thanh tập trung' : 'Phát âm thanh tập trung'}
          aria-label={isPlaying ? 'Dừng âm thanh' : 'Phát âm thanh'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        {/* Sound preset switchers */}
        <div className="flex items-center gap-1">
          {SOUND_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = currentSound === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectSound(preset.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  isSelected
                    ? `${preset.badgeBg} border shadow-2xs scale-102`
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={preset.subLabel}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? preset.color : 'text-slate-400'}`} />
                <span className="hidden sm:inline">{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Animated Visualizer bars */}
        {isPlaying && (
          <div className="hidden sm:flex items-end gap-0.5 h-3.5 px-1">
            <span className="w-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
            <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.1s] h-2" />
            <span className="w-1 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.2s] h-3.5" />
          </div>
        )}

        {/* Volume slider */}
        <div className="flex items-center gap-1.5 ml-1">
          <button
            onClick={() => {
              if (volume > 0) {
                setVolume(0);
                soundEngine.setVolume(0);
              } else {
                setVolume(60);
                soundEngine.setVolume(0.6);
              }
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title={volume === 0 ? 'Bật tiếng' : 'Tắt tiếng'}
          >
            {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-14 sm:w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            title={`Âm lượng: ${volume}%`}
          />
        </div>
      </div>
    );
  }

  // Full Expanded Card Layout
  return (
    <div className={`p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              Âm Thanh Tập Trung Pomodoro
            </h4>
            <p className="text-[10px] text-slate-400 font-medium">
              Offline 100% • Tự tổng hợp bằng Web Audio API
            </p>
          </div>
        </div>

        {/* Visualizer bars */}
        {isPlaying ? (
          <div className="flex items-end gap-1 h-4">
            <span className="w-1 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s] h-4" />
            <span className="w-1 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.1s] h-2.5" />
            <span className="w-1 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.2s] h-3.5" />
            <span className="w-1 bg-purple-300 rounded-full animate-bounce [animation-delay:-0.4s] h-2" />
          </div>
        ) : (
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
            Đang tắt
          </span>
        )}
      </div>

      {/* 4 Sound Modes Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {SOUND_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isSelected = currentSound === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelectSound(preset.id)}
              className={`flex items-center gap-2.5 p-2.5 rounded-2xl text-left border transition-all ${
                isSelected
                  ? `${preset.badgeBg} border-current shadow-xs scale-[1.02]`
                  : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isSelected ? 'bg-white/80 dark:bg-black/30' : 'bg-white dark:bg-slate-800'}`}>
                <Icon className={`w-4 h-4 ${preset.color}`} />
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-black truncate">{preset.label}</div>
                <div className="text-[10px] opacity-75 truncate">{preset.subLabel}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls Bar: Play + Volume */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <button
          onClick={handleTogglePlay}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl text-xs font-bold transition-all shadow-md ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/25'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/25 hover:scale-101'
          }`}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          <span>{isPlaying ? `Tạm dừng (${activePreset.label})` : `Phát ${activePreset.label}`}</span>
        </button>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
          <Volume2 className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            title={`Âm lượng: ${volume}%`}
          />
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 w-6 text-right">
            {volume}%
          </span>
        </div>
      </div>
    </div>
  );
};
