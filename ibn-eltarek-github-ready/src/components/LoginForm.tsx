import React, { useState } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  HelpCircle,
  AlertCircle,
  GraduationCap,
  Users,
  Compass,
  Check,
  Phone,
  MessageSquare,
  KeyRound,
  CheckCircle2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import { UserRole, UserAccount } from '../types/auth';
import { auth, db, googleProvider, firebaseConfigured } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface LoginFormProps {
  onLoginSuccess: (user: UserAccount) => void;
  onOpenForgotPassword: (email: string) => void;
  onOpenRegistration: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLoginSuccess,
  onOpenForgotPassword,
  onOpenRegistration,
}) => {
  // Role: student, parent, or tutor
  const [role, setRole] = useState<UserRole>('student');

  // Login method for student/parent: 'phone' or 'credentials'
  const [loginMethod, setLoginMethod] = useState<'phone' | 'credentials'>('phone');

  // Tutor Gmail Login State
  const [tutorGmail, setTutorGmail] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Phone Login State (Student & Parent)
  const [phoneNumber, setPhoneNumber] = useState('');

  // Email / Password Login State
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Role switch handler
  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage(null);

    if (newRole === 'student') {
      setPhoneNumber('');
      setEmailOrId('');
      setPassword('');
    } else if (newRole === 'parent') {
      setPhoneNumber('');
      setEmailOrId('');
      setPassword('');
    } else {
      // Tutor: strictly Gmail
      setTutorGmail('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState('CapsLock')) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  // Authentication is handled by Firebase; never fall back to demo identities.
  const loadProfile = async (uid: string): Promise<UserAccount> => {
    const profileSnap = await getDoc(doc(db, 'users', uid));
    if (!profileSnap.exists()) {
      throw new Error('الحساب غير مفعّل في السنتر. تواصل مع الإدارة لتفعيل صلاحياتك.');
    }
    const profile = profileSnap.data() as Partial<UserAccount>;
    if (!profile.role || !['student', 'parent', 'tutor'].includes(profile.role)) {
      throw new Error('بيانات الحساب غير مكتملة. تواصل مع الإدارة.');
    }
    return {
      id: uid,
      name: profile.name || auth.currentUser?.displayName || 'مستخدم السنتر',
      email: profile.email || auth.currentUser?.email || '',
      role: profile.role,
      avatar: profile.avatar || auth.currentUser?.photoURL || '',
      specializationOrGrade: profile.specializationOrGrade || '',
      phone: profile.phone || undefined,
      linkedParentPhone: profile.linkedParentPhone || undefined,
      linkedParentName: profile.linkedParentName || undefined,
      linkedStudentPhone: profile.linkedStudentPhone || undefined,
      linkedStudentName: profile.linkedStudentName || undefined,
      linkedStudentId: profile.linkedStudentId || undefined,
      loginMethod: 'email',
    };
  };

  const handleGoogleTutorLogin = async () => {
    setErrorMessage(null);
    if (!firebaseConfigured) { setErrorMessage('يجب إعداد Firebase في ملف البيئة قبل تسجيل الدخول.'); return; }
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await loadProfile(result.user.uid);
      if (profile.role !== 'tutor') {
        throw new Error('هذا الحساب غير مسجل كمعلم في السنتر.');
      }
      onLoginSuccess({ ...profile, loginMethod: 'gmail', googleEmail: result.user.email || undefined });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'تعذر تسجيل الدخول بحساب Google.';
      setErrorMessage(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('تسجيل الدخول برقم الهاتف غير مفعّل في هذه النسخة. استخدم البريد وكلمة المرور، أو فعّل Phone Authentication في Firebase أولاً.');
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseConfigured) { setErrorMessage('يجب إعداد Firebase في ملف البيئة قبل تسجيل الدخول.'); return; }
    setErrorMessage(null);
    if (!emailOrId.trim() || !password) {
      setErrorMessage('أدخل البريد الإلكتروني وكلمة المرور.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, emailOrId.trim(), password);
      const profile = await loadProfile(result.user.uid);
      if (profile.role !== role) {
        throw new Error('نوع الحساب المختار لا يطابق صلاحيات حسابك.');
      }
      onLoginSuccess(profile);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      const message = code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password'
        ? 'بيانات الدخول غير صحيحة.'
        : error instanceof Error ? error.message : 'تعذر تسجيل الدخول. حاول مرة أخرى.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Role Selector Segmented Control */}
      <div className="mb-5">
        <label className="block text-[11px] font-semibold tracking-wider uppercase text-slate-400 mb-2">
          تحديد نوع الحساب (Account Role)
        </label>
        <div className="grid grid-cols-3 p-1 bg-[#061426]/90 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => handleRoleChange('student')}
            className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
              role === 'student'
                ? 'bg-gradient-to-r from-[#0C2B4E] to-[#123E30] text-emerald-200 border border-emerald-500/30 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>طالب (Student)</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('parent')}
            className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
              role === 'parent'
                ? 'bg-gradient-to-r from-[#0C2B4E] to-[#123E30] text-emerald-200 border border-emerald-500/30 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>ولي أمر (Parent)</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('tutor')}
            className={`py-2 px-2.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
              role === 'tutor'
                ? 'bg-gradient-to-r from-red-950/80 via-[#1F142E] to-blue-950/80 text-white border border-red-500/40 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.4 1.7 14.9 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.8 6.9 9.2 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.7 3.3-8.1z"
              />
              <path
                fill="#FBBC05"
                d="M5.8 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.1H2.2C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.6-2.8z"
              />
              <path
                fill="#34A853"
                d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.8 0-5.3-1.9-6.2-4.5H2.2v2.8C4 20.5 7.7 23 12 23z"
              />
            </svg>
            <span>معلم (Gmail)</span>
          </button>
        </div>
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ===================== CASE 1: TUTOR (STRICTLY GMAIL) ===================== */}
      {role === 'tutor' ? (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Header Banner for Tutor Gmail Access */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#170E28] via-[#0D1F38] to-[#0A2620] border border-red-500/30 text-xs shadow-lg space-y-2">
            <div className="flex items-center gap-2 text-white font-bold">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.4 1.7 14.9 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.8 6.9 9.2 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3v2.8h3.6c2.1-1.9 3.3-4.7 3.3-8.1z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.8 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7.1H2.2C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.6-2.8z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.8 0-5.3-1.9-6.2-4.5H2.2v2.8C4 20.5 7.7 23 12 23z"
                />
              </svg>
              <span>تسجيل دخول المعلم مخصص عبر Google / Gmail فقط</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              لحماية بنوك الأسئلة، كشوف الدرجات، والتحكم في المحتوى الأكاديمي، يتم تسجيل دخول المشرفين والمعلمين حصرياً عبر حساب Google الرسمي المعتمد.
            </p>
          </div>

          {/* Primary Action Button: Official Google Sign-In */}
          <div className="pt-1">
            <button
              type="button"
              disabled={isGoogleLoading}
              onClick={() => handleGoogleTutorLogin()}
              className="w-full relative group overflow-hidden rounded-2xl p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 active:scale-[0.99] transition-transform cursor-pointer shadow-xl shadow-blue-950/40"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 to-blue-500 rounded-2xl opacity-90 group-hover:opacity-100 transition-opacity blur-[1px]" />
              
              <div className="relative px-6 py-3.5 bg-[#08182B] group-hover:bg-[#0B2038] rounded-[15px] text-white text-sm font-bold flex items-center justify-center gap-3 transition-all duration-200">
                {isGoogleLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-white">جاري المصادقة عبر Google Workspace...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span className="text-white text-sm font-bold">
                      تسجيل الدخول باستخدام Google (Gmail)
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Quick Pre-fill / Custom Gmail Input */}
          <div className="p-3.5 rounded-2xl bg-[#061220] border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="tutor-gmail" className="font-semibold text-slate-300">
                أو استخدام حساب Gmail آخر للمعلم:
              </label>
              <span className="text-[10px] text-blue-400 font-mono">@gmail.com</span>
            </div>

            <div className="flex gap-2">
              <input
                id="tutor-gmail"
                type="email"
                value={tutorGmail}
                onChange={(e) => setTutorGmail(e.target.value)}
                placeholder="teacher@gmail.com"
                className="flex-1 bg-[#08182B] border border-slate-700 focus:border-blue-400 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => handleGoogleTutorLogin()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                دخول
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="text-center pt-1">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>مصادقة موثوقة ومحمية ببروتوكول Google OAuth 2.0 المعتمد</span>
            </p>
          </div>
        </div>
      ) : (
        /* ===================== CASE 2: STUDENT & PARENT LOGIN ===================== */
        <>
          {/* Method Toggle for Student / Parent: Phone vs Email */}
          <div className="mb-4 p-1 bg-[#061426] border border-emerald-950/70 rounded-2xl grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => {
                setLoginMethod('phone');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginMethod === 'phone'
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 text-white shadow-lg shadow-emerald-950/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Phone className="w-3.5 h-3.5 text-emerald-300" />
              <span>الدخول برقم الهاتف فقط</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMethod('credentials');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginMethod === 'credentials'
                  ? 'bg-gradient-to-r from-[#0C2B4E] to-[#123E30] text-emerald-200 border border-emerald-500/30 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>البريد وكلمة المرور</span>
            </button>
          </div>

          {/* Sub-mode: Phone Login */}
          {loginMethod === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0A261D]/90 via-[#0A2234]/80 to-[#0A261D]/90 border border-emerald-500/30 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {role === 'parent'
                      ? 'بوابة ولي الأمر برقم الهاتف'
                      : 'دخول الطالب برقم الهاتف'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {role === 'parent'
                    ? 'تسجيل الدخول بالهاتف غير متاح حتى يتم تفعيل مزود التحقق في Firebase. استخدم البريد وكلمة المرور حالياً.'
                    : 'تسجيل الدخول بالهاتف غير متاح حتى يتم تفعيل مزود التحقق في Firebase. استخدم البريد وكلمة المرور حالياً.'}
                </p>
              </div>

              {/* Phone Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="phone-number"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    {role === 'student'
                      ? 'رقم هاتف الطالب (Phone Number)'
                      : 'رقم هاتف ولي الأمر (Guardian Phone)'}
                  </label>
                  <span className="text-[11px] text-slate-400">الخدمة غير مفعّلة حالياً</span>
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-xs">
                    <span className="text-emerald-400 font-bold mr-1">🇪🇬 +20</span>
                  </div>

                  <input
                    id="phone-number"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full bg-[#08182B] border border-slate-700/80 group-hover:border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-20 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono tracking-wider shadow-inner"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-500 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity blur-[1px]" />
                  <div className="relative px-6 py-3 bg-gradient-to-r from-[#0C243B] via-[#0F3528] to-[#124232] group-hover:from-[#0E2C48] group-hover:via-[#134233] group-hover:to-[#17523F] rounded-[11px] text-white text-sm font-bold tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-lg">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-emerald-100">جاري التحقق من إعدادات الدخول...</span>
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <span>
                          {role === 'parent'
                            ? 'الدخول برقم الهاتف (يتطلب تفعيل الخدمة)' 
                            : 'متابعة تسجيل الدخول' }
                        </span>
                        <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>

              </div>
            </form>
          ) : (
            /* Sub-mode: Email & Password */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="academic-id"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  {role === 'student'
                    ? 'البريد أو كود الطالب (Student Email / Code)'
                    : 'بريد ولي الأمر (Guardian Email)'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="academic-id"
                    type="text"
                    required
                    autoComplete="username"
                    value={emailOrId}
                    onChange={(e) => setEmailOrId(e.target.value)}
                    placeholder="name@ibn-eltarek.com"
                    className="w-full bg-[#08182B] border border-slate-700/80 group-hover:border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-sans shadow-inner"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="academic-pass"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
                  >
                    كلمة المرور (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => onOpenForgotPassword(emailOrId)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    نسيت كلمة السر؟
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-400 transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="academic-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="••••••••••••"
                    className="w-full bg-[#08182B] border border-slate-700/80 group-hover:border-slate-600 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl pl-10 pr-11 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-sans shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 active:scale-[0.99] transition-transform cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-400 rounded-xl opacity-75 group-hover:opacity-100 transition-opacity blur-[1px]" />
                  <div className="relative px-6 py-3 bg-gradient-to-r from-[#0C243B] via-[#0F3528] to-[#124232] group-hover:from-[#0E2C48] group-hover:via-[#134233] group-hover:to-[#17523F] rounded-[11px] text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-lg">
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                        <span className="text-emerald-100">جاري إرسال رمز التحقق...</span>
                      </>
                    ) : (
                      <>
                        <span>متابعة تسجيل الدخول والتحقق | Next</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          )}
        </>
      )}

      {/* Switch to Registration Mode */}
      <div className="mt-5 text-center">
        <p className="text-xs text-slate-400">
          طالب جديد في سنتر ابن الطارق؟{' '}
          <button
            type="button"
            onClick={onOpenRegistration}
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors underline underline-offset-2 cursor-pointer"
          >
            سجل برقم هاتفك وانضم لسنتر IBN ELTAREK
          </button>
        </p>
      </div>
    </div>
  );
};
