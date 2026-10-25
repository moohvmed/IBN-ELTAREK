import React, { useState } from 'react';
import { Sparkles, Compass, MapPin, BookOpen, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface WelcomeBannerProps {
  onDismiss?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onDismiss }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsOpen(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-[#071d36] via-[#0b2b22] to-[#081a2e] p-4 sm:p-5 shadow-2xl backdrop-blur-md mb-6">
      {/* Decorative background light accents */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-3 left-3 sm:left-auto sm:right-3 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
        aria-label="إغلاق رسالة الترحيب"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Arabic Welcome Message with prominent IBN ELTAREK branding */}
        <div className="flex items-start gap-3.5 pr-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-blue-600/30 border border-emerald-400/40 flex items-center justify-center shrink-0 text-emerald-300 shadow-inner">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono">
                أهلاً بكم في المنصة التعليمية
              </span>
              <span className="text-xs text-blue-300 font-semibold">
                IBN ELTAREK CENTER
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>مرحباً بكم في صرح المتفوقين — سنتر ابن الطارق</span>
              <Sparkles className="w-4 h-4 text-emerald-400 inline shrink-0" />
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 mt-1 leading-relaxed max-w-3xl">
              نرحب بأبطال وعلماء المستقبل في <strong className="text-emerald-300 font-bold">سنتر ابن الطارق (IBN ELTAREK)</strong>، الوجهة الأولى لإتقان مادتي التاريخ والجغرافيا وبناء الفكر والتحليل المكاني والخرائط. رحلتك نحو الدرجة النهائية تبدأ هنا.
            </p>
          </div>
        </div>

        {/* Quick Highlights / Call to Action */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <div className="hidden sm:flex flex-col text-right text-[11px] text-slate-300 border-l border-emerald-500/30 pl-3">
            <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3 h-3" />
              تاريخ وجغرافيا تفوق
            </span>
            <span className="text-slate-400">شرح خرائط وفهم تحليلي</span>
          </div>

          <a
            href="#auth-card"
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            <span>سجل دخولك الآن</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
