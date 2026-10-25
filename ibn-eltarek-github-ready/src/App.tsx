import React, { useState, useEffect } from 'react';
import { TopographicBackground } from './components/TopographicBackground';
import { CompassRose } from './components/CompassRose';
import { LoginForm } from './components/LoginForm';
import { RegistrationForm } from './components/RegistrationForm';
import { AuthModalForgotPassword } from './components/AuthModalForgotPassword';
import { CenterDashboard } from './components/CenterDashboard';
import { WelcomeBanner } from './components/WelcomeBanner';
import { HomePage } from './components/HomePage';
import { VerificationScreen } from './components/VerificationScreen';
import { PdfFileManager } from './components/PdfFileManager';
import { UserAccount } from './types/auth';
import { HISTORICAL_SPOTLIGHTS } from './data/siteData';
import {
  Globe2,
  MapPin,
  Clock,
  BookOpen,
  Compass,
  Sparkles,
  Award,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  LayoutDashboard,
  LogIn,
  Home,
  User,
  KeyRound,
  FolderOpen,
} from 'lucide-react';

export default function App() {
  const [viewState, setViewState] = useState<'home' | 'portal' | 'auth' | 'verify' | 'pdf-manager'>('home');
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [viewMode, setViewMode] = useState<'login' | 'register' | 'verify'>('login');
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [cairoTime, setCairoTime] = useState('');
  const [verificationContact, setVerificationContact] = useState('01023456789');
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);

  // Live Cairo / Meridian Time reference
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCairoTime(
        now.toLocaleTimeString('ar-EG', {
          timeZone: 'Africa/Cairo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' بتوقيت القاهرة'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeSpotlight = HISTORICAL_SPOTLIGHTS[spotlightIndex];

  // VIEW 1: Home Page (الصفحة الرئيسية) - Default View!
  if (viewState === 'home') {
    return (
      <HomePage
        onOpenPortal={() => setViewState(currentUser ? 'portal' : 'auth')}
        onOpenAuth={(mode) => {
          if (mode) setViewMode(mode);
          setViewState('auth');
        }}
        onOpenVerification={(contact) => {
          if (contact) setVerificationContact(contact);
          setViewState('verify');
        }}
        onOpenPdfManager={() => setViewState(currentUser?.role === 'tutor' ? 'pdf-manager' : 'auth')}
      />
    );
  }

  // VIEW 2: Student Portal & Academic Dashboard (لوحة تحكم ومتابعة الطالب)
  if (viewState === 'portal') {
    return (
      <CenterDashboard
        user={currentUser!}
        onNavigateToLogin={() => setViewState('auth')}
        onNavigateToHome={() => setViewState('home')}
        onOpenVerification={(contact) => {
          if (contact) setVerificationContact(contact);
          setViewState('verify');
        }}
      />
    );
  }

  // VIEW 3: Dedicated Six-Digit Verification Screen (شاشة التحقق من كود التأكيد)
  if (viewState === 'verify') {
    return (
      <div className="relative min-h-screen bg-[#061224] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans" dir="rtl">
        <TopographicBackground />

        {/* Top Academic Header */}
        <header className="relative z-20 w-full border-b border-slate-800/80 bg-[#061224]/85 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <CompassRose size={34} interactive={true} />
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-lg font-black tracking-wider text-white truncate">
                    IBN ELTAREK
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                    رمز التحقق
                  </span>
                </div>
                <span className="text-[11px] text-slate-300 hidden md:block">
                  التحقق بخطوتين وتأكيد الحساب عبر رمز سداسي | Security Verification
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setViewState('home')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-all font-sans min-h-[38px] cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>الرئيسية</span>
              </button>

              <button
                type="button"
                onClick={() => setViewState('auth')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0A1F36] hover:bg-[#0E2C4D] border border-slate-700 transition-all font-sans min-h-[38px] cursor-pointer"
              >
                <span>تسجيل الدخول</span>
              </button>
            </div>
          </div>
        </header>

        {/* Verification Screen Component */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14 flex flex-col justify-center items-center">
          <VerificationScreen
            initialContact={verificationContact}
            onSuccess={() => {
              // Verification codes are not simulated; Firebase authentication is required.
              setViewState('auth');
              setViewMode('login');
            }}
            onBack={() => setViewState('auth')}
          />
        </main>

        <footer className="relative z-10 w-full border-t border-slate-800/80 bg-[#061224]/90 backdrop-blur-sm py-4 text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>جميع الحقوق محفوظة © 2026 سنتر ابن الطارق (IBN ELTAREK)</span>
            <div className="flex items-center gap-3 text-[11px]">
              <button onClick={() => setViewState('home')} className="hover:text-emerald-300 cursor-pointer">الرئيسية</button>
              <span>·</span>
              <button onClick={() => setViewState('auth')} className="hover:text-emerald-300 cursor-pointer">دخول السنتر</button>
              <span>·</span>
              <button onClick={() => setViewState(currentUser ? 'portal' : 'auth')} className="hover:text-emerald-300 cursor-pointer">لوحة الطالب</button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // VIEW 4: PDF Upload & Document Management View (مركز رفع وإدارة ملفات الـ PDF)
  if (viewState === 'pdf-manager') {
    return (
      <div className="relative min-h-screen bg-[#071324] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans" dir="rtl">
        <header className="sticky top-0 z-40 bg-[#08182B]/95 border-b border-emerald-950/60 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
              <CompassRose size={34} interactive={true} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-base sm:text-xl font-black tracking-wider text-white truncate">
                    IBN ELTAREK
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                    مركز رفع PDF
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block">
                  إدارة وتوزيع مذكرات وأطالس سنتر ابن الطارق لمادتي التاريخ والجغرافيا
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewState('home')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0A1F36] hover:bg-[#0E2C4D] border border-slate-700 transition-all font-sans min-h-[38px] cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>الرئيسية</span>
              </button>

              <button
                type="button"
                onClick={() => setViewState(currentUser ? 'portal' : 'auth')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 transition-all font-sans min-h-[38px] cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة الطالب</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 w-full">
          <PdfFileManager onBack={() => setViewState(currentUser?.role === 'tutor' ? 'portal' : 'auth')} userRole={currentUser?.role || 'student'} />
        </main>

        <footer className="w-full border-t border-slate-800/80 bg-[#061224]/90 backdrop-blur-sm py-4 text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <span>جميع الحقوق محفوظة © 2026 سنتر ابن الطارق (IBN ELTAREK) · منصة المستندات والمذكرات</span>
          </div>
        </footer>
      </div>
    );
  }

  // VIEW 3: Auth Screen (تسجيل الدخول / إنشاء حساب جديد)
  return (
    <div className="relative min-h-screen bg-[#061224] text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-emerald-600/30 selection:text-emerald-200 font-sans" dir="rtl">
      {/* Topographic Background with Deep Blue & Forest Green gradients */}
      <TopographicBackground />

      {/* Top Academic Header */}
      <header className="relative z-20 w-full border-b border-slate-800/80 bg-[#061224]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <CompassRose size={34} interactive={true} />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-white truncate">
                  IBN ELTAREK
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                  سنتر ابن الطارق
                </span>
              </div>
              <span className="text-[11px] text-slate-300 hidden md:block">
                صرح التفوق لمادتي التاريخ والجغرافيا | Geography & History Tutoring Center
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs font-mono shrink-0">
            {/* Quick Navigation to Home Page */}
            <button
              type="button"
              onClick={() => setViewState('home')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-all shadow-sm font-sans min-h-[38px] cursor-pointer"
              title="الرجوع إلى الصفحة الرئيسية"
            >
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              <span>الرئيسية</span>
            </button>

            {/* Quick Navigation to 6-Digit Verification Screen */}
            <button
              type="button"
              onClick={() => setViewState('verify')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-teal-300 hover:text-white bg-[#0A2620] hover:bg-[#0E352C] border border-teal-500/40 transition-all shadow-sm font-sans min-h-[38px] cursor-pointer"
              title="شاشة التحقق من كود التأكيد (OTP)"
            >
              <KeyRound className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">رمز التحقق</span>
            </button>

            {/* Quick Navigation to PDF Upload Manager */}
            <button
              type="button"
              onClick={() => setViewState('pdf-manager')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-blue-300 hover:text-white bg-[#0A1F36] hover:bg-[#0E2C4D] border border-blue-500/40 transition-all font-sans min-h-[38px] cursor-pointer"
              title="مركز رفع وإدارة ملفات الـ PDF"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">مذكرات PDF</span>
            </button>

            {/* Quick Navigation to Student Portal */}
            <button
              type="button"
              onClick={() => setViewState('portal')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#0A1F36] hover:bg-[#0E2C4D] border border-slate-700 transition-all font-sans min-h-[38px] cursor-pointer"
              title="عرض لوحة درجات ومتابعة الطالب"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
              <span>لوحة الطالب</span>
            </button>

            {/* Live Cairo Time Reference */}
            <div className="hidden xl:flex items-center gap-2 text-slate-300 bg-[#08182B] px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-sans text-xs">{cairoTime || 'بتوقيت القاهرة'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Split-Screen Experience */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10 flex flex-col justify-center">
        
        {/* Arabic Welcome Message Banner */}
        <WelcomeBanner />

        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Academic & Geographic Showcase (order-2 on mobile, order-1 on lg) */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-xs font-medium text-emerald-300 tracking-wide">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>سنتر ابن الطارق · IBN ELTAREK TUTORING CENTER</span>
              </div>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
                حيث يلتقي عمق التاريخ بدقة <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">الخرائط والجغرافيا</span>.
              </h1>
              <p className="text-xs sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                منصة سنتر ابن الطارق المتكاملة لطلاب الشهادة الثانوية والمرحلة الإعدادية. شرح تفصيلي لنواتج التعلم، تدريب مكثف على قراءة الخرائط السياسية والطبيعية، وبنوك أسئلة المستويات العليا مع أ/ طارق عبد الرحمن.
              </p>
            </div>

            {/* Interactive Archival Coordinate Spotlight */}
            <div className="relative rounded-2xl bg-gradient-to-br from-[#08192E]/90 via-[#0B2320]/80 to-[#08192E]/90 border border-emerald-900/50 p-4 sm:p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-mono font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeSpotlight.coordinates}</span>
                  <span className="text-slate-500">·</span>
                  <span>{activeSpotlight.elevation}</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setSpotlightIndex(
                      (prev) => (prev + 1) % HISTORICAL_SPOTLIGHTS.length
                    )
                  }
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-300 font-sans transition-colors cursor-pointer"
                >
                  <span>الموقع التاريخي التالي</span>
                  <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                </button>
              </div>

              <div className="mt-4 space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider text-emerald-400 font-semibold">
                  {activeSpotlight.epoch}
                </div>
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight">
                  {activeSpotlight.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {activeSpotlight.historicalSignificance}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-emerald-300 font-medium">
                  {activeSpotlight.curatorNote}
                </span>
                <span className="text-slate-400 font-mono hidden sm:inline-block">
                  Projection: {activeSpotlight.projection}
                </span>
              </div>
            </div>

            {/* Two Pillars: Deep Blue & Forest Green for IBN ELTAREK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 rounded-xl bg-[#08182B]/90 border border-blue-900/40 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-600/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    ثقة وأصالة التاريخ (Deep Blue)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-normal">
                    أعلى معدلات التفوق لطلاب سنتر ابن الطارق في امتحانات الثانوية مع إشراف ومتابعة أكاديمية مستمرة.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#09221B]/90 border border-emerald-900/40 flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-600/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Globe2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    تطور وحيوية الجغرافيا (Forest Green)
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-normal">
                    تحليل جغرافي وخرائطي تفاعلي، ربط الأحداث بالأماكن، وتطوير المهارات التفكيرية لضمان فهم المنهج.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Modern & Minimalistic Login Card (order-1 on mobile, order-2 on lg) */}
          <div id="auth-card" className="order-1 lg:order-2 lg:col-span-5 w-full relative group">
            {/* Soft glow reflecting center colors: Deep Blue and Forest Green with calm breathing pulse */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/25 via-teal-500/20 to-blue-600/30 rounded-[30px] blur-xl animate-aura-pulse pointer-events-none" />

            <div className="relative rounded-2xl sm:rounded-3xl bg-[#091B2F]/92 border border-emerald-500/20 animate-border-pulse p-4 sm:p-8 backdrop-blur-2xl ring-1 ring-white/5 transition-all duration-300">
              {/* Subtle ambient corner glows matching center identity */}
              <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-bl from-emerald-400/15 via-emerald-600/5 to-transparent rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-tr from-blue-500/15 via-blue-700/5 to-transparent rounded-full blur-2xl pointer-events-none" />

              {viewMode === 'verify' ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Step Progress Header */}
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-[#061426] border border-slate-800 text-xs mb-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-[10px]">
                        ✓
                      </span>
                      <span className="text-slate-400 font-medium">1. إدخال بيانات الدخول</span>
                    </div>
                    <span className="text-slate-600">←</span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[10px] animate-pulse">
                        2
                      </span>
                      <span className="text-emerald-300 font-bold">2. كود التحقق (6 أرقام)</span>
                    </div>
                  </div>

                  <VerificationScreen
                    initialContact={verificationContact}
                    isEmbedded={true}
                    onSuccess={() => {
                      setViewState('auth');
                      setViewMode('login');
                    }}
                    onBack={() => setViewMode('login')}
                    title="تأكيد كود التحقق السداسي"
                    subtitle="خدمة التحقق بالرمز غير مفعّلة. سجّل الدخول بحساب Firebase بعد تفعيله من إدارة السنتر."
                  />
                </div>
              ) : viewMode === 'login' ? (
                <>
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                        بوابة تسجيل دخول الطلاب والمعلمين
                      </span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      IBN ELTAREK CENTER
                    </h2>
                    <p className="text-xs text-slate-300 mt-1">
                      أهلاً بك! يرجى إدخال بياناتك للوصول إلى حصص السنتر، بنك الأسئلة، والواجبات الدورية.
                    </p>
                  </div>

                  <LoginForm
                    onLoginSuccess={(user) => {
                      setCurrentUser(user);
                      setViewState('portal');
                    }}
                    onOpenForgotPassword={(email) => {
                      setForgotPasswordEmail(email);
                      setIsForgotPasswordOpen(true);
                    }}
                    onOpenRegistration={() => setViewMode('register')}
                  />
                </>
              ) : (
                <RegistrationForm
                  onBackToLogin={() => setViewMode('login')}
                  onSuccessRegistration={() => {
                    setViewMode('login');
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-slate-800/80 bg-[#061224]/90 backdrop-blur-sm py-4 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">جميع الحقوق محفوظة © 2026 سنتر ابن الطارق (IBN ELTAREK)</span>
            <span aria-hidden="true">·</span>
            <span>أكاديمية تدريس التاريخ والجغرافيا</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setViewState('home')} className="hover:text-emerald-300">
              الصفحة الرئيسية
            </button>
            <span>·</span>
            <button onClick={() => setViewState(currentUser ? 'portal' : 'auth')} className="hover:text-emerald-300">
              لوحة تحكم الطالب
            </button>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">جدول الحصص</span>
            <span>·</span>
            <span className="hover:text-slate-200 cursor-pointer">معمل الخرائط الرقمية</span>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      <AuthModalForgotPassword
        isOpen={isForgotPasswordOpen}
        initialEmail={forgotPasswordEmail}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
