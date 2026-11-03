import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import type { Task, Priority, Difficulty, Project } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  defaultTimeSlot?: string;
  projects: Project[];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  defaultTimeSlot,
  projects,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('important');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [project, setProject] = useState(projects[0]?.name || 'Công nghệ Java (UIT)');
  const [tag, setTag] = useState('Study');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(defaultTimeSlot || '09:00');
  const [endTime, setEndTime] = useState('10:30');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let tagColor = '#059669';
    if (tag.toLowerCase().includes('water') || tag.toLowerCase().includes('nước')) tagColor = '#0284c7';
    if (tag.toLowerCase().includes('study') || tag.toLowerCase().includes('học')) tagColor = '#4f46e5';

    onSaveTask({
      title,
      description,
      priority,
      difficulty,
      project,
      tag,
      tagColor,
      date,
      startTime,
      endTime,
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Create New Task</h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Add to categorised boards & schedule</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 dark:text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Finish Spring Boot Security Assignment..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 font-semibold"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Description / Notes</label>
            <textarea
              rows={2}
              placeholder="Notes, steps, or reference links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 resize-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Board / Project</label>
              <select
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-bold"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.name} className="dark:bg-slate-800">{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-bold"
              >
                <option value="easy" className="dark:bg-slate-800">●○○ Easy</option>
                <option value="medium" className="dark:bg-slate-800">●●○ Medium</option>
                <option value="hard" className="dark:bg-slate-800">●●● Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-bold"
              >
                <option value="urgent" className="dark:bg-slate-800">Urgent</option>
                <option value="important" className="dark:bg-slate-800">Important</option>
                <option value="normal" className="dark:bg-slate-800">Normal</option>
                <option value="end_of_day" className="dark:bg-slate-800">End of Day</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Tag</label>
              <input
                type="text"
                placeholder="e.g. Study, Work..."
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-bold"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Allocation (Auto-syncs to Today schedule)</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">Start</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">End</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow-md shadow-blue-500/30 transition-all"
            >
              Save Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
