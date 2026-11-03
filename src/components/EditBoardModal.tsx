import React, { useState, useEffect } from 'react';
import { X, Trash2, Palette, Check, Sparkles, BookOpen, Code, Droplets, Dumbbell, Coffee, Folder } from 'lucide-react';
import type { Project, PastelThemePreset } from '../types';
import { PASTEL_COLOR_PRESETS } from '../types';

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSave: (updatedProject: Project) => void;
  onDelete: (projectId: string) => void;
  totalProjects: number;
}

export const EditBoardModal: React.FC<EditBoardModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
  onDelete,
  totalProjects,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<PastelThemePreset>(PASTEL_COLOR_PRESETS[0]);
  const [selectedIcon, setSelectedIcon] = useState<Project['icon']>('folder');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      const match = PASTEL_COLOR_PRESETS.find(p => p.pastelBg === project.pastelBg) || {
        name: 'Custom',
        color: project.color,
        pastelBg: project.pastelBg,
        textColor: project.textColor,
        darkBg: project.darkBg || '#1e293b',
        darkTextColor: project.darkTextColor || '#f8fafc',
      };
      setSelectedPreset(match);
      setSelectedIcon(project.icon || 'folder');
      setConfirmDelete(false);
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      ...project,
      name: name.trim(),
      description: description.trim(),
      color: selectedPreset.color,
      pastelBg: selectedPreset.pastelBg,
      textColor: selectedPreset.textColor,
      darkBg: selectedPreset.darkBg,
      darkTextColor: selectedPreset.darkTextColor,
      icon: selectedIcon,
    });
    onClose();
  };

  const handleDelete = () => {
    if (totalProjects <= 1) {
      alert('Bạn phải giữ lại ít nhất 1 board!');
      return;
    }
    onDelete(project.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col gap-5 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
              style={{ backgroundColor: selectedPreset.pastelBg, color: selectedPreset.textColor }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Chỉnh sửa Board
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-400">
                Tùy chỉnh màu sắc pastel, tên và nội dung
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Board Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Tên Board
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Công nghệ Java (UIT), Tiếng Anh IELTS..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-900/50"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Mô tả / Ghi chú
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục tiêu của board này..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-900/50 resize-none"
            />
          </div>

          {/* Color Palette Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Chọn màu Pastel của Board
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PASTEL_COLOR_PRESETS.map((preset) => {
                const isSelected = selectedPreset.pastelBg === preset.pastelBg;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    style={{ backgroundColor: preset.pastelBg, color: preset.textColor }}
                    className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all border ${
                      isSelected 
                        ? 'border-slate-800 dark:border-white scale-105 shadow-md ring-2 ring-blue-500/30' 
                        : 'border-white/60 dark:border-slate-700/60 hover:scale-102 hover:brightness-95'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span className="truncate text-[11px]">{preset.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
              Biểu tượng đại diện
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: 'folder', icon: <Folder className="w-4 h-4" /> },
                { id: 'code', icon: <Code className="w-4 h-4" /> },
                { id: 'droplets', icon: <Droplets className="w-4 h-4" /> },
                { id: 'book-open', icon: <BookOpen className="w-4 h-4" /> },
                { id: 'sparkles', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'coffee', icon: <Coffee className="w-4 h-4" /> },
                { id: 'dumbbell', icon: <Dumbbell className="w-4 h-4" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIcon(item.id as Project['icon'])}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    selectedIcon === item.id 
                      ? 'bg-blue-600 text-white shadow-sm scale-110' 
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            {confirmDelete ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Xác nhận xóa!
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-medium"
                >
                  Hủy
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-semibold py-1.5 px-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Xóa board này"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Xóa board</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition-colors"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-102"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
