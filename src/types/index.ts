export type Priority = 'urgent' | 'important' | 'normal' | 'end_of_day';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  difficulty?: Difficulty;
  project?: string;
  tag: string;
  tagColor?: string;
  date: string;
  startTime: string;
  endTime: string;
  completed: boolean;
  completedAt?: string;
  timeBlockId?: string;
}

export interface Habit {
  id: string;
  name: string;
  icon: 'droplets' | 'book-open' | 'code' | 'dumbbell' | 'coffee' | 'sparkles' | 'folder';
  color: string;
  streak: number;
  history: Record<string, number>;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  pastelBg: string;
  textColor: string;
  darkBg?: string;
  darkTextColor?: string;
  streak: number;
  history: Record<string, number>;
  icon?: 'droplets' | 'book-open' | 'code' | 'dumbbell' | 'coffee' | 'sparkles' | 'folder';
}

export interface PastelThemePreset {
  name: string;
  color: string;
  pastelBg: string;
  textColor: string;
  darkBg: string;
  darkTextColor: string;
}

export const PASTEL_COLOR_PRESETS: PastelThemePreset[] = [
  { name: 'Mint Green', color: '#059669', pastelBg: '#a7f3d0', textColor: '#065f46', darkBg: '#064e3b', darkTextColor: '#6ee7b7' },
  { name: 'Sky Blue', color: '#0284c7', pastelBg: '#bae6fd', textColor: '#0369a1', darkBg: '#0c4a6e', darkTextColor: '#7dd3fc' },
  { name: 'Lavender', color: '#4f46e5', pastelBg: '#e0e7ff', textColor: '#3730a3', darkBg: '#312e81', darkTextColor: '#a5b4fc' },
  { name: 'Blush Rose', color: '#e11d48', pastelBg: '#ffe4e8', textColor: '#9f1239', darkBg: '#881337', darkTextColor: '#fda4af' },
  { name: 'Butter Yellow', color: '#d97706', pastelBg: '#fef3c7', textColor: '#92400e', darkBg: '#78350f', darkTextColor: '#fde68a' },
  { name: 'Warm Peach', color: '#ea580c', pastelBg: '#ffedd5', textColor: '#9a3412', darkBg: '#7c2d12', darkTextColor: '#fed7aa' },
  { name: 'Soft Purple', color: '#9333ea', pastelBg: '#f3e8ff', textColor: '#6b21a8', darkBg: '#581c87', darkTextColor: '#d8b4fe' },
  { name: 'Fresh Sage', color: '#16a34a', pastelBg: '#dcfce7', textColor: '#166534', darkBg: '#14532d', darkTextColor: '#86efac' },
];

export type TabType = 'today' | 'todo' | 'contributions';
export type ThemeMode = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  provider: 'google' | 'phone' | 'email';
  createdAt: string;
  isPro?: boolean;
  proPlan?: 'monthly' | 'lifetime';
  proSince?: string;
}

export type SoundType = 'rain' | 'waves' | 'cafe' | 'lofi';

export interface TemplateBoard {
  id: string;
  name: string;
  description: string;
  color: string;
  pastelBg: string;
  textColor: string;
  darkBg?: string;
  darkTextColor?: string;
  icon: 'book-open' | 'dumbbell' | 'sparkles' | 'coffee' | 'folder' | 'code' | 'droplets';
  tasks: Array<Omit<Task, 'id' | 'completed'>>;
}

export interface UserData {
  tasks: Task[];
  projects: Project[];
  totalFocusSeconds: number;
  lastSyncedAt: string;
}
