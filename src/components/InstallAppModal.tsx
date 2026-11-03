import React, { useState, useEffect } from 'react';
import { X, Smartphone, Download, Share2, PlusSquare, CheckCircle, Sparkles } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running on iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if already in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen to beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700 flex flex-col gap-5 text-slate-800 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/30">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Cài đặt App vào điện thoại
              </h3>
              <p className="text-[11px] text-slate-400">
                Dùng như ứng dụng di động thực thụ (PWA)
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

        {/* Status or Native install button */}
        {isInstalled ? (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-emerald-800 dark:text-emerald-200">Ứng dụng đã được cài đặt!</p>
              <p className="text-emerald-600 dark:text-emerald-400 mt-0.5">Bạn có thể mở trực tiếp từ icon ngoài màn hình chính điện thoại.</p>
            </div>
          </div>
        ) : deferredPrompt ? (
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/50 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300">
              <Sparkles className="w-4 h-4" />
              <span>Thiết bị hỗ trợ cài đặt tự động:</span>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102"
            >
              <Download className="w-4 h-4" />
              <span>Cài đặt ứng dụng ngay (1-Click)</span>
            </button>
          </div>
        ) : null}

        {/* Step-by-step guides for iOS & Android */}
        <div className="space-y-3.5">
          <div className="text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span>Hướng dẫn thêm vào màn hình chính:</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
              {isIOS ? 'Dành cho iPhone (iOS)' : 'Dành cho Android & Chrome'}
            </span>
          </div>

          {isIOS ? (
            /* iOS Guide */
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Mở trình duyệt <strong className="text-blue-600 dark:text-blue-400">Safari</strong> trên iPhone.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Nhấn vào nút Chia sẻ (Share) <Share2 className="w-3.5 h-3.5 inline mx-0.5" /> ở thanh công cụ dưới đáy màn hình.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Cuộn xuống và chọn <strong className="text-blue-600 dark:text-blue-400">"Thêm vào MH chính"</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <PlusSquare className="w-3.5 h-3.5" />
                    <span>(Add to Home Screen)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Bấm <strong className="text-blue-600 dark:text-blue-400">"Thêm" (Add)</strong> ở góc trên bên phải.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Icon ứng dụng sẽ xuất hiện ngay trên màn hình chính như app tải từ App Store!</p>
                </div>
              </div>
            </div>
          ) : (
            /* Android Guide */
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Mở trang web bằng trình duyệt <strong className="text-blue-600 dark:text-blue-400">Chrome</strong> trên điện thoại.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Bấm vào biểu tượng menu <strong className="font-bold">3 chấm (⋮)</strong> ở góc trên bên phải.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200">
                    Chọn <strong className="text-blue-600 dark:text-blue-400">"Cài đặt ứng dụng"</strong> hoặc <strong className="text-blue-600 dark:text-blue-400">"Thêm vào Màn hình chính"</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Hệ thống sẽ tạo app icon độc lập và tự động mở toàn màn hình (Standalone) không thanh địa chỉ.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Benefits badge */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
          <span>✓ Chạy toàn màn hình như native app</span>
          <span>✓ Tự động đồng bộ tài khoản</span>
        </div>
      </div>
    </div>
  );
};
