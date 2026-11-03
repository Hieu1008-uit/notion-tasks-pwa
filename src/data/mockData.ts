import type { Task, Project } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  { 
    id: 'p-1', 
    name: 'Công nghệ Java (UIT)', 
    description: 'Môn học chuyên ngành: Spring Boot, Microservices, JPA & Hibernate',
    color: '#059669', 
    pastelBg: '#a7f3d0', 
    textColor: '#065f46',
    darkBg: '#064e3b',
    darkTextColor: '#6ee7b7',
    streak: 0,
    history: {},
    icon: 'code'
  },
  { 
    id: 'p-2', 
    name: 'Thói quen hàng ngày', 
    description: 'Theo dõi mục tiêu uống đủ 2L nước, rèn luyện sức khỏe mỗi ngày',
    color: '#0284c7', 
    pastelBg: '#bae6fd', 
    textColor: '#0369a1',
    darkBg: '#0c4a6e',
    darkTextColor: '#7dd3fc',
    streak: 0,
    history: {},
    icon: 'droplets'
  },
  { 
    id: 'p-3', 
    name: 'Kế hoạch học tập & Ý tưởng', 
    description: 'Lập kế hoạch đồ án, ôn tập các chứng chỉ và dự án cá nhân',
    color: '#4f46e5', 
    pastelBg: '#e0e7ff', 
    textColor: '#3730a3',
    darkBg: '#312e81',
    darkTextColor: '#a5b4fc',
    streak: 0,
    history: {},
    icon: 'sparkles'
  },
];

export const INITIAL_TASKS: Task[] = [];
