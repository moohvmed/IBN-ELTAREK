import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  KeyRound,
  Edit2,
  Lock,
  Compass,
} from 'lucide-react';
import { CompassRose } from './CompassRose';

interface VerificationScreenProps {
  initialContact?: string;
  contactType?: 'phone' | 'email';
  onSuccess: (code: string) => void;
  onBack: () => void;
  title?: string;
  subtitle?: string;
  isEmbedded?: boolean;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({
  initialContact = '01023456789',
  contactType = 'phone',
  onSuccess,
  onBack,
  title = 'التحقق من رمز التأكيد (OTP)',
  subtitle = 'أدخل كود التحقق المكون من 6 أرقام لتأكيد حسابك بسنتر ابن الطارق',
  isEmbedded = false,
}) => {
  // 6 individual digit inputs
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Contact state
  const [contact, setContact] = useState(initialContact);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [tempContact, setTempContact] = useState(initialContact);

  // Status & Timing
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendMethod, setResendMethod] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric characters
    const cleanValue = value.replace(/[^0-9]/g, '');

    if (!cleanValue) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      setErrorMessage(null);
      return;
    }

    // If multiple digits were pasted/typed (e.g., autofill), take first character or distribute
    if (cleanValue.length > 1) {
      handlePastedCode(cleanValue);
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanValue;
    setDigits(newDigits);
    setErrorMessage(null);

    // Auto-advance to next input if available
    if (index < 5 && cleanValue) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft') {
      // In RTL, ArrowLeft moves forward or left depending on browser, handle logically
      if (index < 5) inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'ArrowRight') {
      if (index > 0) inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      const fullCode = digits.join('');
      if (fullCode.length === 6) {
        handleSubmit();
      }
    }
  };

  // Handle pasting full 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    handlePastedCode(pastedData);
  };

  const handlePastedCode = (rawCode: string) => {
    const numericChars = rawCode.replace(/[^0-9]/g, '').slice(0, 6);
    if (!numericChars) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = numericChars[i] || '';
    }
    setDigits(newDigits);
    setErrorMessage(null);

    // Focus last filled digit or the next empty one
    const targetIndex = Math.min(numericChars.length, 5);
    inputRefs.current[targetIndex]?.focus();
  };

  // Verification is intentionally disabled until a real SMS/WhatsApp provider is configured.
  const handleQuickFill = (_code: string) => {
    setErrorMessage('التحقق بالرمز غير مفعّل. استخدم تسجيل الدخول عبر Firebase أو تواصل مع إدارة السنتر.');
  };

  const handleResendCode = () => {
    setErrorMessage('لم يتم إرسال رسالة تحقق. يلزم إعداد مزود SMS فعلي قبل تفعيل هذه الخدمة.');
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('التحقق بالرمز غير مفعّل في هذا الإصدار. سجّل الدخول باستخدام حساب Firebase مُفعّل.');
  };

  // Contact editing submit
  const handleSaveContact = () => {
    if (!tempContact.trim()) return;
    setContact(tempContact.trim());
    setIsEditingContact(false);
    setToastMessage(`تم تحديث بيانات الاتصال إلى: ${tempContact}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isComplete = digits.every((d) => d.length === 1);

  return (
    <div className="w-full max-w-xl mx-auto" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-2xl bg-[#0B2538] border border-emerald-500/60 text-emerald-200 text-xs shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Verification Card */}
      <div
        className={
          isEmbedded
            ? 'relative space-y-4'
            : 'relative rounded-2xl sm:rounded-3xl bg-[#091B2F]/95 border border-emerald-500/30 p-5 sm:p-8 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10'
        }
      >
        {!isEmbedded && (
          <>
            {/* Soft Background Accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-emerald-500/15 via-emerald-600/5 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-500/15 via-blue-700/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          </>
        )}

        {/* Header Section */}
        <div className="text-center space-y-2 mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#0E3529] to-[#0A263D] border border-emerald-400/40 text-emerald-300 shadow-xl mb-1">
            <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>حماية وتحقق آمن · سنتر ابن الطارق</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Contact Display & Edit */}
          <div className="pt-2 flex items-center justify-center">
            {isEditingContact ? (
              <div className="flex items-center gap-2 bg-[#061424] p-1.5 rounded-xl border border-slate-700">
                <input
                  type="text"
                  value={tempContact}
                  onChange={(e) => setTempContact(e.target.value)}
                  className="bg-[#08182B] text-white text-xs px-2.5 py-1 rounded-lg border border-slate-600 outline-none font-mono"
                  placeholder="رقم الهاتف أو البريد"
                />
                <button
                  type="button"
                  onClick={handleSaveContact}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingContact(false)}
                  className="px-2 py-1 text-slate-400 hover:text-white text-[11px] cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#061424] border border-slate-800 text-xs">
                <span className="text-slate-400">الرمز مرسل إلى:</span>
                <span className="font-mono font-bold text-emerald-400 direction-ltr text-left">
                  {contact}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTempContact(contact);
                    setIsEditingContact(true);
                  }}
                  className="p-1 hover:text-emerald-300 text-slate-400 transition-colors cursor-pointer"
                  title="تعديل رقم الهاتف"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 6-Digit OTP Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 text-center mb-3">
              رمز التحقق السداسي (6-Digit Security Code)
            </label>

            {/* 6 Inputs Grid */}
            <div className="flex items-center justify-center gap-2 sm:gap-3" dir="ltr">
              {digits.map((digit, index) => {
                const isFilled = digit.length > 0;
                return (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono rounded-xl sm:rounded-2xl outline-none transition-all shadow-inner select-none ${
                      isFilled
                        ? 'bg-[#0E3529] border-2 border-emerald-400 text-emerald-200 shadow-emerald-950/60 ring-2 ring-emerald-500/20'
                        : 'bg-[#08182B] border border-slate-700 hover:border-slate-500 focus:border-emerald-400 focus:bg-[#092233] text-white focus:ring-2 focus:ring-emerald-500/30'
                    }`}
                    aria-label={`الرقم ${index + 1} من رمز التحقق`}
                  />
                );
              })}
            </div>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isComplete}
            className={`w-full relative group overflow-hidden rounded-xl sm:rounded-2xl p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.99] transition-all min-h-[48px] ${
              !isComplete || isLoading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-xl sm:rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity blur-[1px]" />
            <div className="relative px-6 py-3.5 bg-gradient-to-r from-[#0C253C] via-[#0E3528] to-[#114232] group-hover:from-[#0E2E4A] group-hover:via-[#124233] group-hover:to-[#16523E] rounded-[11px] sm:rounded-[15px] text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-lg">
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-emerald-100">جاري التحقق من الرمز...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>تأكيد الرمز ومتابعة الدخول (Verify & Submit)</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300 transform group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </div>
          </button>

          {/* Resend Code Section */}
          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              {/* Resend Timer or Active Button */}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#09221C] hover:bg-[#0E3528] border border-emerald-500/40 text-emerald-300 hover:text-white font-bold transition-all shadow cursor-pointer min-h-[44px]"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                  <span>إعادة إرسال الرمز الآن (Resend Code)</span>
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    إعادة إرسال الرمز بعد:{' '}
                    <strong className="text-emerald-400 font-mono text-sm">
                      {Math.floor(countdown / 60)
                        .toString()
                        .padStart(2, '0')}
                      :{(countdown % 60).toString().padStart(2, '0')}
                    </strong>{' '}
                    ثانية
                  </span>
                </div>
              )}

              {/* Channel Selector for Resend */}
              <div className="flex items-center gap-1.5 bg-[#061426] p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setResendMethod('whatsapp')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    resendMethod === 'whatsapp'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>واتساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResendMethod('sms')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    resendMethod === 'sms'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-3 h-3" />
                  <span>رسالة SMS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation / Back option */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              type="button"
              onClick={onBack}
              className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
            >
              <span>الرجوع إلى صفحة تسجيل الدخول</span>
            </button>

            <a
              href="https://wa.me/201023456789"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>مساعدة الدعم الفني</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};
