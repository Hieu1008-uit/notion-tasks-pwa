import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  GraduationCap, 
  HeartPulse, 
  Briefcase, 
  Rocket, 
  Clock, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Project, Task, TemplateBoard } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (newBoard: Project, newTasks: Task[]) => void;
}

const TEMPLATE_PRESETS: TemplateBoard[] = [
  {
    id: 'tmpl-uit-student',
    name: 'Sinh viên UIT - Đồ Án & Luyện Thi',
    description: 'Khung lịch trình ôn thi & làm đồ án chuẩn sinh viên Đại học Công nghệ Thông tin (UIT).',
    color: '#0284c7',
    pastelBg: '#bae6fd',
    textColor: '#0369a1',
    darkBg: '#0c4a6e',
    darkTextColor: '#7dd3fc',
    icon: 'book-open',
    tasks: [
      {
        title: 'Ôn tập kiến thức Công nghệ Java (Spring Boot & React)',
        priority: 'urgent',
        tag: 'Luyện thi',
        tagColor: '#0284c7',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '10:00',
        project: 'Sinh viên UIT - Đồ Án & Luyện Thi',
      },
      {
        title: 'Viết báo cáo Đồ án chuyên ngành & nộp bài tập lớn',
        priority: 'important',
        tag: 'Đồ án',
        tagColor: '#0284c7',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:30',
        endTime: '12:00',
        project: 'Sinh viên UIT - Đồ Án & Luyện Thi',
      },
      {
        title: 'Luyện 50 câu trắc nghiệm Kiến trúc máy tính & Hệ điều hành',
        priority: 'normal',
        tag: 'Ôn thi',
        tagColor: '#0284c7',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:30',
        project: 'Sinh viên UIT - Đồ Án & Luyện Thi',
      },
      {
        title: 'Họp nhóm đồ án qua Google Meet & phân chia sprint tuần',
        priority: 'important',
        tag: 'Nhóm',
        tagColor: '#0284c7',
        date: new Date().toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '17:30',
        project: 'Sinh viên UIT - Đồ Án & Luyện Thi',
      },
      {
        title: 'Review pull request & đóng gói Docker PWA',
        priority: 'normal',
        tag: 'Thực hành',
        tagColor: '#0284c7',
        date: new Date().toISOString().split('T')[0],
        startTime: '20:00',
        endTime: '21:30',
        project: 'Sinh viên UIT - Đồ Án & Luyện Thi',
      },
    ]
  },
  {
    id: 'tmpl-healthy-life',
    name: 'Thói Quen 21 Ngày Healthy Life',
    description: 'Xây dựng lối sống lành mạnh, năng lượng đỉnh cao, tăng cường thể chất và tâm trí minh mẫn.',
    color: '#059669',
    pastelBg: '#a7f3d0',
    textColor: '#065f46',
    darkBg: '#064e3b',
    darkTextColor: '#6ee7b7',
    icon: 'dumbbell',
    tasks: [
      {
        title: 'Uống 500ml nước ấm & giãn cơ Yoga chào buổi sáng',
        priority: 'important',
        tag: 'Sức khỏe',
        tagColor: '#059669',
        date: new Date().toISOString().split('T')[0],
        startTime: '07:00',
        endTime: '07:30',
        project: 'Thói Quen 21 Ngày Healthy Life',
      },
      {
        title: 'Chạy bộ 3km hoặc 30 phút Cardio buổi sáng',
        priority: 'urgent',
        tag: 'Thể thao',
        tagColor: '#059669',
        date: new Date().toISOString().split('T')[0],
        startTime: '07:30',
        endTime: '08:30',
        project: 'Thói Quen 21 Ngày Healthy Life',
      },
      {
        title: 'Chuẩn bị bữa trưa Eat Clean & bổ sung vitamin tổng hợp',
        priority: 'normal',
        tag: 'Dinh dưỡng',
        tagColor: '#059669',
        date: new Date().toISOString().split('T')[0],
        startTime: '11:30',
        endTime: '12:30',
        project: 'Thói Quen 21 Ngày Healthy Life',
      },
      {
        title: 'Nghỉ giải lao 10 phút, rời mắt màn hình & hít thở sâu',
        priority: 'normal',
        tag: 'Thư giãn',
        tagColor: '#059669',
        date: new Date().toISOString().split('T')[0],
        startTime: '15:00',
        endTime: '15:15',
        project: 'Thói Quen 21 Ngày Healthy Life',
      },
      {
        title: 'Đọc 15 trang sách phát triển bản thân & đi ngủ trước 23h',
        priority: 'important',
        tag: 'Thói quen',
        tagColor: '#059669',
        date: new Date().toISOString().split('T')[0],
        startTime: '21:30',
        endTime: '22:30',
        project: 'Thói Quen 21 Ngày Healthy Life',
      },
    ]
  },
  {
    id: 'tmpl-freelancer-pm',
    name: 'Freelancer & Quản Lý Dự Án',
    description: 'Quy trình chuẩn hóa làm việc với khách hàng, bàn giao sản phẩm và tối ưu thu nhập freelance.',
    color: '#d97706',
    pastelBg: '#fef3c7',
    textColor: '#92400e',
    darkBg: '#78350f',
    darkTextColor: '#fde68a',
    icon: 'coffee',
    tasks: [
      {
        title: 'Check email khách hàng & phản hồi yêu cầu mới (Triage inbox)',
        priority: 'urgent',
        tag: 'Khách hàng',
        tagColor: '#d97706',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:30',
        endTime: '09:30',
        project: 'Freelancer & Quản Lý Dự Án',
      },
      {
        title: 'Thiết kế UI/UX Dashboard theo phản hồi revision đợt 2',
        priority: 'urgent',
        tag: 'Design',
        tagColor: '#d97706',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:45',
        endTime: '12:00',
        project: 'Freelancer & Quản Lý Dự Án',
      },
      {
        title: 'Lập hóa đơn quyết toán Milestone 1 & gửi hợp đồng nghiệm thu',
        priority: 'important',
        tag: 'Tài chính',
        tagColor: '#d97706',
        date: new Date().toISOString().split('T')[0],
        startTime: '13:30',
        endTime: '14:30',
        project: 'Freelancer & Quản Lý Dự Án',
      },
      {
        title: 'Deploy bản demo lên Vercel/Netlify cho khách hàng nghiệm thu',
        priority: 'important',
        tag: 'Triển khai',
        tagColor: '#d97706',
        date: new Date().toISOString().split('T')[0],
        startTime: '15:00',
        endTime: '16:30',
        project: 'Freelancer & Quản Lý Dự Án',
      },
      {
        title: 'Lên kế hoạch to-do ngày mai & viết nhật ký năng suất',
        priority: 'normal',
        tag: 'Kế hoạch',
        tagColor: '#d97706',
        date: new Date().toISOString().split('T')[0],
        startTime: '17:00',
        endTime: '17:45',
        project: 'Freelancer & Quản Lý Dự Án',
      },
    ]
  },
  {
    id: 'tmpl-startup-growth',
    name: 'Khởi Nghiệp & Marketing Số (Growth Hacker)',
    description: 'Kế hoạch tăng trưởng người dùng, chạy chiến dịch truyền thông và tối ưu chuyển đổi.',
    color: '#9333ea',
    pastelBg: '#f3e8ff',
    textColor: '#6b21a8',
    darkBg: '#581c87',
    darkTextColor: '#d8b4fe',
    icon: 'sparkles',
    tasks: [
      {
        title: 'Phân tích chỉ số Google Analytics & Conversion Rate hôm qua',
        priority: 'urgent',
        tag: 'Analytics',
        tagColor: '#9333ea',
        date: new Date().toISOString().split('T')[0],
        startTime: '08:30',
        endTime: '09:30',
        project: 'Khởi Nghiệp & Marketing Số (Growth Hacker)',
      },
      {
        title: 'Viết bài chia sẻ case study lên LinkedIn & Threads',
        priority: 'important',
        tag: 'Content',
        tagColor: '#9333ea',
        date: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '11:30',
        project: 'Khởi Nghiệp & Marketing Số (Growth Hacker)',
      },
      {
        title: 'A/B Testing Landing Page & tối ưu nút Call-to-Action',
        priority: 'important',
        tag: 'CRO',
        tagColor: '#9333ea',
        date: new Date().toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '15:30',
        project: 'Khởi Nghiệp & Marketing Số (Growth Hacker)',
      },
      {
        title: 'Gửi bản tin Email Newsletter hàng tuần cho cộng đồng',
        priority: 'normal',
        tag: 'Newsletter',
        tagColor: '#9333ea',
        date: new Date().toISOString().split('T')[0],
        startTime: '16:00',
        endTime: '17:00',
        project: 'Khởi Nghiệp & Marketing Số (Growth Hacker)',
      },
    ]
  }
];

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(TEMPLATE_PRESETS[0].id);

  if (!isOpen) return null;

  const currentTemplate = TEMPLATE_PRESETS.find(t => t.id === selectedTemplateId) || TEMPLATE_PRESETS[0];

  const handleApply = (template: TemplateBoard) => {
    // Generate new Project Board
    const newBoard: Project = {
      id: `p-${Date.now()}`,
      name: template.name,
      description: template.description,
      color: template.color,
      pastelBg: template.pastelBg,
      textColor: template.textColor,
      darkBg: template.darkBg,
      darkTextColor: template.darkTextColor,
      streak: 1,
      history: {
        [new Date().toISOString().split('T')[0]]: 1
      },
      icon: template.icon
    };

    // Generate new tasks for today
    const newTasks: Task[] = template.tasks.map((t, idx) => ({
      ...t,
      id: `t-${Date.now()}-${idx}`,
      completed: false,
      date: new Date().toISOString().split('T')[0],
    }));

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: [template.color, '#60a5fa', '#34d399', '#f59e0b']
    });

    onApplyTemplate(newBoard, newTasks);
    onClose();
  };

  const getTemplateIcon = (id: string) => {
    switch (id) {
      case 'tmpl-uit-student': return GraduationCap;
      case 'tmpl-healthy-life': return HeartPulse;
      case 'tmpl-freelancer-pm': return Briefcase;
      case 'tmpl-startup-growth': return Rocket;
      default: return Layers;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 dark:border-slate-700 p-6 md:p-8 relative select-none"
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
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Kho Thư Viện Mẫu Công Việc
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                1-Click Setup
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Chọn mẫu có sẵn chuẩn khoa học để tự động tạo Board và nạp lịch trình công việc ngay tức thì
            </p>
          </div>
        </div>

        {/* Templates Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
          {TEMPLATE_PRESETS.map((tmpl) => {
            const Icon = getTemplateIcon(tmpl.id);
            const isSelected = tmpl.id === selectedTemplateId;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplateId(tmpl.id)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:bg-slate-700/40'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-2xs"
                    style={{ backgroundColor: tmpl.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                  {tmpl.name}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold mt-1">
                  {tmpl.tasks.length} công việc mẫu
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Template Preview Card */}
        <div 
          className="rounded-3xl p-6 border transition-all duration-300 mb-6"
          style={{
            backgroundColor: currentTemplate.pastelBg,
            borderColor: `${currentTemplate.color}40`,
            color: currentTemplate.textColor
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: currentTemplate.color }}
                />
                <h3 className="text-lg font-black tracking-tight">
                  {currentTemplate.name}
                </h3>
              </div>
              <p className="text-xs font-medium opacity-85 mt-1 max-w-lg">
                {currentTemplate.description}
              </p>
            </div>
            <span 
              className="px-3 py-1 rounded-full text-xs font-black text-white shadow-xs shrink-0"
              style={{ backgroundColor: currentTemplate.color }}
            >
              {currentTemplate.tasks.length} Tasks
            </span>
          </div>

          {/* List of Tasks in this template */}
          <div className="space-y-2 mt-4">
            {currentTemplate.tasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-black/30 backdrop-blur-xs border border-white/50 dark:border-white/10 text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: currentTemplate.color }} />
                  <span className="truncate">{task.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] opacity-80">
                  <Clock className="w-3 h-3" />
                  <span>{task.startTime} - {task.endTime}</span>
                  <span 
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white uppercase ml-1"
                    style={{ backgroundColor: currentTemplate.color }}
                  >
                    {task.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            Hủy bỏ
          </button>

          <button
            onClick={() => handleApply(currentTemplate)}
            style={{ backgroundColor: currentTemplate.color }}
            className="px-6 py-3 rounded-2xl text-white font-extrabold text-xs shadow-md hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Áp dụng mẫu này ngay</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
