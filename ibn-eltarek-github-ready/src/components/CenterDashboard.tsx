import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  BookOpen,
  MapPin,
  TrendingUp,
  FileText,
  UserCheck,
  AlertCircle,
  Download,
  Filter,
  Search,
  ChevronRight,
  LogOut,
  Sparkles,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
  Globe2,
  Compass,
  Printer,
  ChevronDown,
  LayoutDashboard,
  User,
  Phone,
  Share2,
  Smartphone,
  MessageSquare,
  Video,
  FolderOpen,
  Upload,
  KeyRound,
} from 'lucide-react';
import { CompassRose } from './CompassRose';
import { StudentProfile } from './StudentProfile';
import { SendGradesModal } from './SendGradesModal';
import { OnlineContentPortal } from './OnlineContentPortal';
import { PdfFileManager } from './PdfFileManager';
import {
  MOCK_SCHEDULE,
  MOCK_ATTENDANCE,
  MOCK_GRADES,
  ACADEMIC_KPIS,
} from '../data/dashboardData';
import { UserAccount } from '../types/auth';

interface CenterDashboardProps {
  user?: UserAccount;
  onNavigateToLogin: () => void;
  onNavigateToHome?: () => void;
  onOpenVerification?: (contact?: string) => void;
}

export const CenterDashboard: React.FC<CenterDashboardProps> = ({
  user,
  onNavigateToLogin,
  onNavigateToHome,
  onOpenVerification,
}) => {
  const [currentView, setCurrentView] = useState<'main' | 'profile' | 'online-content' | 'pdf-manager'>('main');
  const [activeTab, setActiveTab] = useState<'all' | 'schedule' | 'attendance' | 'grades'>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'geography' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExamDetails, setSelectedExamDetails] = useState<string | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  // Student info fallback if not logged in
  const student = {
    name: user?.name || 'أحمد طارق عبد الحميد',
    code: user?.id || '',
    grade: user?.specializationOrGrade || '',
    avatar:
      user?.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
    centerBranch: 'المقر الرئيسي — سنتر ابن الطارق (IBN ELTAREK)',
  };

  // Filter schedule
  const filteredSchedule = MOCK_SCHEDULE.filter((item) => {
    const matchSubject = subjectFilter === 'all' || item.subject === subjectFilter;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectArabic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  // Filter attendance
  const filteredAttendance = MOCK_ATTENDANCE.filter((item) => {
    const matchSubject = subjectFilter === 'all' || item.subject === subjectFilter;
    const matchSearch =
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectArabic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  // Filter grades
  const filteredGrades = MOCK_GRADES.filter((item) => {
    const matchSubject = subjectFilter === 'all' || item.subject === subjectFilter;
    const matchSearch =
      item.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subjectArabic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSubject && matchSearch;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#071324] text-slate-100 font-sans selection:bg-emerald-600/30 selection:text-emerald-200" dir="rtl">
      {/* Top Academic Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#08182B]/95 border-b border-emerald-950/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Center Title */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
            <CompassRose size={34} interactive={true} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-xl font-black tracking-wider text-white truncate">
                  IBN ELTAREK
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                  سنتر ابن الطارق
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                لوحة تحكم الطالب الأكاديمية — مادتي التاريخ والجغرافيا للثانوية العامة
              </p>
            </div>
          </div>

          {/* Desktop Primary View Switcher: Hidden on Mobile (Mobile uses fixed bottom bar) */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#061426] border border-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setCurrentView('main')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'main'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>الشاشة الرئيسية</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('online-content')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'online-content'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Video className="w-4 h-4 text-emerald-400" />
              <span>المحتوى الأونلاين (الدروس)</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('pdf-manager')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'pdf-manager'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FolderOpen className="w-4 h-4 text-teal-400" />
              <span>مذكرات ورفع PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('profile')}
              className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'profile'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-4 h-4" />
              <span>البروفايل (الملف الشخصي)</span>
            </button>
          </nav>

          {/* User Profile Quick Access & Sign Out */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Send Grades & Schedules to Phone Button */}
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 border border-emerald-400/40 shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
              title="إرسال كشف الدرجات ومواعيد الحصص إلى هاتف ولي الأمر أو الطالب"
            >
              <Smartphone className="w-4 h-4 text-emerald-200" />
              <span className="hidden sm:inline">إرسال الدرجات والمواعيد</span>
              <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-400/30">WhatsApp</span>
            </button>

            {/* Print button on main view */}
            {currentView === 'main' && (
              <button
                onClick={handlePrint}
                className="hidden md:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#07192A] hover:bg-[#0C243B] border border-slate-800 transition-all"
                title="طباعة التقرير الشامل"
              >
                <Printer className="w-4 h-4 text-slate-400" />
                <span>طباعة الكشف</span>
              </button>
            )}

            {/* Clickable User Avatar going to Profile */}
            <button
              type="button"
              onClick={() => setCurrentView('profile')}
              title="عرض الملف الشخصي (البروفايل)"
              className={`flex items-center gap-2 p-1 sm:pr-2.5 sm:pl-2 rounded-2xl border transition-all cursor-pointer ${
                currentView === 'profile'
                  ? 'bg-emerald-950/60 border-emerald-500/50'
                  : 'bg-[#061220] border-slate-800 hover:border-slate-700'
              }`}
            >
              <img
                src={student.avatar}
                alt={student.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div className="text-right hidden lg:block">
                <div className="text-xs font-bold text-white leading-tight flex items-center gap-1.5">
                  <span>{user?.name || student.name}</span>
                  {user?.loginMethod === 'gmail' && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-blue-950 text-blue-300 border border-blue-500/40">
                      Gmail
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  {user?.role === 'tutor'
                    ? 'المعلم العام (حساب Google موثق)'
                    : user?.role === 'parent'
                    ? 'ولي أمر الطالب'
                    : 'طالب ثانوية عامة'}
                </div>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={onNavigateToLogin}
              className="inline-flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/60 border border-rose-900/40 hover:border-rose-500 transition-all shadow-sm cursor-pointer"
              title="تسجيل الخروج والعودة لشاشة الدخول"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400 rotate-180" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container: Renders Main Dashboard, Online Content, or Profile */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 pb-28 md:pb-12">
        {currentView === 'profile' ? (
          <StudentProfile
            user={user || {
              id: 'usr_std_092',
              name: 'أحمد طارق (Ahmed Tarek)',
              email: 'ahmed.tarek@ibn-eltarek.com',
              role: 'student',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
              specializationOrGrade: 'الصف الثالث الثانوي · شعبة أدبي (تاريخ وجغرافيا تفوق)',
            }}
            onNavigateToHome={() => setCurrentView('main')}
          />
        ) : currentView === 'online-content' ? (
          <OnlineContentPortal onBackToHome={() => setCurrentView('main')} />
        ) : currentView === 'pdf-manager' ? (
          <PdfFileManager
            onBack={() => setCurrentView('main')}
            userRole={user?.role || 'student'}
          />
        ) : (
          <>
            {/* Student Academic Hero Banner */}
            <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-900/40 bg-gradient-to-l from-[#081B30] via-[#0A2624] to-[#071A2C] p-4 sm:p-8 shadow-xl">
              {/* Background Ambient Glow */}
              <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] sm:text-xs font-semibold text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>
                        {user?.role === 'tutor'
                          ? 'بوابة المعلم والإشراف العام (موثق بحساب Gmail)'
                          : user?.role === 'parent'
                          ? 'لوحة متابعة ولي الأمر'
                          : 'لوحة متابعة الطالب المتفوق'}
                      </span>
                    </span>
                    <span className="text-[11px] sm:text-xs text-slate-400 font-mono">
                      العام الدراسي 2026 · الفصل الدراسي الأول
                    </span>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                    {user?.role === 'tutor'
                      ? `أهلاً بك يا ${user.name} في منصة سنتر ابن الطارق`
                      : `أهلاً بك يا ${student.name} في سنتر ابن الطارق`}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    {user?.role === 'tutor'
                      ? 'مرحباً بك في لوحة تحكم المعلم الشاملة. تم تسجيل الدخول عبر حساب Google / Gmail المعتمد لمتابعة الطلاب، رصد الحضور، واعتماد كشوف الدرجات ونواتج التعلم.'
                      : `${student.grade} — نسعد بمتابعة مسيرتك التعليمية نحو تحقيق الدرجة النهائية في مادتي التاريخ والجغرافيا السياسية بإشراف الأستاذ طارق عبد الرحمن.`}
                  </p>
                </div>

                {/* Quick Action Badges */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setCurrentView('online-content')}
                    className="col-span-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#0C2D44] to-[#0E3E32] hover:from-[#0E3550] hover:to-[#124C3D] border border-emerald-500/40 text-center transition-all flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer shadow-lg group"
                    title="فتح مكتبة الفيديوهات المسجلة والمذكرات"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                      <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] sm:text-[10px] text-emerald-300 font-semibold">بوابة الدروس</span>
                      <span className="text-[11px] sm:text-xs font-bold text-white">المحتوى الأونلاين</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentView('pdf-manager')}
                    className="col-span-1 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-gradient-to-r from-[#0C2D44] to-[#0A382C] hover:from-[#0E3550] hover:to-[#0F4738] border border-teal-500/40 text-center transition-all flex items-center justify-center sm:justify-start gap-2.5 cursor-pointer shadow-lg group"
                    title="رفع وإدارة مذكرات وملفات الـ PDF"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform">
                      <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <div className="text-right">
                      <span className="block text-[9px] sm:text-[10px] text-teal-300 font-semibold">مذكرات السنتر</span>
                      <span className="text-[11px] sm:text-xs font-bold text-white">رفع وإدارة PDF</span>
                    </div>
                  </button>

                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#091F33] border border-blue-800/40 text-center">
                    <span className="block text-[10px] sm:text-[11px] text-slate-400 font-medium">الترتيب العام</span>
                    <span className="text-base sm:text-lg font-black text-white">المركز الرابع <span className="text-[10px] sm:text-xs text-emerald-400 font-normal">/ 185</span></span>
                  </div>
                  <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#08261F] border border-emerald-700/40 text-center">
                    <span className="block text-[10px] sm:text-[11px] text-slate-300 font-medium">المعدل التراكمي</span>
                    <span className="text-base sm:text-lg font-black text-emerald-300">92.5% <span className="text-[10px] sm:text-xs text-emerald-400 font-normal">(امتياز)</span></span>
                  </div>
                </div>
              </div>
            </section>

            {/* Phone Number Account Linking & Automatic Notification Status Banner */}
            <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#071F36] via-[#092B24] to-[#081F31] border border-emerald-500/30 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-xs font-bold text-white">
                      ربط حسابات الهاتف وإرسال التقارير (للطلاب وأولياء الأمور)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      ✓ متصل ومفعل
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-400 text-[11px]">هاتف الطالب:</span>
                      <strong className="text-emerald-300 font-mono text-[11px] sm:text-xs">
                        {user?.linkedStudentPhone || user?.phone || '01023456789'}
                      </strong>
                    </span>
                    <span className="text-slate-600 hidden sm:inline">·</span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-400 text-[11px]">هاتف ولي الأمر:</span>
                      <strong className="text-blue-300 font-mono text-[11px] sm:text-xs">
                        {user?.linkedParentPhone || (user?.role === 'parent' ? user.phone : '01198765432') || '01198765432'}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                {onOpenVerification && (
                  <button
                    type="button"
                    onClick={() => onOpenVerification(user?.linkedStudentPhone || user?.phone || '01023456789')}
                    className="w-full sm:w-auto px-3.5 py-2.5 bg-[#09221B] hover:bg-[#0E3528] border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    title="التحقق من رقم الهاتف وتأكيد الحساب بكود 6 أرقام"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <span>رمز التحقق (OTP)</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsSendModalOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>إرسال تقرير فوري (واتساب / SMS)</span>
                </button>
              </div>
            </section>

        {/* Calm High-Level KPI Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* KPI 1: Attendance Rate */}
          <div className="rounded-2xl p-3.5 sm:p-5 bg-[#091D33] border border-emerald-900/30 shadow-md flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">نسبة الحضور الإجمالية</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {ACADEMIC_KPIS.attendanceRate}%
              </h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-400 mt-1 flex items-center gap-1 truncate">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                <span>حضر {ACADEMIC_KPIS.attendedLectures} من {ACADEMIC_KPIS.totalLectures}</span>
              </p>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <UserCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* KPI 2: Average Grades */}
          <div className="rounded-2xl p-3.5 sm:p-5 bg-[#091D33] border border-emerald-900/30 shadow-md flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">متوسط درجات الاختبارات</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {ACADEMIC_KPIS.averageGrade}%
              </h3>
              <p className="text-[10px] sm:text-[11px] text-teal-400 mt-1 flex items-center gap-1 truncate">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>مستوى ممتاز</span>
              </p>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-blue-950/70 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Award className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* KPI 3: Homework & Map Assignments */}
          <div className="rounded-2xl p-3.5 sm:p-5 bg-[#091D33] border border-emerald-900/30 shadow-md flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-slate-400 truncate">تسليم الواجبات والخرائط</p>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                {ACADEMIC_KPIS.homeworkCompletionRate}%
              </h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-400 mt-1 truncate">
                جميع الخرائط مسلّمة
              </p>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <BookOpen className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* KPI 4: Next Scheduled Lecture */}
          <div className="rounded-2xl p-3.5 sm:p-5 bg-[#0A2620] border border-emerald-700/40 shadow-md flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-[11px] sm:text-xs font-medium text-emerald-300 truncate">الحصة القادمة بالسنتر</p>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                الأحد 04:30 م
              </h3>
              <p className="text-[10px] sm:text-[11px] text-emerald-200/90 mt-1 truncate">
                قاعة A الكبرى
              </p>
            </div>
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-emerald-900/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shrink-0">
              <Clock className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
          </div>
        </section>

        {/* Section Tabs & Filters: Horizontally Scrollable on Mobile without broken lines */}
        <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 pb-2 border-b border-slate-800">
          {/* Main Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#09192C] border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              عرض شامل
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'schedule'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>الجدول ({MOCK_SCHEDULE.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'attendance'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>الحضور ({MOCK_ATTENDANCE.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'grades'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>الدرجات ({MOCK_GRADES.length})</span>
            </button>
          </div>

          {/* Subject Filter (All, Geography, History) */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الحصص أو الامتحانات..."
                className="w-full bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 rounded-xl pr-9 pl-4 py-2 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value as any)}
              className="bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 rounded-xl px-2.5 sm:px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer shrink-0"
            >
              <option value="all">كل المواد</option>
              <option value="geography">الجغرافيا فقط</option>
              <option value="history">التاريخ فقط</option>
            </select>
          </div>
        </section>

        {/* SECTION 1: SCHEDULE (جدول الحصص) */}
        {(activeTab === 'all' || activeTab === 'schedule') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    جدول الحصص والمحاضرات الأسبوعية
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    مواعيد الحضور بالقاعات، ورش العمل الخرائطية، والمحاضرات المسجلة
                  </p>
                </div>
              </div>

              <span className="text-[11px] sm:text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2.5 sm:px-3 py-1 rounded-lg border border-emerald-500/20 shrink-0">
                المقر الرئيسي
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredSchedule.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                    item.status === 'completed'
                      ? 'bg-[#081627]/80 border-slate-800 opacity-80'
                      : 'bg-[#091D33] border-emerald-900/40 hover:border-emerald-500/40 shadow-lg'
                  }`}
                >
                  <div>
                    {/* Top Tag & Subject */}
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.subject === 'geography'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/30'
                            : 'bg-blue-950 text-blue-300 border border-blue-600/30'
                        }`}
                      >
                        {item.subjectArabic}
                      </span>

                      <span
                        className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded font-mono ${
                          item.status === 'completed'
                            ? 'text-slate-400 bg-slate-800'
                            : 'text-emerald-400 bg-emerald-950/80 border border-emerald-500/30'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Time & Room Info */}
                    <div className="space-y-1.5 text-xs text-slate-300 mt-2.5 pt-2.5 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="font-semibold text-white">{item.day}</span>
                        <span className="text-slate-400">· {item.time}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>{item.room}</span>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>المعلم: <strong className="text-slate-200">{item.tutor}</strong></span>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-2.5 p-2 rounded-xl bg-[#061220] border border-slate-800 text-[11px] text-slate-300">
                        <span className="text-emerald-400 font-semibold block mb-0.5">توجيه الحصة:</span>
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">{item.date}</span>
                    <button className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 transition-colors">
                      <span>تفاصيل</span>
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: ATTENDANCE RECORDS (سجلات الحضور والغياب) */}
        {(activeTab === 'all' || activeTab === 'attendance') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    سجلات الحضور والغياب بالباركود الذكي
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    رصد الحضور الإلكتروني عند بوابات السنتر وإخطار ولي الأمر الفوري
                  </p>
                </div>
              </div>

              {/* Attendance Mini Summary */}
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs overflow-x-auto no-scrollbar">
                <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-medium whitespace-nowrap">
                  حضور: 30 حصة
                </span>
                <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-medium whitespace-nowrap">
                  تأخير: 1
                </span>
                <span className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium whitespace-nowrap">
                  عذر: 1
                </span>
              </div>
            </div>

            {/* Desktop Table View (Hidden on mobile < md) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-[#091D33]/90 shadow-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#071728] text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">رقم الحصة</th>
                    <th className="py-3.5 px-4 font-semibold">التاريخ</th>
                    <th className="py-3.5 px-4 font-semibold">المادة والموضوع</th>
                    <th className="py-3.5 px-4 font-semibold">حالة الحضور</th>
                    <th className="py-3.5 px-4 font-semibold">وقت تسجيل الباركود</th>
                    <th className="py-3.5 px-4 font-semibold">القاعة والتوثيق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAttendance.map((record) => (
                    <tr
                      key={record.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-200">
                        #{record.lectureNumber}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-300 whitespace-nowrap">
                        {record.date}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">
                          {record.topic}
                        </div>
                        <span className="text-[11px] text-emerald-400">
                          {record.subjectArabic}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {record.status === 'present' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>حاضر (Present)</span>
                          </span>
                        ) : record.status === 'late' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-950/70 border border-amber-500/40 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>متأخر (Late)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>غياب بعذر مسبق</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                        {record.checkInTime}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        <span className="block text-slate-300">{record.hall}</span>
                        <span className="text-[10px] text-slate-500">{record.recordedBy}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Visible only on mobile < md) */}
            <div className="md:hidden space-y-2.5">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="p-3.5 rounded-2xl bg-[#091D33] border border-slate-800 shadow space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                        #{record.lectureNumber}
                      </span>
                      <span className="text-xs font-semibold text-white">{record.date}</span>
                    </div>

                    {record.status === 'present' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>حاضر</span>
                      </span>
                    ) : record.status === 'late' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 border border-amber-500/40 text-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>متأخر</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        <span>بعذر</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">{record.topic}</h4>
                    <p className="text-[11px] text-emerald-400 mt-0.5">{record.subjectArabic}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      <span>{record.checkInTime}</span>
                    </span>
                    <span>{record.hall}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: GRADES & EXAMS (سجلات الدرجات والاختبارات) */}
        {(activeTab === 'all' || activeTab === 'grades') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    سجلات الدرجات والاختبارات ونواتج التعلم
                  </h2>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    نتائج الاختبارات الدورية، امتحانات الخرائط الصماء، وملاحظات التوجيه الأكاديمي
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span className="text-emerald-400 font-bold">متوسط التحصيل: 92.5%</span>
                <span>·</span>
                <span>المركز الرابع على سنتر ابن الطارق</span>
              </div>
            </div>

            {/* Desktop Grades Table View (Hidden on mobile < md) */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-[#091D33]/90 shadow-xl">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#071728] text-slate-300 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">اسم الاختبار / المادة</th>
                    <th className="py-3.5 px-4 font-semibold">نوع الامتحان</th>
                    <th className="py-3.5 px-4 font-semibold">الدرجة المحققة</th>
                    <th className="py-3.5 px-4 font-semibold">النسبة والتقدير</th>
                    <th className="py-3.5 px-4 font-semibold">الترتيب</th>
                    <th className="py-3.5 px-4 font-semibold">تاريخ الاختبار</th>
                    <th className="py-3.5 px-4 font-semibold">ملاحظة أ/ طارق عبد الرحمن</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredGrades.map((exam) => (
                    <tr
                      key={exam.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">
                          {exam.examTitle}
                        </div>
                        <span className="text-[11px] text-emerald-400 font-medium">
                          {exam.subjectArabic}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-md bg-[#061220] border border-slate-700 text-slate-300 text-[11px]">
                          {exam.examTypeArabic}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-sm text-white">
                          <span className="text-emerald-300 text-base">{exam.score}</span>
                          <span className="text-slate-400 text-xs"> / {exam.totalScore}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">
                            {exam.percentage.toFixed(1)}%
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              exam.gradeLabel === 'ممتاز'
                                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                : 'bg-teal-950 text-teal-300 border border-teal-500/40'
                            }`}
                          >
                            {exam.gradeLabel}
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full"
                            style={{ width: `${exam.percentage}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-slate-200">
                          #{exam.classRank}
                        </span>
                        <span className="text-slate-500 text-[11px]"> / {exam.totalStudents}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-400">
                        {exam.date}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="p-2 rounded-lg bg-[#061322] border border-emerald-950/60 text-[11px] text-slate-300 leading-relaxed">
                          {exam.tutorFeedback}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Grades Card View (Visible only on mobile < md) */}
            <div className="md:hidden space-y-3">
              {filteredGrades.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 rounded-2xl bg-[#091D33] border border-slate-800 shadow-md space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">{exam.examTitle}</h4>
                      <div className="text-[11px] text-emerald-400 mt-0.5">{exam.subjectArabic} · {exam.date}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#061426] text-slate-300 border border-slate-700 shrink-0">
                      {exam.examTypeArabic}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#061322] border border-slate-800 text-center">
                    <div>
                      <span className="block text-[10px] text-slate-400">الدرجة</span>
                      <span className="text-xs font-bold text-emerald-300 font-mono">
                        {exam.score} <span className="text-slate-500 text-[10px]">/ {exam.totalScore}</span>
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">النسبة</span>
                      <span className="text-xs font-bold text-teal-300 font-mono">
                        {exam.percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-400">الترتيب</span>
                      <span className="text-xs font-bold text-white font-mono">
                        #{exam.classRank} <span className="text-slate-500 text-[9px]">/ {exam.totalStudents}</span>
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      style={{ width: `${exam.percentage}%` }}
                    />
                  </div>

                  {exam.tutorFeedback && (
                    <div className="p-2.5 rounded-xl bg-[#061220] border border-emerald-950/80 text-[11px] text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 font-semibold block mb-0.5">ملاحظة أ/ طارق:</span>
                      <span>"{exam.tutorFeedback}"</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: TEACHER RECOMMENDATION & MAP LAB NOTICE */}
        <section className="rounded-2xl p-4 sm:p-6 bg-gradient-to-r from-[#09221C] via-[#091C2E] to-[#0A2624] border border-emerald-600/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0 mt-1">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  توجيه أكاديمي خاص من مستر طارق عبد الرحمن
                </span>
                <span className="text-[10px] text-slate-400 font-mono">تحديث اليوم</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                مراجعة خرائط المضايق البحرية والحدود الهندسية والهدنة (الجغرافيا السياسية)
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-3xl">
                أداء الطالب أحمد في امتحانات الخرائط ممتاز بنسبة 100%. التكليف القادم هو مراجعة أثر معاهدة 1936 في تاريخ مصر وحل 50 سؤال نواتج تعلم من مذكرة المراجعة تمهيداً للاختبار الشامل القادم.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shrink-0 self-stretch sm:self-auto">
            <button
              onClick={() => setIsSendModalOpen(true)}
              className="px-4 py-2.5 bg-[#091B2E] hover:bg-[#0D2742] text-emerald-300 hover:text-white text-xs font-bold rounded-xl border border-emerald-500/40 shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>إرسال هذا التوجيه لولي الأمر</span>
            </button>

            <button className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" />
              <span>تحميل بنك الأسئلة والمذكرة</span>
            </button>
          </div>
        </section>
        </>
        )}
      </main>

      {/* Fixed Mobile Bottom Navigation Bar (Visible only on screens < md) */}
      <nav aria-label="شريط التنقل السفلي للهواتف" className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#071728]/95 backdrop-blur-xl border-t border-emerald-950/80 px-2 py-1.5 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] flex items-center justify-around shadow-2xl">
        <button
          type="button"
          onClick={() => setCurrentView('main')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 px-2 rounded-xl transition-all cursor-pointer ${
            currentView === 'main'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentView === 'main' ? 'bg-emerald-500/20' : ''}`}>
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="text-[10px]">الرئيسية</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('online-content')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            currentView === 'online-content'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentView === 'online-content' ? 'bg-emerald-500/20' : ''}`}>
            <Video className="w-5 h-5" />
          </div>
          <span className="text-[10px]">الدروس</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('pdf-manager')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            currentView === 'pdf-manager'
              ? 'text-teal-300 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentView === 'pdf-manager' ? 'bg-teal-500/20' : ''}`}>
            <FolderOpen className="w-5 h-5 text-teal-300" />
          </div>
          <span className="text-[10px]">المذكرات</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSendModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl text-teal-300 hover:text-white transition-all cursor-pointer"
        >
          <div className="p-1 rounded-lg bg-teal-500/20 border border-teal-500/30">
            <Share2 className="w-5 h-5 text-teal-300" />
          </div>
          <span className="text-[10px]">تقرير</span>
        </button>

        <button
          type="button"
          onClick={() => setCurrentView('profile')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[50px] min-h-[44px] py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
            currentView === 'profile'
              ? 'text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className={`p-1 rounded-lg ${currentView === 'profile' ? 'bg-emerald-500/20' : ''}`}>
            <User className="w-5 h-5" />
          </div>
          <span className="text-[10px]">حسابي</span>
        </button>
      </nav>

      {/* Send Grades & Schedules to Phone Modal */}
      <SendGradesModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        user={user}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-800/80 bg-[#061224] py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">سنتر ابن الطارق (IBN ELTAREK)</span>
            <span>·</span>
            <span>لوحة تحكم متابعة الطلاب والدرجات 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>مقر السنتر الرئيسي</span>
            <span>·</span>
            <span>أكاديمية تدريس التاريخ والجغرافيا</span>
            <span>·</span>
            <span>الدعم الأكاديمي والكنترول</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
