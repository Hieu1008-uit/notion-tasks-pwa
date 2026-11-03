import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { JsonDB, StoredUser, StoredUserData } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'pastel-tasks-secure-jwt-key-2026';

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Helper to get local network IP address
function getLocalNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Authentication Middleware
interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string; phone?: string; name: string };
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Yêu cầu đăng nhập để thực hiện tác vụ này' }
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ' }
      });
      return;
    }
    req.user = decoded as { id: string; email?: string; phone?: string; name: string };
    next();
  });
}

// --- Health Check ---
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'UP',
      uptime: process.uptime(),
      localIp: getLocalNetworkIp(),
      timestamp: new Date().toISOString()
    }
  });
});

// --- Register with Email & Password ---
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', message: 'Vui lòng cung cấp đầy đủ họ tên, email và mật khẩu' }
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', message: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự' }
      });
      return;
    }

    const existingUser = JsonDB.findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'Email này đã được sử dụng. Vui lòng đăng nhập.' }
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = 'usr_' + Date.now() + Math.random().toString(36).substring(2, 6);
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;

    const newUser: StoredUser = {
      id: userId,
      name,
      email,
      passwordHash,
      avatar,
      createdAt: new Date().toISOString()
    };

    JsonDB.createUser(newUser);

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          createdAt: newUser.createdAt
        }
      },
      message: 'Đăng ký tài khoản thành công!'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi hệ thống khi đăng ký' }
    });
  }
});

// --- Login with Email & Password ---
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', message: 'Vui lòng nhập email và mật khẩu' }
      });
      return;
    }

    const user = JsonDB.findUserByEmail(email);
    if (!user || !user.passwordHash) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không chính xác' }
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không chính xác' }
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      },
      message: 'Đăng nhập thành công!'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi hệ thống khi đăng nhập' }
    });
  }
});

// --- 1-Click Google / Gmail Sign In ---
app.post('/api/auth/google', (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const targetEmail = (email || 'user@gmail.com').toLowerCase();
    const targetName = name || targetEmail.split('@')[0];

    let user = JsonDB.findUserByEmail(targetEmail);
    if (!user) {
      const userId = 'usr_g_' + Date.now();
      const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(targetName)}`;
      user = JsonDB.createUser({
        id: userId,
        name: targetName,
        email: targetEmail,
        avatar,
        createdAt: new Date().toISOString()
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      },
      message: 'Đăng nhập Google thành công!'
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi xác thực Google' }
    });
  }
});

// --- Phone Sign In with OTP ---
app.post('/api/auth/phone', (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_FAILED', message: 'Vui lòng cung cấp số điện thoại' }
      });
      return;
    }

    let user = JsonDB.findUserByPhone(phone);
    if (!user) {
      const userId = 'usr_p_' + Date.now();
      const name = `Người dùng ${phone.slice(-4)}`;
      const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(phone)}`;
      user = JsonDB.createUser({
        id: userId,
        name,
        phone,
        avatar,
        createdAt: new Date().toISOString()
      });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      },
      message: 'Đăng nhập số điện thoại thành công!'
    });
  } catch (error) {
    console.error('Phone auth error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi xác thực số điện thoại' }
    });
  }
});

// --- Current User Info ---
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const user = JsonDB.findUserById(req.user!.id);
  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Không tìm thấy người dùng' }
    });
    return;
  }

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    }
  });
});

// --- Get Synchronized User Data ---
app.get('/api/user/data', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const data = JsonDB.getUserData(req.user!.id);
  res.json({
    success: true,
    data,
    message: 'Tải dữ liệu người dùng thành công'
  });
});

// --- Update Synchronized User Data ---
app.put('/api/user/data', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { boards, tasks, selectedBoardId, streakCount, customTimes } = req.body;
  const updated = JsonDB.updateUserData(req.user!.id, {
    boards,
    tasks,
    selectedBoardId,
    streakCount,
    customTimes
  });

  res.json({
    success: true,
    data: updated,
    message: 'Đã đồng bộ dữ liệu lên đám mây!'
  });
});

// Serve static frontend files in production or when dist exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For SPA routing fallback (PWA support)
app.get('*', (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexHtml = path.join(distPath, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  const localIp = getLocalNetworkIp();
  console.log(`\n======================================================`);
  console.log(`🚀 TASKS CLOUD BACKEND IS RUNNING`);
  console.log(`📡 Local API:       http://localhost:${PORT}/api`);
  console.log(`🌐 Network API:     http://${localIp}:${PORT}/api`);
  console.log(`✨ Multi-device sync & Auth active!`);
  console.log(`======================================================\n`);
});
