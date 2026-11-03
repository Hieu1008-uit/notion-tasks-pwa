import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

export interface StoredUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  passwordHash?: string;
  avatar: string;
  createdAt: string;
}

export interface UserBoard {
  id: string;
  title: string;
  color: string;
  createdAt: string;
}

export interface UserTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  boardId: string;
}

export interface StoredUserData {
  boards: UserBoard[];
  tasks: UserTask[];
  selectedBoardId: string;
  streakCount: number;
  customTimes: Record<string, string>;
  lastUpdated: string;
}

interface DatabaseSchema {
  users: StoredUser[];
  userData: Record<string, StoredUserData>;
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure database file exists
if (!fs.existsSync(DB_FILE)) {
  const initialDb: DatabaseSchema = {
    users: [],
    userData: {}
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), 'utf-8');
}

export class JsonDB {
  private static read(): DatabaseSchema {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    } catch {
      return { users: [], userData: {} };
    }
  }

  private static write(data: DatabaseSchema): void {
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  }

  static findUserByEmail(email: string): StoredUser | undefined {
    const db = this.read();
    return db.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  }

  static findUserByPhone(phone: string): StoredUser | undefined {
    const db = this.read();
    return db.users.find(u => u.phone === phone);
  }

  static findUserById(id: string): StoredUser | undefined {
    const db = this.read();
    return db.users.find(u => u.id === id);
  }

  static createUser(user: StoredUser): StoredUser {
    const db = this.read();
    db.users.push(user);
    // Initialize default empty data
    db.userData[user.id] = {
      boards: [
        { id: 'board-1', title: 'Thói quen hàng ngày', color: 'bg-emerald-400', createdAt: new Date().toISOString() },
        { id: 'board-2', title: 'Kế hoạch học tập & Ý tưởng', color: 'bg-indigo-400', createdAt: new Date().toISOString() },
        { id: 'board-3', title: 'Công nghệ Java (UIT)', color: 'bg-teal-400', createdAt: new Date().toISOString() }
      ],
      tasks: [],
      selectedBoardId: 'board-1',
      streakCount: 0,
      customTimes: {},
      lastUpdated: new Date().toISOString()
    };
    this.write(db);
    return user;
  }

  static getUserData(userId: string): StoredUserData {
    const db = this.read();
    if (!db.userData[userId]) {
      db.userData[userId] = {
        boards: [
          { id: 'board-1', title: 'Thói quen hàng ngày', color: 'bg-emerald-400', createdAt: new Date().toISOString() },
          { id: 'board-2', title: 'Kế hoạch học tập & Ý tưởng', color: 'bg-indigo-400', createdAt: new Date().toISOString() },
          { id: 'board-3', title: 'Công nghệ Java (UIT)', color: 'bg-teal-400', createdAt: new Date().toISOString() }
        ],
        tasks: [],
        selectedBoardId: 'board-1',
        streakCount: 0,
        customTimes: {},
        lastUpdated: new Date().toISOString()
      };
      this.write(db);
    }
    return db.userData[userId];
  }

  static updateUserData(userId: string, data: Partial<StoredUserData>): StoredUserData {
    const db = this.read();
    const current = db.userData[userId] || {
      boards: [],
      tasks: [],
      selectedBoardId: 'board-1',
      streakCount: 0,
      customTimes: {},
      lastUpdated: new Date().toISOString()
    };
    db.userData[userId] = {
      ...current,
      ...data,
      lastUpdated: new Date().toISOString()
    };
    this.write(db);
    return db.userData[userId];
  }
}
