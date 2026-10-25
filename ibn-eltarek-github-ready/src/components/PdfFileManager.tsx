import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  Edit,
  Eye,
  Download,
  Share2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Plus,
  BookOpen,
  Compass,
  FileCheck,
  FolderOpen,
  Calendar,
  Layers,
  ArrowUpDown,
  MoreVertical,
  Lock,
  Globe2,
  HardDrive,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { AcademicFile } from '../types/content';
import { FileViewerModal } from './FileViewerModal';

export interface ManagedPdfFile {
  id: string;
  title: string;
  originalFileName: string;
  category: 'memos' | 'atlases' | 'question_banks' | 'summaries' | 'exams';
  categoryArabic: string;
  subject: 'geography' | 'history' | 'all';
  subjectArabic: string;
  gradeLevel: '3sec' | '2sec' | '1sec' | 'all';
  gradeLevelArabic: string;
  size: string;
  pages: number;
  uploadDate: string;
  uploaderName: string;
  downloadCount: number;
  description: string;
  status: 'published' | 'draft';
  fileType: 'pdf' | 'atlas' | 'sheet';
}

const INITIAL_PDF_FILES: ManagedPdfFile[] = [];

interface PdfFileManagerProps {
  onBack?: () => void;
  userRole?: string;
}

export const PdfFileManager: React.FC<PdfFileManagerProps> = ({
  onBack,
  userRole = 'tutor',
}) => {
  // Files collection state
  const [files, setFiles] = useState<ManagedPdfFile[]>(INITIAL_PDF_FILES);
  const [deletedFileBackup, setDeletedFileBackup] = useState<ManagedPdfFile | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'downloads' | 'size' | 'title'>('date');

  // Modal states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<ManagedPdfFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<ManagedPdfFile | null>(null);
  const [selectedFileForViewer, setSelectedFileForViewer] = useState<AcademicFile | null>(null);
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'memos' | 'atlases' | 'question_banks' | 'summaries' | 'exams'>('memos');
  const [newSubject, setNewSubject] = useState<'geography' | 'history' | 'all'>('geography');
  const [newGrade, setNewGrade] = useState<'3sec' | '2sec' | '1sec' | 'all'>('3sec');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState<'published' | 'draft'>('published');
  const [selectedRawFile, setSelectedRawFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('⚠️ يرجى اختيار ملف بصيغة PDF فقط.');
      return;
    }
    setSelectedRawFile(file);
    // Autofill title if empty
    if (!newTitle) {
      const cleanName = file.name.replace(/\.pdf$/i, '').replace(/[-_]/g, ' ');
      setNewTitle(cleanName);
    }
  };

  // Submit Upload Form
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('يرجى كتابة عنوان للملف.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    // Realistic upload progress simulation
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      const sizeInMb = selectedRawFile
        ? (selectedRawFile.size / (1024 * 1024)).toFixed(1) + ' ميجابايت'
        : '14.5 ميجابايت';

      const categoryLabels: Record<string, string> = {
        memos: 'مذكرات الشرح المعتمدة',
        atlases: 'أطلس الخرائط الصماء والملونة',
        question_banks: 'بنوك الأسئلة والامتحانات',
        summaries: 'ملخصات وجداول المقارنة',
        exams: 'امتحانات دورية ونماذج إجابة',
      };

      const subjectLabels: Record<string, string> = {
        geography: 'الجغرافيا السياسية',
        history: 'التاريخ الحديث',
        all: 'عام (تاريخ وجغرافيا)',
      };

      const gradeLabels: Record<string, string> = {
        '3sec': 'الصف الثالث الثانوي',
        '2sec': 'الصف الثاني الثانوي',
        '1sec': 'الصف الأول الثانوي',
        all: 'جميع المراحل',
      };

      const createdFile: ManagedPdfFile = {
        id: `pdf-${Date.now()}`,
        title: newTitle.trim(),
        originalFileName: selectedRawFile ? selectedRawFile.name : `${newTitle.trim()}.pdf`,
        category: newCategory,
        categoryArabic: categoryLabels[newCategory] || 'مذكرات',
        subject: newSubject,
        subjectArabic: subjectLabels[newSubject] || 'الجغرافيا',
        gradeLevel: newGrade,
        gradeLevelArabic: gradeLabels[newGrade] || 'الصف الثالث الثانوي',
        size: sizeInMb,
        pages: Math.floor(Math.random() * 30) + 12,
        uploadDate: 'اليوم (الآن)',
        uploaderName: 'أ/ طارق عبد الرحمن',
        downloadCount: 0,
        description: newDescription.trim() || 'مذكرة تدريبية معتمدة لطلاب سنتر ابن الطارق.',
        status: newStatus,
        fileType: newCategory === 'atlases' ? 'atlas' : 'pdf',
      };

      setFiles((prev) => [createdFile, ...prev]);
      setIsUploading(false);
      setUploadProgress(0);
      setIsUploadModalOpen(false);
      // Reset form
      setNewTitle('');
      setNewDescription('');
      setSelectedRawFile(null);
      showToast(`تم رفع ملف "${createdFile.title}" بنجاح وإضافته لقائمة السنتر!`);
    }, 1200);
  };

  // Delete Action
  const confirmDeleteFile = () => {
    if (!fileToDelete) return;
    const target = fileToDelete;
    setDeletedFileBackup(target);
    setFiles((prev) => prev.filter((f) => f.id !== target.id));
    setFileToDelete(null);
    showToast(`تم حذف ملف "${target.title}". اضغط "تراجع" لاستعادته.`);
  };

  const handleUndoDelete = () => {
    if (deletedFileBackup) {
      setFiles((prev) => [deletedFileBackup, ...prev]);
      setDeletedFileBackup(null);
      showToast('تمت استعادة الملف المحذوف بنجاح.');
    }
  };

  // Save Edit Metadata
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToEdit) return;

    setFiles((prev) =>
      prev.map((f) => (f.id === fileToEdit.id ? fileToEdit : f))
    );
    showToast(`تم تحديث بيانات ملف "${fileToEdit.title}" بنجاح.`);
    setFileToEdit(null);
  };

  // Toggle Publish / Draft
  const handleToggleStatus = (id: string) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          const nextStatus = f.status === 'published' ? 'draft' : 'published';
          showToast(
            nextStatus === 'published'
              ? `تم نشر الملف للطلاب على المنصة!`
              : `تم تحويل الملف إلى مسودة خاصة.`
          );
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
  };

  // Download simulation
  const handleDownload = (file: ManagedPdfFile) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === file.id ? { ...f, downloadCount: f.downloadCount + 1 } : f
      )
    );
    showToast(`جاري تنزيل ملف "${file.originalFileName}" على جهازك...`);
  };

  // Copy shareable link
  const handleCopyLink = (file: ManagedPdfFile) => {
    const fakeLink = `https://ibneltarek-center.edu.eg/files/${file.id}`;
    navigator.clipboard?.writeText(fakeLink);
    showToast(`تم نسخ رابط الملف المباشر للمشاركة: ${file.title}`);
  };

  // Open in viewer
  const handlePreview = (file: ManagedPdfFile) => {
    const viewerFile: AcademicFile = {
      id: file.id,
      title: file.title,
      category: file.category as any,
      categoryArabic: file.categoryArabic,
      subject: file.subject,
      subjectArabic: file.subjectArabic,
      size: file.size,
      pages: file.pages,
      uploadDate: file.uploadDate,
      downloadCount: file.downloadCount,
      description: file.description,
      fileType: file.fileType,
      badge: file.status === 'draft' ? 'مسودة' : undefined,
    };
    setSelectedFileForViewer(viewerFile);
    setIsFileViewerOpen(true);
  };

  // Filter & Sort Logic
  const filteredFiles = files
    .filter((f) => {
      const matchSearch =
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.originalFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || f.category === selectedCategory;

      const matchSubject =
        selectedSubject === 'all' || f.subject === selectedSubject || f.subject === 'all';

      const matchGrade =
        selectedGrade === 'all' || f.gradeLevel === selectedGrade || f.gradeLevel === 'all';

      return matchSearch && matchCategory && matchSubject && matchGrade;
    })
    .sort((a, b) => {
      if (sortBy === 'downloads') return b.downloadCount - a.downloadCount;
      if (sortBy === 'size') return parseFloat(b.size) - parseFloat(a.size);
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'ar');
      return 0; // default order
    });

  // Calculate stats
  const totalFiles = files.length;
  const publishedFiles = files.filter((f) => f.status === 'published').length;
  const totalDownloads = files.reduce((acc, curr) => acc + curr.downloadCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 p-4 rounded-2xl bg-[#09221B] border border-emerald-500/80 text-emerald-200 text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
          {deletedFileBackup && (
            <button
              type="button"
              onClick={handleUndoDelete}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer mr-2"
            >
              تراجع (Undo)
            </button>
          )}
        </div>
      )}

      {/* Header Banner: Deep Blue & Forest Green identity */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-l from-[#0A2238] via-[#0B2E24] to-[#07192C] border border-emerald-900/50 p-4 sm:p-7 shadow-xl">
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-xs font-bold text-emerald-300">
              <FolderOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>إدارة مذكرات وملفات السنتر الرقمية (PDF Documents)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              مركز رفع وإدارة ملفات PDF والأطالس
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              ارفع مذكرات الشرح الجديدة، بنوك الأسئلة، وأطالس الخرائط. يمكنك تنظيم الملفات، تعديل بياناتها، حذفها، أو مشاركتها فوراً مع الطلاب.
            </p>
          </div>

          {/* Primary Upload Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-3.5 py-2.5 rounded-xl bg-[#071626] hover:bg-[#0B2138] border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer min-h-[44px]"
              >
                الرجوع للوحة المتابعة
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedRawFile(null);
                setNewTitle('');
                setNewDescription('');
                setIsUploadModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/60 active:scale-95 transition-all cursor-pointer min-h-[44px]"
            >
              <Upload className="w-4 h-4" />
              <span>رفع ملف PDF جديد (Upload)</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Counter */}
        <div className="mt-5 pt-4 border-t border-emerald-900/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-[#08182B]/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">إجمالي ملفات PDF:</span>
            <span className="text-base sm:text-lg font-black text-white font-mono">{totalFiles} ملف</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#08182B]/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">منشور للطلاب:</span>
            <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">{publishedFiles} منشور</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#08182B]/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">مرات التحميل:</span>
            <span className="text-base sm:text-lg font-black text-blue-400 font-mono">{totalDownloads} تنزيل</span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#08182B]/80 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">حجم التخزين السحابي:</span>
            <span className="text-base sm:text-lg font-black text-teal-300 font-mono">95.7 MB</span>
          </div>
        </div>
      </div>

      {/* Drag & Drop Quick Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => {
          setSelectedRawFile(null);
          setIsUploadModalOpen(true);
        }}
        className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
          isDragging
            ? 'border-emerald-400 bg-emerald-950/40 scale-[1.01]'
            : 'border-slate-700/80 hover:border-emerald-500/50 bg-[#081729]/60 hover:bg-[#091D33]/80'
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-inner">
          <Upload className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">
            اسحب وأفلت ملف PDF هنا أو اضغط للاختيار من جهازك
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            يدعم كتب ومذكرات وأطالس التاريخ والجغرافيا بصيغة PDF حتى 50 ميجابايت
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-[#091B2E] border border-slate-800 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الملف، المذكرة، أو نواتج التعلم..."
              className="w-full bg-[#071424] border border-slate-700 focus:border-emerald-400 rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                مسح
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 hidden sm:inline">ترتيب:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#071424] border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none cursor-pointer focus:border-emerald-400"
            >
              <option value="date">الأحدث أولاً</option>
              <option value="downloads">الأكثر تحميلاً</option>
              <option value="size">الحجم</option>
              <option value="title">أبجدياً (أ-ي)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills - Horizontally scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 text-xs">
          <span className="text-slate-400 shrink-0 text-[11px]">التصنيف:</span>

          {[
            { id: 'all', label: 'جميع الملفات' },
            { id: 'memos', label: 'مذكرات الشرح' },
            { id: 'atlases', label: 'أطالس الخرائط' },
            { id: 'question_banks', label: 'بنوك الأسئلة' },
            { id: 'summaries', label: 'الملخصات الذهبية' },
            { id: 'exams', label: 'الامتحانات الدورية' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#071424] hover:bg-[#0A1D33] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-slate-700 shrink-0 mx-1" />

          {/* Subject Switcher */}
          {[
            { id: 'all', label: 'جميع المواد' },
            { id: 'geography', label: 'جغرافيا' },
            { id: 'history', label: 'تاريخ' },
          ].map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => setSelectedSubject(sub.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedSubject === sub.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-[#071424] hover:bg-[#0A1D33] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      </div>

      {/* Files Count & State Display */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>عرض {filteredFiles.length} من أصل {files.length} ملف PDF</span>
        {deletedFileBackup && (
          <button
            type="button"
            onClick={handleUndoDelete}
            className="text-emerald-400 hover:underline font-bold"
          >
            استعادة الملف الأخير المحذوف
          </button>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (hidden on small mobile, visible md+) */}
      <div className="hidden md:block rounded-2xl bg-[#091D33] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#071626] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">اسم المذكرة والملف</th>
                <th className="py-3.5 px-4">التصنيف والمادة</th>
                <th className="py-3.5 px-4">المرحلة</th>
                <th className="py-3.5 px-4">الحجم والصفحات</th>
                <th className="py-3.5 px-4">تاريخ الرفع</th>
                <th className="py-3.5 px-4">الحالة</th>
                <th className="py-3.5 px-4">التحميلات</th>
                <th className="py-3.5 px-4 text-center">إدارة الملف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="font-bold text-white">لا توجد ملفات تطابق البحث أو الفلتر المحدد.</p>
                    <p className="text-[11px] mt-1">جرّب تغيير كلمات البحث أو اختر "جميع الملفات".</p>
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-[#0B243E]/60 transition-colors group"
                  >
                    {/* File Title & Icon */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-xs sm:text-sm truncate group-hover:text-emerald-300 transition-colors">
                            {file.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono truncate block">
                            {file.originalFileName}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & Subject */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-600/30">
                          {file.categoryArabic}
                        </span>
                        <span className="block text-[11px] text-slate-400">
                          {file.subjectArabic}
                        </span>
                      </div>
                    </td>

                    {/* Grade Level */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-300 font-medium">
                        {file.gradeLevelArabic}
                      </span>
                    </td>

                    {/* Size & Pages */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-300">
                      <div>{file.size}</div>
                      <span className="text-[10px] text-slate-500 font-sans">{file.pages} صفحة</span>
                    </td>

                    {/* Upload Date & Uploader */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                      <div>{file.uploadDate}</div>
                      <span className="text-[10px] text-slate-500">{file.uploaderName}</span>
                    </td>

                    {/* Status Badge & Toggle */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(file.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                          file.status === 'published'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                            : 'bg-amber-950 text-amber-300 border border-amber-500/40 hover:bg-amber-900'
                        }`}
                        title="اضغط لتبديل حالة النشر"
                      >
                        {file.status === 'published' ? 'منشور للطلاب' : 'مسودة خاصة'}
                      </button>
                    </td>

                    {/* Downloads */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-emerald-400">
                      {file.downloadCount}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Preview / View */}
                        <button
                          type="button"
                          onClick={() => handlePreview(file)}
                          className="p-1.5 rounded-lg bg-[#071626] hover:bg-[#0E3150] text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          title="معاينة الملف"
                        >
                          <Eye className="w-4 h-4 text-emerald-400" />
                        </button>

                        {/* Edit metadata */}
                        <button
                          type="button"
                          onClick={() => setFileToEdit({ ...file })}
                          className="p-1.5 rounded-lg bg-[#071626] hover:bg-[#0E3150] text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          title="تعديل بيانات الملف"
                        >
                          <Edit className="w-4 h-4 text-blue-400" />
                        </button>

                        {/* Download */}
                        <button
                          type="button"
                          onClick={() => handleDownload(file)}
                          className="p-1.5 rounded-lg bg-[#071626] hover:bg-[#0E3150] text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          title="تحميل الملف"
                        >
                          <Download className="w-4 h-4 text-teal-400" />
                        </button>

                        {/* Copy Link */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(file)}
                          className="p-1.5 rounded-lg bg-[#071626] hover:bg-[#0E3150] text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          title="نسخ رابط التحميل المباشر"
                        >
                          <Copy className="w-4 h-4 text-slate-400" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setFileToDelete(file)}
                          className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/40 transition-colors cursor-pointer"
                          title="حذف الملف"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE RESPONSIVE CARD VIEW (visible on screens < md) */}
      <div className="md:hidden space-y-3.5">
        {filteredFiles.length === 0 ? (
          <div className="p-8 text-center bg-[#091D33] rounded-2xl border border-slate-800 text-slate-400 space-y-2">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="font-bold text-white text-sm">لا توجد ملفات مطابقة للبحث.</p>
            <p className="text-xs">جرّب اختيار تصنيف آخر أو مسح البحث.</p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-2xl bg-[#091D33] border border-slate-800 space-y-3 shadow-lg"
            >
              {/* Top Row: Category + Status Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/30">
                  {file.categoryArabic}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(file.id)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                    file.status === 'published'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {file.status === 'published' ? 'منشور للطلاب' : 'مسودة خاصة'}
                </button>
              </div>

              {/* Title & Description */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white leading-snug">
                    {file.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                    {file.originalFileName}
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                    {file.description}
                  </p>
                </div>
              </div>

              {/* Metadata Pills */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>{file.size} · {file.pages} صفحة</span>
                <span className="text-emerald-400 font-sans text-[11px]">
                  {file.downloadCount} تنزيل
                </span>
              </div>

              {/* Mobile Action Buttons (Grid with min 44px tap target) */}
              <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => handlePreview(file)}
                  className="py-2.5 rounded-xl bg-[#071626] hover:bg-[#0C243B] text-slate-200 border border-slate-700 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer min-h-[44px]"
                >
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>معاينة</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(file)}
                  className="py-2.5 rounded-xl bg-[#071626] hover:bg-[#0C243B] text-slate-200 border border-slate-700 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer min-h-[44px]"
                >
                  <Download className="w-4 h-4 text-teal-400" />
                  <span>تحميل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFileToEdit({ ...file })}
                  className="py-2.5 rounded-xl bg-[#071626] hover:bg-[#0C243B] text-slate-200 border border-slate-700 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer min-h-[44px]"
                >
                  <Edit className="w-4 h-4 text-blue-400" />
                  <span>تعديل</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFileToDelete(file)}
                  className="py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-colors cursor-pointer min-h-[44px]"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===================== MODAL 1: UPLOAD PDF FILE ===================== */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in" dir="rtl">
          <div className="relative w-full max-w-xl bg-[#091D33] border border-emerald-900/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0B2540] to-[#0D3528] border-b border-emerald-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    رفع ملف ومذكرة PDF جديدة
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    أضف مذكرات الشرح أو أطالس الخرائط أو بنوك الأسئلة لمنصة السنتر
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUploadSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {/* File Selector Zone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  اختيار ملف الـ PDF من جهازك *
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
                    selectedRawFile
                      ? 'border-emerald-500 bg-emerald-950/30'
                      : 'border-slate-700 hover:border-emerald-500/50 bg-[#071626]'
                  }`}
                >
                  {selectedRawFile ? (
                    <div className="flex items-center justify-between gap-2 text-right">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-white block truncate">
                            {selectedRawFile.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {(selectedRawFile.size / (1024 * 1024)).toFixed(2)} MB
                          </span>
                        </div>
                      </div>
                      <span className="text-emerald-400 font-bold shrink-0 text-[11px]">
                        تغيير الملف
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <FileText className="w-7 h-7 text-slate-500 mx-auto" />
                      <p className="font-bold text-slate-200">
                        اضغط هنا لاختيار ملف PDF
                      </p>
                      <p className="text-[11px] text-slate-400">
                        أو اسحب الملف إلى هذه المساحة
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  عنوان المذكرة أو المستند *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="مثال: مذكرة مراجعة ليلة الامتحان في الجغرافيا السياسية 2026"
                  className="w-full bg-[#071626] border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Category & Subject Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    تصنيف المحتوى
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-[#071626] border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none focus:border-emerald-400"
                  >
                    <option value="memos">مذكرات الشرح المعتمدة</option>
                    <option value="atlases">أطلس الخرائط والصماء</option>
                    <option value="question_banks">بنوك الأسئلة والمستويات العليا</option>
                    <option value="summaries">ملخصات وجداول المقارنة</option>
                    <option value="exams">امتحانات دورية ونماذج إجابة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    المادة التابعة
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full bg-[#071626] border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none focus:border-emerald-400"
                  >
                    <option value="geography">الجغرافيا السياسية</option>
                    <option value="history">التاريخ الحديث والمعاصر</option>
                    <option value="all">عام (تاريخ وجغرافيا معاً)</option>
                  </select>
                </div>
              </div>

              {/* Grade Level & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    المرحلة الدراسية
                  </label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value as any)}
                    className="w-full bg-[#071626] border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none focus:border-emerald-400"
                  >
                    <option value="3sec">الصف الثالث الثانوي (شعبة أدبي)</option>
                    <option value="2sec">الصف الثاني الثانوي</option>
                    <option value="1sec">الصف الأول الثانوي</option>
                    <option value="all">متاح لجميع الصفوف</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    حالة النشر
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full bg-[#071626] border border-slate-700 text-white rounded-xl px-3 py-2.5 text-xs outline-none focus:border-emerald-400"
                  >
                    <option value="published">منشور ومتاح للطلاب فوراً</option>
                    <option value="draft">مسودة خاصة (لا تظهر للطلاب)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  وصف المذكرة ونواتج التعلم المستهدفة
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="اكتب نبذة مختصرة عن الدروس المغطاة ونواتج التعلم..."
                  className="w-full bg-[#071626] border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                />
              </div>

              {/* Progress Bar when uploading */}
              {isUploading && (
                <div className="space-y-1.5 bg-[#061426] p-3 rounded-xl border border-emerald-500/40">
                  <div className="flex items-center justify-between text-[11px] text-emerald-300">
                    <span>جاري رفع ومعالجة المستند...</span>
                    <span className="font-mono">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer min-h-[44px]"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Upload className="w-4 h-4" />
                  <span>تأكيد الرفع والإضافة (Upload PDF)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL 2: EDIT FILE METADATA ===================== */}
      {fileToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in" dir="rtl">
          <div className="relative w-full max-w-lg bg-[#091D33] border border-blue-900/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0A2542] to-[#0D382B] border-b border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">تعديل بيانات الملف</h3>
                  <span className="text-[11px] text-slate-300 font-mono">{fileToEdit.originalFileName}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFileToEdit(null)}
                className="w-8 h-8 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  عنوان الملف
                </label>
                <input
                  type="text"
                  required
                  value={fileToEdit.title}
                  onChange={(e) => setFileToEdit({ ...fileToEdit, title: e.target.value })}
                  className="w-full bg-[#071626] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    التصنيف
                  </label>
                  <select
                    value={fileToEdit.category}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      const arabicMap: Record<string, string> = {
                        memos: 'مذكرات الشرح المعتمدة',
                        atlases: 'أطلس الخرائط الصماء والملونة',
                        question_banks: 'بنوك الأسئلة والامتحانات',
                        summaries: 'ملخصات وجداول المقارنة',
                        exams: 'امتحانات دورية ونماذج إجابة',
                      };
                      setFileToEdit({
                        ...fileToEdit,
                        category: val,
                        categoryArabic: arabicMap[val] || fileToEdit.categoryArabic,
                      });
                    }}
                    className="w-full bg-[#071626] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  >
                    <option value="memos">مذكرات الشرح</option>
                    <option value="atlases">أطالس الخرائط</option>
                    <option value="question_banks">بنوك الأسئلة</option>
                    <option value="summaries">ملخصات</option>
                    <option value="exams">امتحانات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    حالة النشر
                  </label>
                  <select
                    value={fileToEdit.status}
                    onChange={(e) => setFileToEdit({ ...fileToEdit, status: e.target.value as any })}
                    className="w-full bg-[#071626] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                  >
                    <option value="published">منشور للطلاب</option>
                    <option value="draft">مسودة خاصة</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  الوصف والملاحظات
                </label>
                <textarea
                  rows={3}
                  value={fileToEdit.description}
                  onChange={(e) => setFileToEdit({ ...fileToEdit, description: e.target.value })}
                  className="w-full bg-[#071626] border border-slate-700 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFileToEdit(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-400 bg-slate-800 hover:bg-slate-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL 3: DELETE CONFIRMATION ===================== */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in" dir="rtl">
          <div className="relative w-full max-w-md bg-[#091B2E] border border-red-900/60 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-white">
                تأكيد حذف ملف الـ PDF
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                هل أنت متأكد من حذف ملف:
                <strong className="block text-emerald-300 mt-1">{fileToDelete.title}</strong>
              </p>
              <p className="text-[11px] text-slate-400 pt-1">
                سيتم إزالة الملف من قائمة السنتر ولن يتمكن الطلاب من تحميله. (يمكنك التراجع بعد الحذف مباشرة).
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={confirmDeleteFile}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-lg shadow-red-950/50 cursor-pointer min-h-[44px]"
              >
                تأكيد الحذف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 4: FULL PDF VIEWER ===================== */}
      <FileViewerModal
        file={selectedFileForViewer}
        isOpen={isFileViewerOpen}
        onClose={() => setIsFileViewerOpen(false)}
      />
    </div>
  );
};
