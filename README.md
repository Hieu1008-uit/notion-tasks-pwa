# Tasks - Notion-style Minimalist Productivity PWA

> Ứng dụng quản lý công việc và rèn luyện thói quen thiết kế theo phong cách Soft Pastel & Notion tối giản. Tích hợp chuẩn **PWA (Progressive Web App)** cài đặt trực tiếp vào điện thoại không cần qua App Store, cùng hệ thống xác thực tài khoản và đồng bộ đám mây thời gian thực.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Hieu1008--uit%2Fnotion--tasks--pwa-blue?logo=github)](https://github.com/Hieu1008-uit/notion-tasks-pwa)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHieu1008-uit%2Fnotion-tasks-pwa)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Hieu1008-uit/notion-tasks-pwa)

---

## 🌟 Tính năng nổi bật

1. **Cài đặt thành App trên điện thoại (PWA)**:
   - Hỗ trợ cài trực tiếp vào màn hình chính iPhone (Safari) và Android (Chrome).
   - Chạy toàn màn hình (Standalone) không thanh URL như app native.
   - Hỗ trợ Offline-first qua Service Worker.

2. **Hệ thống Tài khoản & Đồng bộ đám mây (Cloud Sync)**:
   - Đăng nhập 1-chạm bằng Google / Gmail.
   - Đăng nhập bằng Số điện thoại (xác thực OTP).
   - Đăng ký & Đăng nhập bằng Email & Mật khẩu (mã hóa mật khẩu BCrypt, token JWT).
   - Tự động đồng bộ hóa Task, Board, Streak và Pomodoro giữa các thiết bị theo thời gian thực.

3. **Giao diện Soft Pastel & Tối ưu năng suất**:
   - 3 Chế độ xem: Schedule Today (Kế hoạch hôm nay), Tasks (Bảng công việc dạng thẻ xếp lớp), Habits (Theo dõi thói quen & ma trận đóng góp).
   - Chuyển đổi Light Mode / Dark Mode linh hoạt.
   - Đồng hồ tập trung Pomodoro tích hợp, đếm thời gian thực.
   - Bắt đầu với Clean Slate (0 dữ liệu giả, chỉ tích lũy khi người dùng thực tế sử dụng).

---

## 🚀 Triển khai Cloud 24/7 Miễn phí

### Cách 1: Deploy lên Render (Singapore - 24/7 Miễn phí cả Frontend lẫn Backend)
1. Truy cập [Render.com](https://render.com) và đăng nhập bằng tài khoản GitHub `Hieu1008-uit`.
2. Bấm **New** $\rightarrow$ **Web Service**.
3. Chọn repository `Hieu1008-uit/notion-tasks-pwa`.
4. Render sẽ tự động nhận diện file `render.yaml` và build:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Bấm **Deploy Web Service**. Sau ~2 phút, bạn sẽ có link chính thức dạng: `https://notion-tasks-pwa.onrender.com`.

### Cách 2: Deploy lên Vercel (Cực nhanh qua CDN toàn cầu)
1. Bấm vào nút [Deploy with Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHieu1008-uit%2Fnotion-tasks-pwa).
2. Đăng nhập bằng GitHub và chọn **Deploy**.
3. Vercel tự động cấp tên miền `https://notion-tasks-pwa.vercel.app` có sẵn HTTPS miễn phí trọn đời.

---

## 💻 Chạy cục bộ trên máy (Local & LAN)

1. **Cài đặt thư viện**:
   ```bash
   npm install
   ```
2. **Khởi động cả Backend và Frontend**:
   ```bash
   npm run dev
   # Hoặc click đúp vào file chay-app.bat
   ```
3. **Mở trên điện thoại cùng mạng Wi-Fi**:
   - Truy cập vào địa chỉ IP nội bộ hiển thị trên terminal: `http://<IP_MÁY_BẠN>:5173/`

4. **Tạo link Public HTTPS chia sẻ ra ngoài mạng**:
   ```bash
   npm run tunnel
   ```
