import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, BookOpen, Compass, ShieldCheck } from 'lucide-react';
import { SUBJECT_DISCIPLINES } from '../data/siteData';

interface RegistrationFormProps {
  onBackToLogin: () => void;
  onSuccessRegistration: (name: string, email: string) => void;
  onOpenVerification?: (contact: string, name: string) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onBackToLogin,
  onSuccessRegistration,
  onOpenVerification,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [gradeLevel, setGradeLevel] = useState('الثانوية العامة - الصف الثالث الثانوي');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'الجغرافيا السياسية (Political Geography)',
    'التاريخ الحديث والمعاصر (Modern History)',
  ]);
  const [learningGoal, setLearningGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!fullName.trim() || (!email.trim() && !studentPhone.trim())) {
      setErrorMessage('اكتب الاسم والبريد الإلكتروني أو رقم الهاتف على الأقل.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/registration-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(), email: email.trim(), studentPhone: studentPhone.trim(),
          parentPhone: parentPhone.trim(), gradeLevel, subjects: selectedSubjects, learningGoal: learningGoal.trim(),
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'تعذر إرسال الطلب. تأكد من إعداد الخادم ثم حاول مرة أخرى.');
      setSubmitted(true);
      window.setTimeout(() => onSuccessRegistration(fullName.trim(), email.trim()), 2500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'حدث خطأ غير متوقع أثناء التسجيل.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={onBackToLogin}
        className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 mb-6 transition-colors group focus:outline-none focus-visible:underline"
      >
        <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
        <span>العودة لشاشة تسجيل الدخول إلى سنتر ابن الطارق</span>
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          حجز موعد واختبار تحديد المستوى | IBN ELTAREK
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          انضم لصفوف المتفوقين في التاريخ والجغرافيا السياسية، وحصص تدريب الخرائط والتحليل المقالي.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            تم استلام طلب التسجيل بنجاح!
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            أهلاً بك في سنتر ابن الطارق، يا <span className="text-emerald-300 font-medium">{fullName}</span>. سيتم التواصل معك عبر الواتساب أو البريد لتحديد موعد استلام المذكرة والحصة التمهيدية.
          </p>
          <span className="text-[11px] text-emerald-400 font-mono tracking-wider">
            تم إرسال طلبك للمراجعة. ستتواصل معك إدارة السنتر بعد مراجعته.
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-sm text-red-200">{errorMessage}</div>}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              الاسم ثلاثي للطالب (Full Name)
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: محمد أحمد علي"
              className="w-full bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Student Phone & Parent Phone for Account Linking */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                رقم هاتف الطالب (لتسجيل الدخول السريع)
              </label>
              <input
                type="tel"
                required
                value={studentPhone}
                onChange={(e) => setStudentPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                رقم هاتف ولي الأمر (لإرسال الدرجات والمواعيد)
              </label>
              <input
                type="tel"
                required
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="011XXXXXXXX"
                className="w-full bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>ربط الحسابات التلقائي:</strong> يتم ربط هاتف الطالب بهاتف ولي الأمر فورياً، مما يتيح لكلا الطرفين الدخول برقم الهاتف بدون كلمة سر، وتلقي كشوف الدرجات ومواعيد الحصص الدورية عبر الواتساب.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              البريد الإلكتروني (اختياري)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com (اختياري)"
              className="w-full bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              المرحلة والصف الدراسي
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="w-full bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition-all cursor-pointer"
            >
              <option value="الثانوية العامة - الصف الثالث الثانوي">الثانوية العامة - الصف الثالث الثانوي (تاريخ وجغرافيا تفوق)</option>
              <option value="الصف الثاني الثانوي - أدبي">الصف الثاني الثانوي (شعبة أدبي)</option>
              <option value="الصف الأول الثانوي">الصف الأول الثانوي (تأسيس تاريخ وجغرافيا)</option>
              <option value="المرحلة الإعدادية - دراسات اجتماعية">المرحلة الإعدادية (دراسات اجتماعية متميزة)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              تحديد المواد والورش المستهدفة (Focus Disciplines)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUBJECT_DISCIPLINES.map((subject) => {
                const isChecked = selectedSubjects.includes(subject);
                return (
                  <button
                    type="button"
                    key={subject}
                    onClick={() => toggleSubject(subject)}
                    className={`text-right px-3 py-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-between min-h-[44px] cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                        : 'bg-[#08182B]/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span className="truncate pl-2">{subject}</span>
                    {isChecked ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              الهدف التعليمي الأساسي (Primary Objective)
            </label>
            <input
              type="text"
              value={learningGoal}
              onChange={(e) => setLearningGoal(e.target.value)}
              placeholder="مثال: تحقيق الدرجة النهائية 60/60 وإتقان خرائط الجغرافيا وبابل شيت التاريخ"
              className="w-full bg-[#08182B] border border-slate-700/80 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-xl shadow-emerald-950/50 cursor-pointer min-h-[46px]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-600 transition-all duration-300 group-hover:scale-105" />
              <div className="relative px-6 py-3 bg-gradient-to-r from-[#0C243B] via-[#0E352C] to-[#0A261D] rounded-xl text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 group-hover:bg-opacity-80 transition-all">
                {isSubmitting ? (
                  <span>جاري تسجيل بيانات الطالب وتفعيل الحساب...</span>
                ) : (
                  <>
                    <span>إتمام التسجيل والانضمام لسنتر ابن الطارق</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>إشراف أكاديمي مباشر وتأمين بيانات الطلاب وأولياء الأمور</span>
            </p>
          </div>
        </form>
      )}
    </div>
  );
};
