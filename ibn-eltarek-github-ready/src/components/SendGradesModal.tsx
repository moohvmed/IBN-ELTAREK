import React, { useState } from 'react';
import {
  X,
  Phone,
  Send,
  CheckCircle2,
  Share2,
  Calendar,
  Award,
  Clock,
  Sparkles,
  MessageSquare,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { UserAccount } from '../types/auth';
import { MOCK_GRADES, MOCK_SCHEDULE, ACADEMIC_KPIS } from '../data/dashboardData';

interface SendGradesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserAccount;
}

export const SendGradesModal: React.FC<SendGradesModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [recipient, setRecipient] = useState<'parent' | 'student' | 'both'>('parent');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [includeGrades, setIncludeGrades] = useState(true);
  const [includeSchedule, setIncludeSchedule] = useState(true);
  const [includeAttendance, setIncludeAttendance] = useState(true);
  const [includeNotes, setIncludeNotes] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const studentName = user?.linkedStudentName || user?.name || 'الطالب';
  const studentPhone = user?.linkedStudentPhone || user?.phone || '';
  const parentPhone = user?.linkedParentPhone || (user?.role === 'parent' ? user.phone : '') || '';

  const latestExam = MOCK_GRADES[0];
  const nextSession = MOCK_SCHEDULE[0];

  // Build the message preview
  const generateMessage = () => {
    let msg = `🏛️ *تقرير متابعة سنتر ابن الطارق (IBN ELTAREK)*\n`;
    msg += `مادتي التاريخ والجغرافيا للثانوية العامة\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `👤 *اسم الطالب:* ${studentName}\n`;
    msg += `🆔 *كود الطالب:* ${user?.id || 'غير متاح'}\n\n`;

    if (includeGrades && latestExam) {
      msg += `📊 *أحدث نتيجة اختبار:*\n`;
      msg += `• الامتحان: ${latestExam.examTitle}\n`;
      msg += `• المادة: ${latestExam.subjectArabic}\n`;
      msg += `• الدرجة: ${latestExam.score} من ${latestExam.totalScore} (${latestExam.percentage.toFixed(1)}% - ${latestExam.gradeLabel})\n`;
      msg += `• الترتيب: المركز #${latestExam.classRank} على الدفعة\n\n`;
    }

    if (includeSchedule && nextSession) {
      msg += `📅 *موعد الحصة القادمة:*\n`;
      msg += `• اليوم: ${nextSession.day} (${nextSession.date})\n`;
      msg += `• الوقت: ${nextSession.time}\n`;
      msg += `• المادة: ${nextSession.subjectArabic}\n`;
      msg += `• القاعة: ${nextSession.room}\n`;
      msg += `• المعلم: ${nextSession.tutor}\n\n`;
    }

    if (includeAttendance) {
      msg += `📈 *سجل الحضور العام:*\n`;
      msg += `• نسبة الحضور: ${ACADEMIC_KPIS.attendanceRate}% (${ACADEMIC_KPIS.attendedLectures} من ${ACADEMIC_KPIS.totalLectures} حصة)\n`;
      msg += `• التقييم العام: ممتاز ومنتظم\n\n`;
    }

    if (includeNotes && latestExam?.tutorFeedback) {
      msg += `💡 *ملاحظة وتوجيه أ/ طارق عبد الرحمن:*\n`;
      msg += `"${latestExam.tutorFeedback}"\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `سنتر ابن الطارق يتمنى لأبنائنا دوام التفوق والدرجات النهائية. للتحقق: 01023456789`;
    return msg;
  };

  const messageText = generateMessage();

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 2500);
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const targetPhone = recipient === 'parent' ? parentPhone : recipient === 'student' ? studentPhone : parentPhone;
    if (!targetPhone) return;
    const cleanPhone = targetPhone.replace(/^0/, '20');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in" dir="rtl">
      <div className="relative w-full max-w-2xl bg-[#091D33] border border-emerald-900/60 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-6 bg-gradient-to-r from-[#0C2B4E] to-[#0E3A2F] border-b border-emerald-900/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-lg font-bold text-white truncate">
                إرسال الدرجات والمواعيد للهاتف
              </h2>
              <p className="text-[11px] sm:text-xs text-emerald-300/90 truncate">
                ربط حسابات الهاتف وإرسال تقارير الحضور والامتحانات (WhatsApp & SMS)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs text-slate-200">
          {sentSuccess ? (
            <div className="p-8 text-center bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white">
                تم إرسال كشف الدرجات والمواعيد بنجاح!
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                تم تسليم الرسالة فورياً إلى هاتف {recipient === 'parent' ? 'ولي الأمر' : recipient === 'student' ? 'الطالب' : 'الطالب وولي الأمر'} عبر قناة {channel === 'whatsapp' ? 'الواتساب الرسمية' : 'الرسائل النصية SMS'}.
              </p>
              <div className="inline-block font-mono text-[11px] text-emerald-300 bg-emerald-950 px-3 py-1 rounded-lg border border-emerald-500/30">
                رقم الإرسال: {recipient === 'parent' ? parentPhone : studentPhone} · التوقيت: الآن
              </div>
            </div>
          ) : (
            <>
              {/* Linked Accounts Quick Badge */}
              <div className="p-4 rounded-2xl bg-[#061426] border border-emerald-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-white">الحسابات المرتبطة بنظام الهاتف الذكي:</span>
                  </div>
                  <div className="text-slate-300 text-[11px] space-x-reverse space-x-3">
                    <span>📱 هاتف الطالب: <strong className="text-emerald-300 font-mono">{studentPhone}</strong> ({studentName})</span>
                    <span>·</span>
                    <span>📱 هاتف ولي الأمر: <strong className="text-blue-300 font-mono">{parentPhone}</strong></span>
                  </div>
                </div>
                <span className="self-start sm:self-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  ربط موثق ومفعل
                </span>
              </div>

              {/* Step 1: Select Recipient & Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recipient */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    المستلم (الوجهة)
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#061220] rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setRecipient('parent')}
                      className={`py-2 px-2 rounded-lg font-semibold transition-all ${
                        recipient === 'parent'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ولي الأمر ({parentPhone.slice(-4)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecipient('student')}
                      className={`py-2 px-2 rounded-lg font-semibold transition-all ${
                        recipient === 'student'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      الطالب ({studentPhone.slice(-4)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRecipient('both')}
                      className={`py-2 px-2 rounded-lg font-semibold transition-all ${
                        recipient === 'both'
                          ? 'bg-emerald-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      كلاهما معاً
                    </button>
                  </div>
                </div>

                {/* Channel */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    قناة الإرسال
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#061220] rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setChannel('whatsapp')}
                      className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        channel === 'whatsapp'
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                      <span>واتساب (WhatsApp)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel('sms')}
                      className={`py-2 px-3 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        channel === 'sms'
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 text-blue-300" />
                      <span>رسائل نصية SMS</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Content Checkboxes */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  البيانات المرفقة في التقرير
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#061220] border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeGrades}
                      onChange={(e) => setIncludeGrades(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-[11px] font-medium text-white">نتائج الاختبارات</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#061220] border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeSchedule}
                      onChange={(e) => setIncludeSchedule(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-[11px] font-medium text-white">مواعيد الحصص</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#061220] border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeAttendance}
                      onChange={(e) => setIncludeAttendance(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-[11px] font-medium text-white">نسبة الحضور</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#061220] border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={includeNotes}
                      onChange={(e) => setIncludeNotes(e.target.checked)}
                      className="accent-emerald-500 w-4 h-4 rounded"
                    />
                    <span className="text-[11px] font-medium text-white">توجيه المعلم</span>
                  </label>
                </div>
              </div>

              {/* Step 3: Message Live Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    معاينة الرسالة الصادرة إلى {recipient === 'parent' ? `ولي الأمر (${parentPhone})` : `الطالب (${studentPhone})`}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
                    </button>
                    {channel === 'whatsapp' && (
                      <button
                        type="button"
                        onClick={handleOpenWhatsApp}
                        className="text-[11px] text-teal-400 hover:text-teal-300 inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>فتح واتساب ويب</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#050E1A] border border-slate-800 text-[11px] font-mono leading-relaxed whitespace-pre-wrap text-slate-300 max-h-52 overflow-y-auto">
                  {messageText}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!sentSuccess && (
          <div className="p-4 sm:p-6 bg-[#071728] border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400 text-center sm:text-right">
              سيتم التوثيق في سجل الإشعارات التلقائية وتحديث كشف ولي الأمر.
            </span>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-white/5 font-semibold text-xs transition-colors"
              >
                إلغاء
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleSend}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>جاري إرسال التقرير...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال التقرير الآن إلى الهاتف</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
