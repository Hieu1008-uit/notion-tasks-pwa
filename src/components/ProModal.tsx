import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  Copy, 
  CheckCheck, 
  ShieldCheck, 
  Zap, 
  Headphones, 
  CloudCheck,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { User } from '../types';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: (plan: 'monthly' | 'lifetime') => void;
  user: User | null;
  isAlreadyPro?: boolean;
}

export const ProModal: React.FC<ProModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  user,
  isAlreadyPro = false,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'lifetime'>('lifetime');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [transferCode] = useState<string>(() => {
    let code = localStorage.getItem('pastel_vietqr_code');
    if (!code) {
      const rand = Math.floor(10000 + Math.random() * 90000);
      code = `TASKS_PRO_${rand}`;
      localStorage.setItem('pastel_vietqr_code', code);
    }
    return code;
  });
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const amount = selectedPlan === 'monthly' ? 39000 : 199000;
  const formattedAmount = amount.toLocaleString('vi-VN') + 'đ';

  const bankInfo = {
    bankName: 'MBBank (Ngân hàng Quân Đội)',
    accountNumber: '0912345678',
    accountName: 'TASKS NOTION PRO',
  };

  const vietQrUrl = `https://img.vietqr.io/image/MB-0912345678-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferCode)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const fireProConfetti = () => {
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#f59e0b', '#fbbf24', '#fde047', '#10b981', '#3b82f6'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleConfirmPayment = () => {
    fireProConfetti();
    setIsSuccess(true);
    onUpgradeSuccess(selectedPlan);

    setTimeout(() => {
      onClose();
    }, 3000);
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
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700/80 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* Celebration View */
          <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-white flex items-center justify-center shadow-xl shadow-amber-400/30 animate-bounce">
              <Crown className="w-10 h-10 fill-white" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              Chúc Mừng! Bạn Đã Là Thành Viên PRO
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Gói <strong className="text-amber-600 dark:text-amber-400 font-extrabold">{selectedPlan === 'lifetime' ? 'PRO Trọn Đời' : 'PRO 1 Tháng'}</strong> đã được kích hoạt thành công trên tài khoản của bạn.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xs font-black">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span>Huy hiệu PRO Vàng đã được gắn vào tài khoản</span>
            </div>
          </div>
        ) : (
          /* Main Checkout View */
          <div>
            {/* Header Banner */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 text-amber-950 flex items-center justify-center shadow-lg shadow-amber-400/25 shrink-0">
                <Crown className="w-6 h-6 fill-amber-900 text-amber-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                    Nâng Cấp Tasks Notion PRO
                  </h2>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs">
                    VIP
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {user ? `Tài khoản: ${user.name} • Mở khóa đặc quyền không giới hạn` : 'Mở khóa toàn bộ tính năng cao cấp & hỗ trợ đội ngũ phát triển'}
                </p>
              </div>
            </div>

            {/* Active PRO status alert if already pro */}
            {isAlreadyPro && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-200">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 fill-amber-500 text-amber-500 shrink-0" />
                  <span>Tài khoản {user?.name || 'của bạn'} đã kích hoạt gói PRO</span>
                </div>
                <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100">
                  Đang hoạt động
                </span>
              </div>
            )}

            {/* Plan Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
              {/* Monthly Plan */}
              <div
                onClick={() => setSelectedPlan('monthly')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  selectedPlan === 'monthly'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Gói Tháng</span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'monthly' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                    {selectedPlan === 'monthly' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">39.000đ</span>
                  <span className="text-xs text-slate-400 font-medium">/ tháng</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Linh hoạt, gia hạn theo từng tháng
                </p>
              </div>

              {/* Lifetime Plan (Best Value) */}
              <div
                onClick={() => setSelectedPlan('lifetime')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative overflow-hidden ${
                  selectedPlan === 'lifetime'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 shadow-md ring-2 ring-amber-500/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800'
                }`}
              >
                {/* Popular ribbon */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  Tiết kiệm 80% • Hot
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Gói Trọn Đời (Vĩnh viễn)</span>
                  </span>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'lifetime' ? 'border-amber-500 bg-amber-500' : 'border-slate-300'}`}>
                    {selectedPlan === 'lifetime' && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-slate-100">199.000đ</span>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">/ một lần duy nhất</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Trả 1 lần, dùng vĩnh viễn trọn đời & cập nhật mới
                </p>
              </div>
            </div>

            {/* VietQR Payment Details Card */}
            <div className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700/80 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                    Thanh Toán Tự Động Qua VietQR MBBank
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                  Xử lý tức thì 24/7
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                {/* QR Code */}
                <div className="flex flex-col items-center bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                  <img
                    src={vietQrUrl}
                    alt="VietQR MBBank"
                    className="w-48 h-48 object-contain rounded-xl"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 font-semibold mt-2 text-center">
                    Mở app Ngân hàng hoặc Ví Momo để quét mã QR
                  </p>
                </div>

                {/* Transfer Info with Copy buttons */}
                <div className="space-y-2.5 text-xs">
                  {/* Bank Name */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Ngân hàng</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">MBBank (Quân Đội)</div>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Số tài khoản</div>
                      <div className="font-mono font-black text-sm text-blue-600 dark:text-blue-400">
                        {bankInfo.accountNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(bankInfo.accountNumber, 'acc')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-[11px] font-bold"
                    >
                      {copiedField === 'acc' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'acc' ? 'Đã sao chép' : 'Chép'}</span>
                    </button>
                  </div>

                  {/* Account Name */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Chủ tài khoản</div>
                      <div className="font-bold text-slate-800 dark:text-slate-100">{bankInfo.accountName}</div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Số tiền chuyển khoản</div>
                      <div className="font-black text-sm text-amber-600 dark:text-amber-400">{formattedAmount}</div>
                    </div>
                    <button
                      onClick={() => handleCopy(amount.toString(), 'amount')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-[11px] font-bold"
                    >
                      {copiedField === 'amount' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'amount' ? 'Đã sao chép' : 'Chép'}</span>
                    </button>
                  </div>

                  {/* Transfer Code */}
                  <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border-2 border-amber-300 dark:border-amber-700/80 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-black">Nội dung chuyển khoản (bắt buộc)</div>
                      <div className="font-mono font-black text-sm text-amber-700 dark:text-amber-300">
                        {transferCode}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(transferCode, 'code')}
                      className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 text-amber-700 dark:text-amber-300 transition-colors flex items-center gap-1 text-[11px] font-bold"
                    >
                      {copiedField === 'code' ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedField === 'code' ? 'Đã chép' : 'Chép mã'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* PRO Perks List */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/50 dark:from-slate-900/40 dark:to-slate-800/40 border border-amber-200/50 dark:border-amber-800/30">
              <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>Đặc quyền tài khoản PRO bao gồm</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Tạo không giới hạn Board & Thư mục</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Headphones className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  <span>Toàn bộ âm thanh Lofi & Soundscapes offline</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Bot className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Trợ lý AI Lên lịch thông minh không giới hạn</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CloudCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Đồng bộ đám mây và khôi phục đa thiết bị</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleConfirmPayment}
                className="w-full flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-extrabold text-sm shadow-lg shadow-amber-500/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-spin text-yellow-100" />
                <span>Tôi đã chuyển khoản - Kích hoạt Pro ngay</span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
