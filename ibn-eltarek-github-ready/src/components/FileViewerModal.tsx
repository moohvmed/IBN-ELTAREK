import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileText,
  BookOpen,
  CheckCircle2,
  Share2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Compass,
} from 'lucide-react';
import { AcademicFile } from '../types/content';

interface FileViewerModalProps {
  file: AcademicFile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  file,
  isOpen,
  onClose,
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !file) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      dir="rtl"
    >
      <div className="relative w-full max-w-4xl bg-[#091D33] border border-emerald-900/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        {/* Header */}
        <div className="p-3 sm:p-5 bg-gradient-to-r from-[#0B2540] to-[#0D3528] border-b border-emerald-900/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 shrink-0">
                  {file.categoryArabic}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">
                  {file.pages} صفحة · {file.size}
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-bold text-white leading-tight mt-0.5 truncate">
                {file.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors hidden sm:block cursor-pointer"
              title="طباعة الملف"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Document Preview */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
          {/* Controls Bar */}
          <div className="p-3 rounded-2xl bg-[#061220] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">التنقل بين الصفحات:</span>
              <div className="flex items-center gap-1 font-mono">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded bg-[#091D33] border border-slate-700 text-slate-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 py-0.5 bg-[#0A261D] text-emerald-300 rounded border border-emerald-500/30">
                  {currentPage} / {file.pages}
                </span>
                <button
                  type="button"
                  disabled={currentPage >= file.pages}
                  onClick={() => setCurrentPage((p) => Math.min(file.pages, p + 1))}
                  className="p-1 rounded bg-[#091D33] border border-slate-700 text-slate-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                className="p-1.5 rounded-lg bg-[#091D33] border border-slate-700 text-slate-300 hover:text-white"
                title="تصغير"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] text-slate-400">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="p-1.5 rounded-lg bg-[#091D33] border border-slate-700 text-slate-300 hover:text-white"
                title="تكبير"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل المستند الكامل (PDF)</span>
            </button>
          </div>

          {/* Download Success Notice */}
          {downloadSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>تم بدء تنزيل المستند الأكاديمي بنجاح على جهازك بصيغة PDF عالية الدقة.</span>
            </div>
          )}

          {/* Document Simulation Page Sheet */}
          <div
            className="w-full mx-auto max-w-2xl bg-[#061426] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200 transition-all font-sans"
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Sheet Academic Header */}
            <div className="border-b-2 border-emerald-500/40 pb-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Compass className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="font-black text-sm text-white">
                    سنتر ابن الطارق للتدريب والتفوق الأكاديمي
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    أكاديمية تدريس التاريخ والجغرافيا للشهادة الثانوية العامة 2026
                  </p>
                </div>
              </div>
              <div className="text-left font-mono text-[10px] text-emerald-400">
                <div>IBN ELTAREK · ACADEMIC ARCHIVE</div>
                <div className="text-slate-400">{file.uploadDate}</div>
              </div>
            </div>

            {/* Document Body Sample Simulation */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 rounded-xl bg-[#081F33] border border-blue-900/40">
                <h4 className="font-bold text-white text-sm mb-1">{file.title}</h4>
                <p className="text-slate-300 text-[11px]">{file.description}</p>
              </div>

              <div className="space-y-2 pt-2">
                <h5 className="font-bold text-emerald-300 text-xs">
                  • محاور الوثيقة المعتمدة (الصفحة {currentPage} من {file.pages}):
                </h5>
                <p className="text-slate-300 text-xs">
                  تم إعداد هذه المذكرة تحت إشراف الأستاذ طارق عبد الرحمن لتشمل أدق نواتج التعلم لنظام التقييم الحديث. يتضمن هذا المحتوى خرائط توضيحية صماء، جداول مقارنة شاملة، وخطط تحليلية للمفاهيم الأساسية.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-[#05101E] border border-slate-800 text-[11px]">
                    <strong className="text-white block mb-0.5">الربط المكاني والجغرافي:</strong>
                    تحليل الأنماط المكانية والمواقع الحبيسة والبحرية واستنتاج القوة الاستراتيجية.
                  </div>
                  <div className="p-3 rounded-lg bg-[#05101E] border border-slate-800 text-[11px]">
                    <strong className="text-white block mb-0.5">التحليل التاريخي والوثائقي:</strong>
                    استقراء نصوص المعاهدات والفرمانات واستخلاص الدلالات السياسية والعسكرية.
                  </div>
                </div>
              </div>

              {/* Watermark Footer on Document */}
              <div className="pt-6 mt-6 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
                <span>حقوق الطبع والنشر محفوظة لسنتر ابن الطارق © 2026</span>
                <span>كود الوثيقة: IBN-DOC-{file.id.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#071728] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>تم تنزيل هذا المستند {file.downloadCount} مرة بواسطة طلاب السنتر</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
