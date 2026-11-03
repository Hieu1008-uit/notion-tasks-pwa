import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Sparkles, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Volume2, 
  HelpCircle,
  Folder,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, Project } from '../types';

interface VoiceTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBatchTasks: (tasks: Array<Omit<Task, 'id' | 'completed'>>) => void;
  projects: Project[];
  currentProjectName?: string;
}

interface ParsedTaskPreview {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  project: string;
  tag: string;
  tagColor?: string;
  priority: 'urgent' | 'important' | 'normal' | 'end_of_day';
}

// Sample Voice Presets for quick 1-click test
const VOICE_PRESETS = [
  'Học đồ án Java lúc 8h sáng, chiều 14h đi thư viện UIT mượn sách, tối 20h ôn thi IELTS',
  '9h sáng họp nhóm công nghệ mới, 15h làm bài tập hệ điều hành, 19h30 tập gym rèn luyện',
  '7h30 ăn sáng cà phê và đọc tin tức công nghệ, 10h review code pull request, 16h học tiếng Nhật'
];

export const VoiceTaskModal: React.FC<VoiceTaskModalProps> = ({
  isOpen,
  onClose,
  onAddBatchTasks,
  projects,
  currentProjectName,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  });
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [parsedTasks, setParsedTasks] = useState<ParsedTaskPreview[]>([]);
  const recognitionRef = useRef<any>(null);
  const parseRef = useRef<(text: string) => void>(() => {});

  // Keep parser ref up to date
  useEffect(() => {
    parseRef.current = parseVietnameseText;
  });

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'vi-VN';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        const trimmed = currentText.trim();
        setTranscript(trimmed);
        parseRef.current(trimmed);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setSpeechError('Trình duyệt chưa được cấp quyền micro. Bạn có thể gõ hoặc dán văn bản bên dưới.');
        } else if (event.error === 'no-speech') {
          // just quiet, keep going
        } else {
          setSpeechError(`Lỗi nhận diện (${event.error}). Bạn có thể nhập tay.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Web Speech API initialization error:', e);
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Stop listening when modal closes
  useEffect(() => {
    if (!isOpen && isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  }, [isOpen, isListening]);

  // Vietnamese NLP Parsing function
  const parseVietnameseText = useCallback((rawText: string) => {
    if (!rawText.trim()) {
      setParsedTasks([]);
      return;
    }

    // Split by commas, semicolons, newlines, or connectives (sau đó, rồi, tiếp theo, và)
    const rawSegments = rawText
      .split(/[\n;]|,\s*(?=(?:lúc|vào lúc|chiều|tối|sáng|\d{1,2}h|\d{1,2}:)|(?:sau đó|rồi|tiếp theo))/i)
      .map(s => s.trim())
      .filter(s => s.length > 3);

    const defaultProject = projects.find(p => p.name === currentProjectName) || projects[0] || {
      id: 'p-1',
      name: 'General',
      color: '#059669',
      pastelBg: '#a7f3d0',
      textColor: '#065f46',
      streak: 0,
      history: {}
    };

    const results: ParsedTaskPreview[] = [];
    let fallbackHour = 8;

    rawSegments.forEach((segment, idx) => {
      let title = segment;
      let startHour = fallbackHour;
      let startMinute = 0;
      let hasExplicitTime = false;

      // Clean connectives at the beginning
      title = title.replace(/^(sau đó|rồi|tiếp theo|và|kế tiếp)\s*,?\s*/i, '');

      // Check for periods of the day: sáng, chiều, tối, trưa
      const isMorning = /sáng/i.test(title);
      const isAfternoon = /chiều/i.test(title);
      const isEvening = /tối|đêm/i.test(title);
      const isNoon = /trưa/i.test(title);

      // Match time patterns:
      const timeMatch1 = title.match(/(?:lúc|vào lúc)?\s*(\d{1,2})\s*h\s*(\d{2})?/i);
      const timeMatch2 = title.match(/(?:lúc|vào lúc)?\s*(\d{1,2}):(\d{2})/i);
      const timeMatch3 = title.match(/(?:lúc|vào lúc)?\s*(\d{1,2})\s*giờ\s*(\d{2})?/i);

      if (timeMatch1) {
        startHour = parseInt(timeMatch1[1], 10);
        startMinute = timeMatch1[2] ? parseInt(timeMatch1[2], 10) : 0;
        hasExplicitTime = true;
        title = title.replace(timeMatch1[0], ' ');
      } else if (timeMatch2) {
        startHour = parseInt(timeMatch2[1], 10);
        startMinute = parseInt(timeMatch2[2], 10);
        hasExplicitTime = true;
        title = title.replace(timeMatch2[0], ' ');
      } else if (timeMatch3) {
        startHour = parseInt(timeMatch3[1], 10);
        startMinute = timeMatch3[2] ? parseInt(timeMatch3[2], 10) : 0;
        hasExplicitTime = true;
        title = title.replace(timeMatch3[0], ' ');
      }

      // Adjust for chiều / tối if hour is 1..11
      if ((isAfternoon || isEvening) && startHour < 12) {
        startHour += 12;
      } else if (isNoon && startHour === 12) {
        // 12:00
      } else if (isMorning && startHour === 12) {
        startHour = 0;
      }

      // Remove time keywords from title for cleaner display
      title = title
        .replace(/(?:^|\s+)(sáng|chiều|tối|trưa|đêm|lúc|vào lúc|khoảng)(?=\s+|$)/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Fallback if title became too short
      if (!title) {
        title = `Công việc ${idx + 1}`;
      } else {
        // Capitalize first letter
        title = title.charAt(0).toUpperCase() + title.slice(1);
      }

      // Format start and end times (45 min default duration)
      const formattedStartH = Math.min(23, Math.max(0, startHour)).toString().padStart(2, '0');
      const formattedStartM = Math.min(59, Math.max(0, startMinute)).toString().padStart(2, '0');
      const startTime = `${formattedStartH}:${formattedStartM}`;

      const totalEndMinutes = startHour * 60 + startMinute + 45;
      const endH = Math.floor(totalEndMinutes / 60) % 24;
      const endM = totalEndMinutes % 60;
      const endTime = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

      // Project heuristic auto-mapping
      let matchedProject = defaultProject;
      const lowerTitle = title.toLowerCase();

      for (const p of projects) {
        const pLower = p.name.toLowerCase();
        if (lowerTitle.includes(pLower)) {
          matchedProject = p;
          break;
        }
      }

      if (matchedProject === defaultProject) {
        if (/java|code|lập trình|đồ án|react|python|debug|git/i.test(lowerTitle)) {
          matchedProject = projects.find(p => /đồ án|code|dev|học/i.test(p.name)) || defaultProject;
        } else if (/ielts|tiếng anh|ngoại ngữ|từ vựng|listening|reading/i.test(lowerTitle)) {
          matchedProject = projects.find(p => /ielts|anh|học/i.test(p.name)) || defaultProject;
        } else if (/gym|thể dục|chạy|bơi|sức khỏe|yoga/i.test(lowerTitle)) {
          matchedProject = projects.find(p => /gym|khỏe|health/i.test(p.name)) || defaultProject;
        }
      }

      results.push({
        id: `voice-task-${Date.now()}-${idx}`,
        title,
        startTime,
        endTime,
        project: matchedProject.name,
        tag: matchedProject.name,
        tagColor: matchedProject.color,
        priority: 'normal'
      });

      // Advance fallback hour for next item if no explicit time
      if (!hasExplicitTime) {
        fallbackHour = (fallbackHour + 2) % 24;
      } else {
        fallbackHour = Math.min(22, startHour + 2);
      }
    });

    setParsedTasks(results);
  }, [projects, currentProjectName]);

  const handleUpdateTranscript = (newText: string) => {
    setTranscript(newText);
    parseVietnameseText(newText);
  };

  const handleToggleListening = () => {
    if (!speechSupported) return;

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      setSpeechError(null);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Error starting speech recognition:', e);
          setIsListening(false);
        }
      }
    }
  };

  const handleUpdateTask = (id: string, field: keyof ParsedTaskPreview, value: any) => {
    setParsedTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (field === 'project') {
          const found = projects.find(p => p.name === value);
          return { ...t, project: value, tag: value, tagColor: found?.color || t.tagColor };
        }
        return { ...t, [field]: value };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setParsedTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAddNewTask = () => {
    const defaultProject = projects.find(p => p.name === currentProjectName) || projects[0] || {
      id: 'p-1',
      name: 'General',
      color: '#059669'
    };
    const newTask: ParsedTaskPreview = {
      id: `voice-task-${Date.now()}`,
      title: 'Công việc mới',
      startTime: '09:00',
      endTime: '09:45',
      project: defaultProject.name,
      tag: defaultProject.name,
      tagColor: defaultProject.color,
      priority: 'normal'
    };
    setParsedTasks(prev => [...prev, newTask]);
  };

  const handleScheduleAll = () => {
    if (parsedTasks.length === 0) return;

    const todayStr = new Date().toISOString().split('T')[0];

    const tasksToAdd: Array<Omit<Task, 'id' | 'completed'>> = parsedTasks.map(item => ({
      title: item.title,
      startTime: item.startTime,
      endTime: item.endTime,
      project: item.project,
      tag: item.tag,
      tagColor: item.tagColor,
      priority: item.priority,
      date: todayStr
    }));

    onAddBatchTasks(tasksToAdd);

    // Cheerful Confetti
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899']
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 text-white flex items-center justify-center shadow-lg shadow-pink-400/25 shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Lên Lịch Bằng Giọng Nói & Tự Nhiên
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-2xs">
                AI Voice
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Nói tự nhiên một câu dài — AI tự động nhận diện khung giờ và chia thành các task hôm nay
            </p>
          </div>
        </div>

        {/* Big Glow Microphone Button Section */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-rose-50/60 to-orange-50/40 dark:from-slate-900/40 dark:to-slate-800/40 border border-rose-200/50 dark:border-rose-900/30 mb-6">
          <div className="relative">
            {/* Animated pulsating wave rings when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full bg-rose-400/30 animate-ping duration-1000" />
                <div className="absolute -inset-2 rounded-full bg-rose-400/20 animate-pulse duration-700" />
              </>
            )}

            <button
              onClick={handleToggleListening}
              disabled={!speechSupported}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white shadow-rose-500/40 scale-110 ring-4 ring-rose-300 dark:ring-rose-700 animate-pulse'
                  : 'bg-white dark:bg-slate-700 text-rose-500 hover:text-rose-600 shadow-slate-300/40 dark:shadow-black/40 hover:scale-105 active:scale-95'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? 'Bấm để dừng nghe' : 'Bấm để bắt đầu nói tiếng Việt'}
            >
              {isListening ? (
                <Mic className="w-9 h-9 stroke-[2.5]" />
              ) : (
                <MicOff className="w-8 h-8 opacity-75" />
              )}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isListening 
                ? '🔴 Đang lắng nghe tiếng Việt... Hãy nói to rõ' 
                : 'Nhấn vào Micro để bắt đầu nói'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Hỗ trợ giọng nói tiếng Việt chuẩn xác (Chrome, Edge, Safari, Mobile PWA)
            </p>
          </div>

          {speechError && (
            <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>{speechError}</span>
            </div>
          )}
        </div>

        {/* Input Text Box (Fallback / Realtime Transcript / Manual Typing) */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Nội dung nhận diện hoặc nhập tay</span>
            </label>
            {transcript && (
              <button
                onClick={() => handleUpdateTranscript('')}
                className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                Xóa văn bản
              </button>
            )}
          </div>

          <textarea
            rows={3}
            value={transcript}
            onChange={(e) => handleUpdateTranscript(e.target.value)}
            placeholder="Ví dụ: 8h sáng học đồ án Java, chiều 14h đi thư viện UIT mượn sách, tối 20h học IELTS..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium resize-none shadow-2xs"
          />

          {/* Quick Presets for Demo */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Thử nhanh câu mẫu:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {VOICE_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleUpdateTranscript(preset)}
                  className="text-[11px] text-left px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-600 transition-all truncate max-w-full"
                >
                  ✨ "{preset.slice(0, 48)}..."
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Parsed Tasks Preview List */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Các Task Được Bóc Tách Tự Động ({parsedTasks.length})
              </h3>
            </div>
            <button
              onClick={handleAddNewTask}
              className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Thêm task nữa</span>
            </button>
          </div>

          {parsedTasks.length === 0 ? (
            <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400 font-medium">
              Chưa có task nào được bóc tách. Hãy bấm Micro nói hoặc chọn câu mẫu bên trên!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {parsedTasks.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateTask(item.id, 'title', e.target.value)}
                      className="w-full text-xs font-bold text-slate-800 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-rose-500 focus:outline-none"
                    />
                    
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {/* Time Pickers */}
                      <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-lg">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <input
                          type="time"
                          value={item.startTime}
                          onChange={(e) => handleUpdateTask(item.id, 'startTime', e.target.value)}
                          className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={item.endTime}
                          onChange={(e) => handleUpdateTask(item.id, 'endTime', e.target.value)}
                          className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none"
                        />
                      </div>

                      {/* Project Dropdown */}
                      <div className="flex items-center gap-1">
                        <Folder className="w-3 h-3 text-slate-400" />
                        <select
                          value={item.project}
                          onChange={(e) => handleUpdateTask(item.id, 'project', e.target.value)}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-none focus:outline-none"
                        >
                          {projects.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors self-end sm:self-center"
                    title="Xóa task này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleScheduleAll}
            disabled={parsedTasks.length === 0}
            className="w-full flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Xếp tất cả ({parsedTasks.length} task) vào Schedule Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            Hủy bỏ
          </button>
        </div>
      </div>
    </div>
  );
};
