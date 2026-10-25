import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  Shield,
  CreditCard,
  Bell,
  CheckCircle2,
  BookOpen,
  Lock,
  Edit3,
  Save,
  QrCode,
  GraduationCap,
  Share2,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { UserAccount } from '../types/auth';
import { SendGradesModal } from './SendGradesModal';

interface StudentProfileProps {
  user: UserAccount;
  onNavigateToHome: () => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({
  user,
  onNavigateToHome,
}) => {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [studentPhone, setStudentPhone] = useState(
    user.linkedStudentPhone || (user.role === 'student' ? user.phone : '') || ''
  );
  const [parentPhone, setParentPhone] = useState(
    user.linkedParentPhone || (user.role === 'parent' ? user.phone : '') || ''
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const isParent = user.role === 'parent';

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPhone(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-l from-[#0A2038] via-[#0B2A22] to-[#07182B] border border-emerald-900/40 p-4 sm:p-8 shadow-xl">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-4 sm:gap-6">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-emerald-500/30 shadow-2xl"
            />
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow">
              {isParent ? 'حساب ولي أمر' : 'حساب طالب'}
            </span>
          </div>

          <div className="space-y-1.5 sm:space-y-2 text-center md:text-right flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl sm:text-3xl font-black text-white">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
                كود: {user.id}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300">
              {user.specializationOrGrade}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>سنتر ابن الطارق — المقر الرئيسي</span>
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                <span>المعلم: أ/ طارق عبد الرحمن</span>
              </span>
            </div>
          </div>

          {/* Barcode / ID Badge */}
          <div className="p-2.5 sm:p-3 bg-[#061220] rounded-2xl border border-slate-800 text-center shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white p-1 rounded-xl flex items-center justify-center">
              <QrCode className="w-14 h-14 sm:w-18 sm:h-18 text-slate-900" />
            </div>
            <span className="block mt-1 text-[9px] sm:text-[10px] text-slate-400 font-mono">
              باركود الحضور الذكي
            </span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>تم حفظ وتحديث بيانات الاتصال الخاصة بالحساب بنجاح.</span>
        </div>
      )}

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Personal & Academic Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Contact & Registration Details */}
          <div className="rounded-2xl p-6 bg-[#091D33] border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  البيانات الشخصية وبيانات التواصل
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingPhone(!isEditingPhone)}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingPhone ? 'إلغاء التعديل' : 'تحديث أرقام الهاتف'}</span>
              </button>
            </div>

            {isEditingPhone ? (
              <form onSubmit={handleSaveContact} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      رقم هاتف الطالب (واتساب)
                    </label>
                    <input
                      type="text"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full bg-[#061220] border border-slate-700 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">
                      رقم هاتف ولي الأمر (لإرسال الدرجات والغياب)
                    </label>
                    <input
                      type="text"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full bg-[#061220] border border-slate-700 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all inline-flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ التعديلات</span>
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-[#061220] border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-1">البريد الإلكتروني المسجل:</span>
                  <span className="font-semibold text-white font-mono">{user.email}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#061220] border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-1">رقم هاتف الطالب:</span>
                  <span className="font-semibold text-emerald-300 font-mono">{studentPhone}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#061220] border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-1">هاتف ولي الأمر (للمتابعة الدورية):</span>
                  <span className="font-semibold text-white font-mono">{parentPhone}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#061220] border border-slate-800/80">
                  <span className="text-slate-400 block text-[11px] mb-1">المجموعة والقاعة:</span>
                  <span className="font-semibold text-white">مجموعة النخبة A (الأحد والثلاثاء)</span>
                </div>
              </div>
            )}

            {/* Account Linking Status & Dispatch Feature */}
            <div className="mt-4 p-4 rounded-xl bg-[#071D30] border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>حالة ربط الحساب برقم الهاتف (مفعل 100%)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  هاتف الطالب ({studentPhone}) مربوط بهاتف ولي الأمر ({parentPhone}) لتسهيل الدخول بدون كلمة سر وإرسال الدرجات والمواعيد.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSendModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>إرسال كشف الدرجات والمواعيد لهاتف ولي الأمر</span>
              </button>
            </div>
          </div>

          {/* Card 2: Academic Track & Center Discipline */}
          <div className="rounded-2xl p-6 bg-[#091D33] border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                المسار الدراسي والتخصص في سنتر ابن الطارق
              </h3>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#061220] border border-slate-800">
                <span className="font-medium text-white">1. مادة الجغرافيا السياسية (Political Geography)</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  نسبة التحصيل: 96%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#061220] border border-slate-800">
                <span className="font-medium text-white">2. مادة التاريخ الحديث والمعاصر (Modern History)</span>
                <span className="text-blue-400 font-bold bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-500/20">
                  نسبة التحصيل: 92%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#061220] border border-slate-800">
                <span className="font-medium text-white">3. ورشة الخرائط الصماء وتحليل نواتج التعلم</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  إتقان 100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Subscription & Security Settings */}
        <div className="space-y-6">
          
          {/* Subscription & Fee Status */}
          <div className="rounded-2xl p-6 bg-[#091D33] border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                حالة الاشتراك والمصروفات
              </h3>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">حالة الكارت:</span>
                <span className="font-bold text-emerald-300">نشط ومفعل</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">شهر سبتمبر 2026:</span>
                <span className="text-emerald-400 font-semibold">مسدد بالكامل</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">شهر أكتوبر 2026:</span>
                <span className="text-emerald-400 font-semibold">مسدد بالكامل</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-emerald-800/40">
                <span className="text-slate-300">استلام المذكرات:</span>
                <span className="text-slate-200">مذكرة الفصل الأول + أطلس الخرائط</span>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="rounded-2xl p-6 bg-[#091D33] border border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Bell className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                إخطارات ولي الأمر الفورية
              </h3>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 rounded" />
                <span>إرسال رسائل SMS بدرجات الامتحانات الدورية</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 rounded" />
                <span>إرسال إشعار فوري عند مسح باركود الحضور أو التأخير</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-emerald-500 w-4 h-4 rounded" />
                <span>تنبيهات مواعيد ورش الخرائط والمراجعات النهائية</span>
              </label>
            </div>
          </div>

          {/* Quick Action Button to return to Dashboard */}
          <button
            type="button"
            onClick={onNavigateToHome}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all text-center"
          >
            الرجوع إلى الشاشة الرئيسية (جدول الحصص والدرجات)
          </button>
        </div>
      </div>

      {/* Send Grades Modal */}
      <SendGradesModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        user={{
          ...user,
          phone: studentPhone,
          linkedParentPhone: parentPhone,
        }}
      />
    </div>
  );
};
