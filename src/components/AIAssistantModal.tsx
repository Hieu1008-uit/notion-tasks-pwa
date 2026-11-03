import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  Clock, 
  Trash2, 
  Calendar, 
  Lightbulb, 
  ArrowRight,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Task, Project, Priority } from '../types';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlan: (board: Project, tasks: Task[]) => void;
  existingProjects: Project[];
}

interface GeneratedTask {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  priority: Priority;
  tag: string;
}

const QUICK_PROMPTS = [
  'Ôn thi cuối kỳ môn Công nghệ Java trong 7 ngày',
  'Hoàn thành đồ án chuyên ngành và nộp bài đúng hạn',
  'Lộ trình 14 ngày làm chủ Docker và Cloud DevOps',
  'Thói quen dậy sớm 06:00 & chạy bộ rèn luyện sức khỏe',
  'Luyện phát âm tiếng Anh và 50 từ vựng IELTS mỗi ngày'
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyPlan,
  existingProjects,
}) => {
  const [goalInput, setGoalInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [boardName, setBoardName] = useState('');

  if (!isOpen) return null;

  // Smart heuristic decomposition engine
  const handleGenerateSchedule = (customPrompt?: string) => {
    const prompt = (customPrompt || goalInput).trim();
    if (!prompt) return;

    setIsGenerating(true);
    setBoardName(`AI: ${prompt.length > 25 ? prompt.slice(0, 25) + '...' : prompt}`);

    setTimeout(() => {
      const lower = prompt.toLowerCase();
      let tasks: GeneratedTask[] = [];

      if (lower.includes('java') || lower.includes('lập trình') || lower.includes('code') || lower.includes('devops') || lower.includes('docker')) {
        tasks = [
          {
            id: `ai-${Date.now()}-1`,
            title: 'Hệ thống hóa kiến thức lý thuyết cốt lõi & mindmap',
            startTime: '08:00',
            endTime: '09:30',
            priority: 'urgent',
            tag: 'Lý thuyết'
          },
          {
            id: `ai-${Date.now()}-2`,
            title: 'Thực hành code bài tập mẫu & sửa lỗi compiler/runtime',
            startTime: '10:00',
            endTime: '12:00',
            priority: 'urgent',
            tag: 'Thực hành'
          },
          {
            id: `ai-${Date.now()}-3`,
            title: 'Giải 3 đề thi thử các năm trước bấm giờ 90 phút',
            startTime: '14:00',
            endTime: '16:00',
            priority: 'important',
            tag: 'Luyện đề'
          },
          {
            id: `ai-${Date.now()}-4`,
            title: 'Đánh giá lại các câu sai & ghi chú vào sổ tay kiến thức',
            startTime: '16:30',
            endTime: '17:30',
            priority: 'normal',
            tag: 'Review'
          },
          {
            id: `ai-${Date.now()}-5`,
            title: 'Nghỉ ngơi, đọc tài liệu nâng cao & chuẩn bị cho ngày tiếp theo',
            startTime: '20:30',
            endTime: '21:30',
            priority: 'normal',
            tag: 'Tổng kết'
          }
        ];
      } else if (lower.includes('đồ án') || lower.includes('báo cáo') || lower.includes('nộp')) {
        tasks = [
          {
            id: `ai-${Date.now()}-1`,
            title: 'Rà soát danh sách yêu cầu (SRS) & tổng hợp tài liệu',
            startTime: '08:30',
            endTime: '10:00',
            priority: 'urgent',
            tag: 'Tài liệu'
          },
          {
            id: `ai-${Date.now()}-2`,
            title: 'Viết chương 3: Hiện thực hệ thống & sơ đồ kiến trúc',
            startTime: '10:15',
            endTime: '12:00',
            priority: 'urgent',
            tag: 'Báo cáo'
          },
          {
            id: `ai-${Date.now()}-3`,
            title: 'Kiểm thử toàn diện các chức năng và chụp ảnh minh họa',
            startTime: '14:00',
            endTime: '16:00',
            priority: 'important',
            tag: 'Kiểm thử'
          },
          {
            id: `ai-${Date.now()}-4`,
            title: 'Đóng gói mã nguồn, kiểm tra file nén và nộp bài lên portal',
            startTime: '16:30',
            endTime: '17:30',
            priority: 'urgent',
            tag: 'Nộp bài'
          }
        ];
      } else if (lower.includes('sức khỏe') || lower.includes('chạy bộ') || lower.includes('dậy sớm') || lower.includes('gym')) {
        tasks = [
          {
            id: `ai-${Date.now()}-1`,
            title: 'Thức dậy 06:00, uống nước chanh ấm & khởi động khớp',
            startTime: '06:00',
            endTime: '06:30',
            priority: 'urgent',
            tag: 'Buổi sáng'
          },
          {
            id: `ai-${Date.now()}-2`,
            title: 'Chạy bộ 3-5km ngoài trời hoặc tập bài tập sức bền',
            startTime: '06:30',
            endTime: '07:30',
            priority: 'urgent',
            tag: 'Thể thao'
          },
          {
            id: `ai-${Date.now()}-3`,
            title: 'Bữa sáng giàu protein & năng lượng sạch cho ngày mới',
            startTime: '07:45',
            endTime: '08:30',
            priority: 'normal',
            tag: 'Dinh dưỡng'
          },
          {
            id: `ai-${Date.now()}-4`,
            title: 'Đi bộ thư giãn 20 phút & bài tập hít thở giảm stress',
            startTime: '17:30',
            endTime: '18:15',
            priority: 'normal',
            tag: 'Thư giãn'
          },
          {
            id: `ai-${Date.now()}-5`,
            title: 'Tắt màn hình thiết bị điện tử & chuẩn bị ngủ trước 22:30',
            startTime: '22:00',
            endTime: '22:30',
            priority: 'important',
            tag: 'Giấc ngủ'
          }
        ];
      } else if (lower.includes('tiếng anh') || lower.includes('ielts') || lower.includes('ngoại ngữ')) {
        tasks = [
          {
            id: `ai-${Date.now()}-1`,
            title: 'Học 30 từ vựng chuyên ngành qua Anki / Flashcards',
            startTime: '07:30',
            endTime: '08:30',
            priority: 'urgent',
            tag: 'Từ vựng'
          },
          {
            id: `ai-${Date.now()}-2`,
            title: 'Luyện nghe 1 bài Podcast BBC/TED và ghi chú lại từ khóa',
            startTime: '11:30',
            endTime: '12:30',
            priority: 'important',
            tag: 'Kỹ năng nghe'
          },
          {
            id: `ai-${Date.now()}-3`,
            title: 'Làm 1 bài Reading Cam IELTS bấm giờ chính xác 20 phút',
            startTime: '14:30',
            endTime: '15:30',
            priority: 'urgent',
            tag: 'Luyện đề'
          },
          {
            id: `ai-${Date.now()}-4`,
            title: 'Tập nói trước gương theo phương pháp Shadowing 15 phút',
            startTime: '20:00',
            endTime: '20:45',
            priority: 'important',
            tag: 'Nói'
          }
        ];
      } else {
        // Generic smart breakdown
        tasks = [
          {
            id: `ai-${Date.now()}-1`,
            title: `Nghiên cứu & lập kế hoạch chi tiết cho: ${prompt}`,
            startTime: '08:30',
            endTime: '10:00',
            priority: 'urgent',
            tag: 'Khởi động'
          },
          {
            id: `ai-${Date.now()}-2`,
            title: 'Tập trung sâu (Deep Work Block 1) vào nội dung quan trọng nhất',
            startTime: '10:15',
            endTime: '12:00',
            priority: 'urgent',
            tag: 'Deep Work'
          },
          {
            id: `ai-${Date.now()}-3`,
            title: 'Xử lý các đầu việc phụ trợ & tương tác phản hồi',
            startTime: '13:30',
            endTime: '15:00',
            priority: 'important',
            tag: 'Thực thi'
          },
          {
            id: `ai-${Date.now()}-4`,
            title: 'Tập trung sâu (Deep Work Block 2) & hoàn thiện sản phẩm',
            startTime: '15:30',
            endTime: '17:30',
            priority: 'urgent',
            tag: 'Deep Work'
          },
          {
            id: `ai-${Date.now()}-5`,
            title: 'Đánh giá tiến độ hôm nay & lên danh sách to-do ngày mai',
            startTime: '20:30',
            endTime: '21:15',
            priority: 'normal',
            tag: 'Tổng kết'
          }
        ];
      }

      setGeneratedTasks(tasks);
      setIsGenerating(false);
    }, 700);
  };

  const handleDeleteTask = (id: string) => {
    setGeneratedTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleApply = () => {
    if (generatedTasks.length === 0) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const finalBoardName = boardName.trim() || 'AI Schedule';

    // Check if board exists or create new one
    let targetBoard = existingProjects.find(p => p.name.toLowerCase() === finalBoardName.toLowerCase());
    
    if (!targetBoard) {
      targetBoard = {
        id: `p-${Date.now()}`,
        name: finalBoardName,
        description: `Lịch trình được tối ưu bởi AI: ${goalInput}`,
        color: '#4f46e5',
        pastelBg: '#e0e7ff',
        textColor: '#3730a3',
        darkBg: '#312e81',
        darkTextColor: '#a5b4fc',
        streak: 1,
        history: { [todayStr]: 1 },
        icon: 'sparkles'
      };
    }

    const tasksToApply: Task[] = generatedTasks.map((gt, idx) => ({
      id: `t-${Date.now()}-${idx}`,
      title: gt.title,
      date: todayStr,
      startTime: gt.startTime,
      endTime: gt.endTime,
      priority: gt.priority,
      tag: gt.tag,
      tagColor: targetBoard.color,
      project: targetBoard.name,
      completed: false,
    }));

    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#38bdf8', '#34d399', '#f43f5e']
    });

    onApplyPlan(targetBoard, tasksToApply);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Trợ Lý AI Lên Lịch Thông Minh
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                AI Powered
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Nhập mục tiêu của bạn, AI sẽ tự động phân rã thành các khung giờ tập trung khoa học
            </p>
          </div>
        </div>

        {/* Goal Input Field */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Mục tiêu của bạn là gì?</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="VD: Ôn thi cuối kỳ môn Java trong 7 ngày..."
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleGenerateSchedule();
              }}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={() => handleGenerateSchedule()}
              disabled={isGenerating || !goalInput.trim()}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-500/25 disabled:opacity-50 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang phân tích...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Phân rã</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-400 mb-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Gợi ý mục tiêu nhanh:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setGoalInput(prompt);
                  handleGenerateSchedule(prompt);
                }}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-indigo-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Generated Schedule Preview Section */}
        {generatedTasks.length > 0 && (
          <div className="space-y-4 mb-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                  Lịch trình đề xuất cho Hôm Nay ({generatedTasks.length} nhiệm vụ)
                </span>
              </div>
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="Tên Board"
                className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 max-w-[180px]"
                title="Tên Board lưu trữ các task này"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {generatedTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/60 dark:bg-slate-900/40 border border-indigo-100 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                      {t.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{t.startTime} - {t.endTime}</span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {t.tag}
                    </span>

                    <button
                      onClick={() => handleDeleteTask(t.id)}
                      className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-slate-400 hover:text-red-500 transition-colors"
                      title="Xóa công việc này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Advice Banner */}
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                <strong>Lời khuyên từ AI:</strong> Lịch trình được thiết kế theo phương pháp Pomodoro & Deep Work xen kẽ các khoảng nghỉ ngắn 15 phút để duy trì mức năng lượng cao nhất.
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Đóng
          </button>

          {generatedTasks.length > 0 && (
            <button
              onClick={handleApply}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Gắn vào Schedule Today & Tạo Board</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
