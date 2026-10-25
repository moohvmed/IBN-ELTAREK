import React, { useState } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Download,
  FileText,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Bookmark,
  Share2,
  Save,
  Compass,
} from 'lucide-react';
import { OnlineLesson } from '../types/content';

interface VideoPlayerModalProps {
  lesson: OnlineLesson | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFile?: (fileName: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  lesson,
  isOpen,
  onClose,
  onOpenFile,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'chapters' | 'files' | 'notes'>('chapters');
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [currentTimeProgress, setCurrentTimeProgress] = useState(25); // Percentage
  const [studentNote, setStudentNote] = useState('');
  const [savedNoteSuccess, setSavedNoteSuccess] = useState(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !lesson) return null;

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNote.trim()) return;
    setSavedNoteSuccess(true);
    setTimeout(() => setSavedNoteSuccess(false), 2500);
  };

  const handleSimulateDownload = (fileName: string) => {
    setDownloadSuccessMessage(`جاري تنزيل "${fileName}" على جهازك...`);
    setTimeout(() => {
      setDownloadSuccessMessage(null);
    }, 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      dir="rtl"
    >
      <div className="relative w-full max-w-5xl bg-[#08182B] border border-emerald-900/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[95vh]">
        {/* Top Modal Header */}
        <div className="px-3.5 py-3 sm:px-5 sm:py-4 bg-gradient-to-r from-[#0C243B] via-[#0D2F28] to-[#0A2234] border-b border-emerald-950/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-emerald-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 shrink-0">
                  {lesson.subjectArabic}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 font-mono truncate">
                  {lesson.unitOrChapter}
                </span>
                <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-mono shrink-0">
                  {lesson.quality}
                </span>
              </div>
              <h2 className="text-sm sm:text-lg font-bold text-white leading-tight mt-0.5 truncate">
                {lesson.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Scroller & Main Content Layout */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Main Video Screen Section (8 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-slate-800">
            {/* Interactive Video Frame Simulation */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-tr from-[#05111F] via-[#091D33] to-[#08221B] border border-emerald-500/30 shadow-2xl flex flex-col justify-between p-4 group">
              {/* Background ambient visuals simulating classroom / GIS map screen */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${lesson.videoThumbnail})` }}
              />

              {/* Watermark / Center Ibn ElTarek Stamp */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 bg-[#061220]/80 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-500/30">
                  <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
                  <span className="font-bold text-white text-xs">
                    سنتر ابن الطارق (IBN ELTAREK) — المنصة الذكية
                  </span>
                </div>
                <div className="bg-red-950/80 border border-red-500/40 text-red-300 font-mono px-2 py-0.5 rounded text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span>محاضرة مسجلة عالية الدقة</span>
                </div>
              </div>

              {/* Center Play/Pause Simulated Trigger */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-950/60 hover:scale-110 active:scale-95 transition-all cursor-pointer group-hover:ring-4 group-hover:ring-emerald-400/40"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-white" />
                  ) : (
                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                  )}
                </button>
                <span className="text-xs font-semibold text-white/90 drop-shadow bg-[#061426]/70 px-3 py-1 rounded-full border border-white/10">
                  المحاضر: {lesson.tutor} · {lesson.duration}
                </span>
              </div>

              {/* Video Player Bottom Controls Bar */}
              <div className="relative z-10 bg-[#061324]/90 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 space-y-2">
                {/* Progress Scrubber */}
                <div className="relative w-full h-1.5 bg-slate-700 rounded-full cursor-pointer overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all"
                    style={{ width: `${currentTimeProgress}%` }}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1.5 text-white hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentTimeProgress((p) => Math.max(0, p - 5))}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="رجوع 10 ثوان"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentTimeProgress((p) => Math.min(100, p + 5))}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="تقديم 10 ثوان"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 whitespace-nowrap">
                      {Math.floor((currentTimeProgress * 54) / 100)}:20 / {lesson.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-[#091D33] px-1 py-0.5 rounded-lg border border-slate-700 text-[10px] sm:text-[11px] font-mono">
                      {[1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          type="button"
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-1.5 py-0.5 rounded cursor-pointer ${
                            playbackSpeed === speed
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="ملء الشاشة"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification alert if download simulated */}
            {downloadSuccessMessage && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{downloadSuccessMessage}</span>
              </div>
            )}

            {/* Lesson Description & Learning Objectives */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-emerald-400">
                  تاريخ إلقاء المحاضرة بالسنتر: {lesson.lectureDate}
                </span>
                <span className="text-slate-400 font-mono">
                  نسبة إكمال المشاهدة: {currentTimeProgress}%
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {lesson.description}
              </p>

              {/* Key Learning Points */}
              <div className="p-3.5 rounded-2xl bg-[#061220] border border-emerald-900/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>نواتج التعلم ومحاور الفهم المستهدفة في هذه المحاضرة:</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {lesson.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Sidebar Section: Chapters / Attached Files / Student Notes (4 Cols) */}
          <div className="lg:col-span-4 p-4 sm:p-5 bg-[#061426] flex flex-col justify-between space-y-4">
            {/* Sidebar Tabs */}
            <div>
              <div className="grid grid-cols-3 p-1 bg-[#08192C] border border-slate-800 rounded-xl mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('chapters')}
                  className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all ${
                    activeTab === 'chapters'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  فهرس المحاور ({lesson.chapters.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('files')}
                  className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all ${
                    activeTab === 'files'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  الملفات والمذكرات ({lesson.attachedFiles.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all ${
                    activeTab === 'notes'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  ملاحظاتي
                </button>
              </div>

              {/* TAB 1: CHAPTERS */}
              {activeTab === 'chapters' && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 block mb-2 font-medium">
                    انقر على أي محور للانتقال إليه مباشرة داخل الفيديو:
                  </span>
                  <div className="space-y-1.5 max-h-80 overflow-y-auto">
                    {lesson.chapters.map((chapter, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setCurrentChapterIdx(idx);
                          setCurrentTimeProgress((idx + 1) * 20);
                        }}
                        className={`w-full text-right p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                          currentChapterIdx === idx
                            ? 'bg-emerald-950/70 border-emerald-500/60 text-white'
                            : 'bg-[#08182B] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-[#0C243B]'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-mono text-emerald-400 font-bold mt-0.5 text-[11px]">
                            {chapter.time}
                          </span>
                          <span className="font-medium text-slate-200 leading-snug">
                            {chapter.title}
                          </span>
                        </div>
                        {currentChapterIdx === idx && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: ATTACHED FILES & PDFS */}
              {activeTab === 'files' && (
                <div className="space-y-3">
                  <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                    المذكرات وأطالس الخرائط المرفقة مع هذا الدرس:
                  </span>
                  <div className="space-y-2.5">
                    {lesson.attachedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="p-3 rounded-xl bg-[#08182B] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">
                              {file.name}
                            </h4>
                            <div className="text-[10px] text-slate-400 mt-0.5 space-x-reverse space-x-2">
                              <span>الحجم: {file.size}</span>
                              <span>·</span>
                              <span>{file.pages} صفحة</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => handleSimulateDownload(file.name)}
                            className="flex-1 py-1.5 px-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Download className="w-3 h-3" />
                            <span>تحميل الملف</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: STUDENT NOTES */}
              {activeTab === 'notes' && (
                <form onSubmit={handleSaveNote} className="space-y-3">
                  <span className="text-[11px] text-slate-400 block mb-1 font-medium">
                    دوّن ملاحظاتك وتلخيصك الشخصي أثناء مشاهدة الدرس:
                  </span>
                  <textarea
                    rows={6}
                    value={studentNote}
                    onChange={(e) => setStudentNote(e.target.value)}
                    placeholder="مثال: ركّز مستر طارق على الفرق بين الموقع الهامشي لنيوزيلندا والنيجر كدولة حبيسة..."
                    className="w-full bg-[#08182B] border border-slate-700 focus:border-emerald-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none transition-all leading-relaxed"
                  />
                  {savedNoteSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-[11px] flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم حفظ الملاحظة الأكاديمية بنجاح.</span>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>حفظ الملاحظة في ملفي</span>
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Footer Support info */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>سنتر ابن الطارق الأكاديمي</span>
              <span className="text-emerald-400 font-mono">2026 Online Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
