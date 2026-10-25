import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  BookOpen,
  Award,
  Globe2,
  Calendar,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Video,
  FileText,
  HelpCircle,
  Phone,
  MessageCircle,
  Star,
  ExternalLink,
  Layers,
  Search,
  ArrowRight,
  TrendingUp,
  BookmarkCheck,
  Play,
  Share2,
  Menu,
  X,
  LayoutDashboard,
  Home,
  KeyRound,
  FolderOpen,
} from 'lucide-react';
import { CompassRose } from './CompassRose';
import { WelcomeBanner } from './WelcomeBanner';

interface HomePageProps {
  onOpenPortal: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenVerification?: (contact?: string) => void;
  onOpenPdfManager?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenPortal,
  onOpenAuth,
  onOpenVerification,
  onOpenPdfManager,
}) => {
  // Mobile menu drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Interactive Map Lab State
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Grade filter for schedule
  const [selectedGrade, setSelectedGrade] = useState<'3sec' | '2sec' | '1sec' | 'prep'>('3sec');

  // Mini Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Booking Form State
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    studentName: '',
    phone: '',
    parentPhone: '',
    grade: 'الصف الثالث الثانوي',
    branch: 'المقر الرئيسي (قاعة الأطلس)',
    subject: 'التاريخ والجغرافيا معاً',
  });

  // Interactive Maps Data
  const INTERACTIVE_MAPS = [
    {
      id: 'ussr-collapse',
      title: 'تفكك الاتحاد السوفيتي وإعادة تشكيل خريطة العالم السياسية',
      subject: 'الجغرافيا السياسية — الوحدة التمهيدية والأولى',
      era: 'أواخر القرن العشرين (1991م)',
      coordinates: '55°45′N 37°37′E · قارة أوراسيا',
      description:
        'شهدت خريطة العالم السياسية في أواخر القرن العشرين تغيرات دراماتيكية وسريعة تمثلت في سقوط الكتلة الشيوعية وتفكك الاتحاد السوفيتي إلى 15 دولة مستقلة، وتفكك يوغوسلافيا وتشيكوسلوفاكيا، واتحاد ألمانيا الشرقية والغربية.',
      keyTakeaways: [
        'زيادة عدد الدول المجاورة للصين بعد تفكك الاتحاد السوفيتي.',
        'ظهور دول حبيسة جديدة في آسيا الوسطى (كازاخستان، أوزبكستان، تركمانستان).',
        'تغير خريطة الدول المشاطئة لبحر قزوين وظهور نزاعات حول المياه الإقليمية.',
        'انتصار الرأسمالية وانفراد الولايات المتحدة الأمريكية بالزعامة الدولية (القطبية الأحادية).',
      ],
      examQuestion:
        'في ضوء دراستك لتطور خريطة العالم السياسية، أثر سقوط الاتحاد السوفيتي بشكل مباشر على زيادة عدد الدول المشرفة على:',
      options: [
        'بحر قزوين والبحر الأسود',
        'البحر المتوسط والمحيط الأطلنطي',
        'البحر الأحمر وخليج عدن',
        'المحيط الهندي وخليج البنغال',
      ],
      correctOption: 0,
      explanation:
        'بعد تفكك الاتحاد السوفيتي، أصبحت تطل على بحر قزوين 5 دول بدلاً من دولتين (روسيا وإيران سابقاً)، كما ظهرت دول جديدة مشرفة على البحر الأسود مثل أوكرانيا وجورجيا، مما غيّر التوازنات الجيوسياسية في المنطقة.',
      badge: 'سؤال امتحاني مكرر',
    },
    {
      id: 'strategic-straits',
      title: 'المواقع الاستراتيجية والممرات المائية والمضايق العالمية',
      subject: 'الجغرافيا السياسية — المقومات الطبيعية لقوة الدولة',
      era: 'التجارة الدولية والملاحة البحرية الحديثة',
      coordinates: '29°55′N 32°33′E · قناة السويس والمضايق الكبرى',
      description:
        'المواقع الاستراتيجية هي تلك المواقع التي تكتسب أهمية بالغة نظراً لإشرافها وإمكانية تحكمها في طرق مواصلات بحرية أو برية دولية في أوقات السلم والحرب مثل قناة السويس ومضيق باب المندب وهرمز وجبل طارق.',
      keyTakeaways: [
        'قناة السويس: أهم ممر ملاحي اصطناعي يربط الشرق بالغرب وتحت سيادة مصرية خالصة.',
        'مضيق باب المندب: مضيق عربي خالص تشرف عليه دولتان عربيتان (اليمن وجيبوتي).',
        'مضيق هرمز: ممر تصدير النفط الخليجي للعالم تشرف عليه سلطنة عمان وإيران.',
        'مضيق جبل طارق: يصل البحر المتوسط بالمحيط الأطلنطي وتشرف عليه إسبانيا والمغرب.',
      ],
      examQuestion:
        'أي من المضايق والممرات المائية التالية يمكن وصف إشرافها بأنه «إشراف عربي خالص بنسبة 100%»؟',
      options: [
        'مضيق باب المندب',
        'مضيق هرمز',
        'مضيق جبل طارق',
        'مضيق البوسفور والدردنيل',
      ],
      correctOption: 0,
      explanation:
        'مضيق باب المندب تشرف عليه دولتان عربيتان هما الجمهورية اليمنية من الشرق وجمهورية جيبوتي من الغرب، مما يجعله موقعاً استراتيجياً عربياً خالصاً ذا أهمية أمنية واقتصادية قصوى للأمة العربية ومصر.',
      badge: 'ناتج تعلم أساسي',
    },
    {
      id: 'modern-egypt-history',
      title: 'بناء الدولة المصرية الحديثة في عهد محمد علي وخلفائه',
      subject: 'التاريخ للثانوية العامة — الفصل الثاني',
      era: 'الفترة 1805م – 1848م',
      coordinates: '30°02′N 31°14′E · القاهرة وحوض النيل والشام',
      description:
        'تحليل عبقرية المشروع التنموي والسياسي والعسكري لمحمد علي، تطبيق نظام الاحتكار، التحول من الري الحوضي للري الدائم، بناء الأسطول والمصانع الحربية، وحروب الجزيرة العربية واليونان والشام والسودان حتى تسوية لندن 1840م.',
      keyTakeaways: [
        'تحول الوجه البحري للري الدائم بفضل إنشاء القناطر الخيرية.',
        'الربط بين الصناعة واحتياجات الجيش والأسطول العسكري.',
        'تأثير تسوية لندن 1840 على حرمان مصر من انتصاراتها الخارجية وتجريدها من الشام والحجاز.',
        'تطبيق نظام الاحتكار كان وسيلة لضمان الدخول في سوق التجارة الدولية منافساً لغيرها.',
      ],
      examQuestion:
        'ترتب على استبدال نظام الري الحوضي بالري الدائم في الوجه البحري في عهد محمد علي:',
      options: [
        'زيادة المساحة المحصولية وتوسع زراعة القطن صيفاً',
        'تراجع إنتاج المحاصيل الغذائية الشتوية',
        'إلغاء الملكية الفردية للأراضي الزراعية بالكامل',
        'زيادة هجرة الفلاحين من مصر إلى بلاد الشام',
      ],
      correctOption: 0,
      explanation:
        'بناء القناطر الخيرية وشق الترع كترعة المحمودية أتاح تدفق مياه النيل طوال العام في الدلتا، فتحول الري من ري حوضي (مرة واحدة بالفيضان) إلى ري دائم مما سمح بزراعة أكثر من محصول سنوياً والتوسع في القطن والارز صيفاً.',
      badge: 'ربط تاريخي وجغرافي',
    },
    {
      id: 'economic-blocs',
      title: 'التكتلات الاقتصادية العالمية وتجارب الاندماج الإقليمي',
      subject: 'الجغرافيا السياسية — الوحدة الثالثة (العلاقات الدولية)',
      era: 'مرحلة التكامل الاقتصادي والعولمة',
      coordinates: '50°51′N 4°21′E · بروكسل / إفريقيا / أمريكا الشمالية',
      description:
        'دراسة مراحل نشأة التكتلات الاقتصادية (التجارة التفضيلية، منطقة التجارة الحرة، الاتحاد الجمركي، السوق المشتركة، والوحدة الاقتصادية والاندماج الكامل) وتطبيق ذلك على الاتحاد الأوروبي، الكوميسا، والنفتا (USMCA).',
      keyTakeaways: [
        'شروط كوبنهاجن (تشريعية واقتصادية وسياسية) وضعت بعد اتساع الاتحاد الأوروبي شرقاً.',
        'مصر عضو فاعل في تجمع الكوميسا الذي يضم دول شرق وجنوب إفريقيا.',
        'الاتحاد الجمركي يتميز بفرض تعرفة جمركية موحدة على السلع المستوردة من خارج التكتل.',
        'المقومات الجغرافية كالاتصال الأرضي تعد من أهم شروط نجاح الاتحاد الأوروبي.',
      ],
      examQuestion:
        'أي مرحلة من مراحل تكوين التكتل الاقتصادي التالي يبدأ فيها توحيد السياسة الجمركية أمام دول العالم الخارجي؟',
      options: [
        'مرحلة الاتحاد الجمركي',
        'مرحلة التجارة الحرة',
        'مرحلة السوق المشتركة',
        'مرحلة الوحدة الاقتصادية',
      ],
      correctOption: 0,
      explanation:
        'في مرحلة منطقة التجارة الحرة تُلغى الجمارك بين الأعضاء فقط، لكن في مرحلة «الاتحاد الجمركي» يُحدد رسم جمركي موحد على السلع المستوردة من خارج دول التكتل.',
      badge: 'نظام امتحانات جديد',
    },
  ];

  // Schedule Data
  const SCHEDULE_BY_GRADE = {
    '3sec': [
      {
        subject: 'الجغرافيا السياسية',
        batchName: 'مجموعة النخبة للمتفوقين (A)',
        days: 'الأحد والثلاثاء',
        time: '04:30 م – 06:30 م',
        location: 'المقر الرئيسي — قاعة الأطلس الذكية',
        tutor: 'أ/ طارق عبد الرحمن',
        seatsLeft: 3,
        status: 'متاح للحجز',
      },
      {
        subject: 'التاريخ الحديث والمعاصر',
        batchName: 'مجموعة أوائل الجمهورية (B)',
        days: 'الإثنين والأربعاء',
        time: '05:00 م – 07:00 م',
        location: 'فرع الدقي — قاعة المؤتمرات 02',
        tutor: 'أ/ طارق عبد الرحمن',
        seatsLeft: 1,
        status: 'أوشك على الاكتمال',
      },
      {
        subject: 'تاريخ وجغرافيا تفوق (المشتركة)',
        batchName: 'مجموعة الجمعة المكثفة (C)',
        days: 'الجمعة أسبوعياً',
        time: '01:30 م – 05:30 م',
        location: 'المقر الرئيسي — القاعة الكبرى',
        tutor: 'أ/ طارق وفريق الإشراف',
        seatsLeft: 6,
        status: 'متاح للحجز',
      },
      {
        subject: 'منصة الأونلاين التفاعلية',
        batchName: 'دفعة المحافظات وبث مباشر زووم (Live)',
        days: 'السبت والأربعاء',
        time: '07:30 م – 09:30 م',
        location: 'منصة سنتر ابن الطارق الرقمية',
        tutor: 'أ/ طارق عبد الرحمن',
        seatsLeft: 25,
        status: 'متاح أونلاين',
      },
    ],
    '2sec': [
      {
        subject: 'جغرافيا التنمية والتاريخ الإسلامي',
        batchName: 'مجموعة التأسيس والتميز (G2)',
        days: 'السبت والإثنين',
        time: '03:00 م – 05:00 م',
        location: 'المقر الرئيسي — قاعة 03',
        tutor: 'فريق سنتر ابن الطارق',
        seatsLeft: 8,
        status: 'متاح للحجز',
      },
      {
        subject: 'ورشة الخرائط والمهارات الجغرافية',
        batchName: 'مجموعة التنمية البشرية والبيئية',
        days: 'الخميس',
        time: '05:00 م – 07:00 م',
        location: 'معمل الخرائط الرقمية (GIS)',
        tutor: 'أ/ طارق عبد الرحمن',
        seatsLeft: 5,
        status: 'متاح للحجز',
      },
    ],
    '1sec': [
      {
        subject: 'جغرافيا مصر وتاريخ مصر الفرعوني',
        batchName: 'مجموعة رواد الغد (G1)',
        days: 'الأحد والأربعاء',
        time: '03:00 م – 04:30 م',
        location: 'فرع مصر الجديدة — قاعة التميز',
        tutor: 'نخبة معلمي السنتر',
        seatsLeft: 12,
        status: 'متاح للحجز',
      },
    ],
    prep: [
      {
        subject: 'الدراسات الاجتماعية للشهادة الإعدادية',
        batchName: 'دفعة التفوق والشهادة الإعدادية',
        days: 'الإثنين والخميس',
        time: '02:00 م – 04:00 م',
        location: 'المقر الرئيسي — قاعة الأمل',
        tutor: 'فريق سنتر ابن الطارق',
        seatsLeft: 10,
        status: 'متاح للحجز',
      },
    ],
  };

  // Mini Quiz Questions
  const MINI_QUIZ = [
    {
      question:
        'تعد سويسرا دولة متعددة اللغات لكنها تحافظ على وحدتها وقوتها، السبب الجوهري يرجع إلى:',
      options: [
        'دستور الدولة الذي اعترف باللغات الأربع الرسمية ومارس مبدأ الديمقراطية',
        'موقعها الجغرافي البحري المفتوح على المحيطات الكبرى',
        'امتلاكها لأقوى جيش عسكري هجومي في وسط قارة أوروبا',
        'تجانسها السكاني العرقي والديني المنفرد',
      ],
      correct: 0,
      teacherNote:
        'أحسنت! الاعتراف باللغات الرسمية الأربع (الألمانية، الفرنسية، الإيطالية، الرومانشية) جعل التنوع مصدراً للقوة والاستقرار لا للصراع الداخلي.',
    },
    {
      question:
        'في الفصل الأول من منهج التاريخ، فشلت حركة علي بك الكبير الاستقلالية عام 1768م نتيجة:',
      options: [
        'خيانة محمد بك أبو الذهب وانحيازه للسلطان العثماني',
        'تدخل الأسطول الإنجليزي العسكري ضد المماليك',
        'ثورة الشعب المصري بقيادة علماء الأزهر الشريف',
        'هزيمة قواته في الشام أمام الجيش النمساوي',
      ],
      correct: 0,
      teacherNote:
        'إجابة نموذجية! انحياز محمد بك أبو الدهب للسلطان العثماني وقتله لسيده علي بك الكبير أعاد مصر ولاية عثمانية وأجهض أول محاولة استقلالية في العصر الحديث.',
    },
    {
      question:
        'وفقاً للجغرافيا السياسية، أي من خصائص الدولة التالية تعد من «المقومات المورفولوجية» لقوة الدولة؟',
      options: [
        'المساحة والشكل والتضاريس والموقع',
        'عدد السكان ومعدل المواليد والوفيات',
        'حجم القوات المسلحة ومستوى التدريب العسكري',
        'الناتج المحلي الإجمالي والميزان التجاري',
      ],
      correct: 0,
      teacherNote:
        'ممتاز! المقومات المورفولوجية تتعلق بجغرافية الدولة الطبيعية من حيث مساحتها وشكلها الخارجي وتوزيع تضاريسها وموقعها الفلكي والجغرافي.',
    },
  ];

  const currentQuiz = MINI_QUIZ[quizIndex];

  const handleQuizAnswer = (index: number) => {
    setSelectedOption(index);
    setQuizSubmitted(true);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setQuizIndex((prev) => (prev + 1) % MINI_QUIZ.length);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData.studentName || !bookingData.phone) return;
    setBookingSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#061224] text-slate-100 flex flex-col font-sans selection:bg-emerald-600/30 selection:text-emerald-200" dir="rtl">
      {/* Top Academic Header with Responsive Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-950/70 bg-[#061224]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo & Identity */}
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
              <span className="text-xs text-slate-300 hidden md:block">
                صرح التفوق لمادتي التاريخ والجغرافيا للشهادة الثانوية العامة والإعدادية
              </span>
            </div>
          </div>

          {/* Quick Nav Anchor Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#hero" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              الصفحة الرئيسية
            </a>
            <a href="#maps-lab" className="hover:text-emerald-300 transition-colors">
              معمل الخرائط والأطالس
            </a>
            <a href="#schedules" className="hover:text-emerald-300 transition-colors">
              مواعيد الحصص
            </a>
            <a href="#quiz-spotlight" className="hover:text-emerald-300 transition-colors">
              تدريب تفاعلي
            </a>
            <a href="#honor-roll" className="hover:text-emerald-300 transition-colors">
              أوائل السنتر
            </a>
            <a href="#booking" className="hover:text-emerald-300 transition-colors">
              حجز مقعد
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Direct access to Student Portal Dashboard */}
            <button
              type="button"
              onClick={onOpenPortal}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-md shadow-emerald-950/50 transition-all border border-emerald-400/30 min-h-[38px] cursor-pointer"
              title="دخول مباشر إلى لوحة تحكم ومتابعة الطالب"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline sm:inline">لوحة الطالب</span>
            </button>

            {/* Login / Register Button */}
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold bg-[#0A1F38] hover:bg-[#0E2A4C] text-slate-200 hover:text-white border border-slate-700/80 transition-all min-h-[38px] cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>دخول</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-[#0A1F38] border border-slate-700 flex items-center justify-center min-w-[38px] min-h-[38px] cursor-pointer"
              aria-label="القائمة الرئيسية"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#07172B]/98 border-b border-emerald-900/50 px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-2">
            <nav className="flex flex-col space-y-2 text-sm font-semibold">
              <a
                href="#hero"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 text-emerald-300 hover:bg-emerald-950/60 transition-colors"
              >
                <span>الصفحة الرئيسية</span>
                <ChevronRight className="w-4 h-4 rotate-180 text-emerald-400" />
              </a>
              <a
                href="#maps-lab"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
              >
                <span>معمل الخرائط والأطالس الرقمية</span>
                <Globe2 className="w-4 h-4 text-emerald-400" />
              </a>
              <a
                href="#schedules"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
              >
                <span>مواعيد الحصص والمجموعات</span>
                <Calendar className="w-4 h-4 text-emerald-400" />
              </a>
              <a
                href="#quiz-spotlight"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
              >
                <span>تدريب تفاعلي وسؤال فوري</span>
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </a>
              <a
                href="#honor-roll"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
              >
                <span>لوحة شرف أوائل السنتر</span>
                <Award className="w-4 h-4 text-yellow-400" />
              </a>
              <a
                href="#booking"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl text-slate-300 hover:bg-white/5 transition-colors"
              >
                <span>حجز مقعد جديد في السنتر</span>
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
              </a>

              {onOpenPdfManager && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenPdfManager();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-blue-300 hover:bg-white/5 transition-colors cursor-pointer text-right"
                >
                  <span>مركز رفع وإدارة ملفات الـ PDF</span>
                  <FolderOpen className="w-4 h-4 text-blue-400" />
                </button>
              )}

              {onOpenVerification && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenVerification('01023456789');
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-teal-300 hover:bg-white/5 transition-colors cursor-pointer text-right"
                >
                  <span>شاشة التحقق من كود التأكيد (OTP)</span>
                  <KeyRound className="w-4 h-4 text-teal-400" />
                </button>
              )}
            </nav>

            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenPortal();
                }}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>لوحة الطالب</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAuth('register');
                }}
                className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>طالب جديد</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Home Page Sections */}
      <main className="flex-1 space-y-12 sm:space-y-24 py-4 sm:py-10 pb-28 md:pb-12">
        
        {/* SECTION 1: HERO SECTION */}
        <section id="hero" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <WelcomeBanner />

          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-900/60 bg-gradient-to-b from-[#091D38]/90 via-[#0A2424]/80 to-[#071526]/95 p-4 sm:p-10 lg:p-14 shadow-2xl backdrop-blur-xl">
            {/* Ambient Lighting Gradients */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[11px] sm:text-xs font-semibold text-emerald-300 shadow-inner">
                <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 animate-spin" style={{ animationDuration: '15s' }} />
                <span>المنصة الرسمية المعتمدة · سنتر ابن الطارق IBN ELTAREK 2026</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.25]">
                حيث يلتقي عمق <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">التاريخ</span> بدقة <span className="bg-gradient-to-r from-emerald-400 via-teal-200 to-blue-300 bg-clip-text text-transparent">الخرائط والجغرافيا</span>.
              </h1>

              {/* Sub-headline */}
              <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
                صرح التفوق الأول لطلاب الشهادة الثانوية العامة والمرحلة الإعدادية. شرح تحليلي عميق لنواتج التعلم، تدريب مكثف على قراءة الخرائط السياسية والطبيعية، وبنوك أسئلة المستويات العليا مع كبير معلمين التاريخ والجغرافيا <strong className="text-emerald-400 font-bold">أ/ طارق عبد الرحمن</strong>.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-4">
                <button
                  type="button"
                  onClick={onOpenPortal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white shadow-xl shadow-emerald-950/60 hover:scale-[1.02] transition-all border border-emerald-400/40 min-h-[44px]"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>دخول لوحة تحكم الطالب (عرض فوري)</span>
                  <ChevronRight className="w-4 h-4 rotate-180" />
                </button>

                <a
                  href="#maps-lab"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-[#0A2038] hover:bg-[#0E2E50] text-emerald-300 hover:text-white border border-emerald-500/30 transition-all shadow-md min-h-[44px]"
                >
                  <Globe2 className="w-4 h-4 text-emerald-400" />
                  <span>استكشف معمل الخرائط التفاعلي</span>
                </a>

                <button
                  type="button"
                  onClick={() => onOpenAuth('register')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>تسجيل طالب جديد في السنتر</span>
                </button>
              </div>

              {/* Live Academic Counters / Stats Bar */}
              <div className="pt-6 sm:pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-right">
                <div className="p-3.5 rounded-2xl bg-[#071629]/70 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">+12,500</div>
                  <div className="text-xs text-slate-300 mt-0.5">طالب متفوق في الجمهورية</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#071629]/70 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">98.6%</div>
                  <div className="text-xs text-slate-300 mt-0.5">نسبة التفوق والدرجات النهائية</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#071629]/70 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">+150</div>
                  <div className="text-xs text-slate-300 mt-0.5">خريطة تفاعلية وأطلس تحليلي</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#071629]/70 border border-slate-800">
                  <div className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono">4 فروع</div>
                  <div className="text-xs text-slate-300 mt-0.5">مقرات سنتر + منصة إلكترونية</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 2: THE TWO PILLARS (DEEP BLUE & FOREST GREEN) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              ركائز المنظومة التعليمية في سنتر ابن الطارق
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              منهجية علمية فريدة تدمج بين أصالة السرد التاريخي ودقة التحليل الخرائطي لضمان أعلى درجات الفهم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar 1: History */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#081C38] to-[#0A264D]/60 border border-blue-600/30 p-6 sm:p-8 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-5">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                صرح التاريخ العربي والمعاصر · Deep Blue
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 mb-3">
                منهج التاريخ: الفهم والتحليل وربط الأحداث
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                تحليل معمق للأحداث والشخصيات التاريخية، من الحملة الفرنسية وبناء الدولة المصرية الحديثة في عهد محمد علي، مروراً بالثورة العرابية وثورة 1919، وحتى تاريخ مصر وقضايا العالم العربي المعاصرة وقضية فلسطين.
              </p>
              
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>جداول مقارنة ذكية بين فترات الحكم، المعاهدات، ومواقف الدول الكبرى.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>خطوط زمنية (Timelines) تفاعلية ترتب الأحداث وتكشف العلاقات السببية.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>بنك أسئلة مستويات عليا متوافق مع نظام البابل شيت وتابلت الثانوية.</span>
                </li>
              </ul>
            </div>

            {/* Pillar 2: Geography */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#08221D] to-[#0C382F]/60 border border-emerald-600/30 p-6 sm:p-8 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-5">
                <Globe2 className="w-6 h-6" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                معمل الجغرافيا السياسية والأطالس · Forest Green
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1 mb-3">
                منهج الجغرافيا: قراءة الخريطة ومفاتيح التفكير المكاني
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
                دراسة تفاعلية للجغرافيا السياسية، الحدود السياسية الطبيعية والهندسية، أشكال الدول وعواصمها، التكتلات الاقتصادية، الأحلاف العسكرية كحلف الناتو، وحل مشكلات الخرائط الصماء بدقة متناهية.
              </p>

              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>معمل رقمي لتحليل خرائط العالم السياسية وقارات العالم قبل وبعد التحولات الكبرى.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>ربط المواقع الاستراتيجية والممرات المائية بالمصالح الجيوسياسية للدول.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تدريب على استنتاج نواتج التعلم الصعبة التي تُميز الطالب الأول عن غيره.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* SECTION 3: INTERACTIVE MAP & CARTOGRAPHY LAB */}
        <section id="maps-lab" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-emerald-900/60 bg-gradient-to-br from-[#07182C] via-[#09221F] to-[#071626] p-6 sm:p-8 lg:p-10 shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>معمل الخرائط والأطالس الرقمية لسنتر ابن الطارق</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  استكشف خرائط المنهج ونواتج التعلم التفاعلية
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  اختر خريطة لاستعراض التحليل الجغرافي ونواتج التعلم الامتحانية وسؤال المستويات العليا المباشر.
                </p>
              </div>

              {/* Active Map Counter */}
              <div className="flex items-center gap-2 bg-[#061424] px-4 py-2 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>الخريطة {selectedMapIndex + 1} من {INTERACTIVE_MAPS.length}</span>
              </div>
            </div>

            {/* Map Selection Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 py-6">
              {INTERACTIVE_MAPS.map((map, idx) => (
                <button
                  key={map.id}
                  type="button"
                  onClick={() => {
                    setSelectedMapIndex(idx);
                    setShowAnswer(false);
                  }}
                  className={`p-3 rounded-2xl text-right transition-all border ${
                    selectedMapIndex === idx
                      ? 'bg-gradient-to-r from-emerald-950 to-teal-950 border-emerald-500/60 shadow-lg text-white ring-1 ring-emerald-400/40'
                      : 'bg-[#081A2E]/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <div className="text-[10px] text-emerald-400 font-mono font-bold">
                    خريطة رقم 0{idx + 1}
                  </div>
                  <div className="text-xs font-bold truncate mt-0.5">
                    {map.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Active Map Content Spotlight */}
            {(() => {
              const currentMap = INTERACTIVE_MAPS[selectedMapIndex];
              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left Column: Visual Projection & Details */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-[#061426] p-5 shadow-inner">
                      <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                        <span className="text-emerald-400 font-mono font-medium">
                          {currentMap.coordinates}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[11px] text-emerald-300 font-bold">
                          {currentMap.badge}
                        </span>
                      </div>

                      <div className="py-4 space-y-2">
                        <div className="text-xs uppercase font-bold tracking-wider text-teal-300">
                          {currentMap.subject} · {currentMap.era}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-white">
                          {currentMap.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                          {currentMap.description}
                        </p>
                      </div>

                      {/* Takeaways list */}
                      <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                          <span>أهم نواتج التعلم المتوقعة في الامتحان:</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {currentMap.keyTakeaways.map((point, pIdx) => (
                            <div
                              key={pIdx}
                              className="p-2.5 rounded-xl bg-[#091F33] border border-slate-800 text-[11px] text-slate-200 leading-normal flex items-start gap-2"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Real Exam Practice Question from the Map */}
                  <div className="lg:col-span-5 rounded-2xl bg-[#091F38] border border-emerald-500/30 p-5 sm:p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                      <span className="text-yellow-400 font-bold flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" />
                        سؤال المستويات العليا من الخريطة
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">نظام التابلت الحديث</span>
                    </div>

                    <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      {currentMap.examQuestion}
                    </p>

                    {/* Choices */}
                    <div className="space-y-2 pt-1">
                      {currentMap.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                            showAnswer && optIdx === currentMap.correctOption
                              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                              : 'bg-[#061426] border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="inline-block w-5 h-5 rounded-full bg-slate-800 text-center leading-5 text-[10px] ml-2 text-slate-400">
                            {['أ', 'ب', 'ج', 'د'][optIdx]}
                          </span>
                          {opt}
                        </div>
                      ))}
                    </div>

                    {/* Show Answer Toggle */}
                    <div className="pt-2">
                      {!showAnswer ? (
                        <button
                          type="button"
                          onClick={() => setShowAnswer(true)}
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold transition-all shadow-md"
                        >
                          إظهار الإجابة النموذجية والتفسير العلمي
                        </button>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-slate-200 space-y-1.5">
                          <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>تفسير أ/ طارق عبد الرحمن للإجابة:</span>
                          </div>
                          <p className="leading-relaxed text-[11px] text-slate-300">
                            {currentMap.explanation}
                          </p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              );
            })()}

          </div>
        </section>

        {/* SECTION 4: SCHEDULES & CLASS BATCHES */}
        <section id="schedules" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300 mb-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>مواعيد الحصص والمجموعات لعام 2026</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                جدول حصص ومجموعات سنتر ابن الطارق
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                مواعيد المقرات الحضورية ومنصة البث المباشر للأونلاين. اختر مرحلتك الدراسية للاطلاع على المجموعات.
              </p>
            </div>

            {/* Grade Switcher Tabs - Horizontally scrollable on mobile */}
            <div className="flex items-center gap-1.5 p-1 bg-[#08182B] border border-slate-800 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
              {[
                { id: '3sec', label: 'الصف الثالث الثانوي' },
                { id: '2sec', label: 'الصف الثاني الثانوي' },
                { id: '1sec', label: 'الصف الأول الثانوي' },
                { id: 'prep', label: 'الشهادة الإعدادية' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedGrade(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
                    selectedGrade === tab.id
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SCHEDULE_BY_GRADE[selectedGrade].map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#091F38]/85 border border-slate-800 hover:border-emerald-500/40 p-5 transition-all shadow-lg space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    {item.subject}
                  </span>
                  <span className="text-[11px] text-yellow-400 bg-yellow-950/40 border border-yellow-500/30 px-2 py-0.5 rounded font-medium">
                    {item.status} ({item.seatsLeft} مقاعد)
                  </span>
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    {item.batchName}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.days} · {item.time}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.location}</span>
                  </div>
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-1 text-emerald-300 hover:text-white font-bold transition-colors"
                  >
                    <span>حجز مقعد الآن</span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE MINI QUIZ (TEST YOUR KNOWLEDGE) */}
        <section id="quiz-spotlight" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-blue-900/50 bg-gradient-to-l from-[#081E3B] via-[#092233] to-[#07172B] p-6 sm:p-10 shadow-2xl">
            <div className="max-w-3xl mx-auto space-y-6">
              
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-xs font-semibold text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>تحدي نواتج التعلم الفوري · اختبر مستواك في دقيقة</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  سؤال من امتحانات الثانوية العامة مع التصحيح الفوري
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  السؤال {quizIndex + 1} من {MINI_QUIZ.length} · اضغط على الإجابة لتكتشف تقييمك وتفسير مدرس المادة
                </p>
              </div>

              {/* Question Card */}
              <div className="rounded-2xl bg-[#061426]/90 border border-slate-800 p-5 sm:p-6 space-y-4 shadow-inner">
                <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
                  {currentQuiz.question}
                </div>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQuiz.options.map((opt, i) => {
                    const isSelected = selectedOption === i;
                    const isCorrect = i === currentQuiz.correct;

                    let optionStyle = 'bg-[#081A2E] border-slate-800 text-slate-200 hover:border-emerald-500/50';
                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-rose-950 border-rose-400 text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleQuizAnswer(i)}
                        className={`w-full text-right p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                            {['أ', 'ب', 'ج', 'د'][i]}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {quizSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation note when answered */}
                {quizSubmitted && (
                  <div className="p-4 rounded-xl bg-[#08221D] border border-emerald-500/40 space-y-2 text-xs text-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300">
                        {selectedOption === currentQuiz.correct ? '🎉 إجابة صحيحة وممتازة!' : '⚠️ انتبه لنواتج التعلم الدقيقة:'}
                      </span>
                      <button
                        type="button"
                        onClick={handleNextQuiz}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                      >
                        السؤال التالي ←
                      </button>
                    </div>
                    <p className="leading-relaxed text-slate-300">
                      {currentQuiz.teacherNote}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 6: HONOR ROLL (TOP SCORERS) */}
        <section id="honor-roll" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-950/60 border border-yellow-500/30 text-xs font-semibold text-yellow-300">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>لوحة شرف أوائل الجمهورية والسنتر</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              أبطال سنتر ابن الطارق في امتحانات الثانوية العامة
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              قصص نجاح ملهمة لطلاب حصدوا الدرجات النهائية والتحقوا بكليات القمة الأدبية.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'سلمى محمود العوضي',
                rank: 'المركز الثاني جمهورية (أدبي)',
                score: '60/60 تاريخ · 59.5/60 جغرافيا',
                college: 'كلية الاقتصاد والعلوم السياسية (جامعة القاهرة)',
                quote: 'سنتر ابن الطارق علمني إزاي أقرا الخريطة من غير ما أحفظ صم، التاريخ كان كأنه رواية بنعيشها.',
                img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
              },
              {
                name: 'عمر خالد المنشاوي',
                rank: 'المركز الخامس على محافظة القاهرة',
                score: '60/60 جغرافيا سياسية تفوق',
                college: 'كلية الإعلام (قسم الإذاعة والتلفزيون)',
                quote: 'مذكرات الأطلس وبنك الأسئلة في السنتر هي اللي دخلتني الامتحان وأنا واثق من كل نقطة.',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
              },
              {
                name: 'مريم أحمد عبد الصبور',
                rank: 'المركز الأول على إدارة شرق التعليمية',
                score: '60/60 تاريخ حديث ومعاصر',
                college: 'كلية الألسن (قسم اللغة الإنجليزية)',
                quote: 'المتابعة الدورية بعد كل حصة وكشف الدرجات الأسبوعي خلاني دايماً في الصدارة.',
                img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
              },
              {
                name: 'يوسف هاني عبد العال',
                rank: 'من أوائل شعبة أدبي دفعة 2025',
                score: '59.5/60 في المادتين',
                college: 'كلية الآثار والحضارات القديمة',
                quote: 'أستاذ طارق مش بس مدرس، دا مرشد أكاديمي بيشرح نواتج التعلم كأنه واضع الامتحان.',
                img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
              },
            ].map((hero, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#091F38]/90 border border-slate-800 hover:border-yellow-500/40 p-5 space-y-3.5 transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={hero.img}
                      alt={hero.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400/50 shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{hero.name}</div>
                      <div className="text-[11px] text-emerald-400 font-semibold">{hero.rank}</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#061426] border border-slate-800 text-[11px] font-mono text-yellow-300">
                    {hero.score}
                  </div>

                  <p className="text-[11px] text-slate-300 italic leading-relaxed">
                    "{hero.quote}"
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-medium">
                  {hero.college}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: BOOKING & RESERVATION FORM */}
        <section id="booking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-emerald-800/40 bg-gradient-to-br from-[#081B30] via-[#0A2624] to-[#071626] p-6 sm:p-10 lg:p-12 shadow-2xl">
            
            {/* Left side: Information */}
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>حجز المقاعد للعام الدراسي 2026/2027</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                احجز مقعدك الآن في صرح ابن الطارق للتفوق
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                نظراً لكثافة المجموعات المحدودة لضمان أقصى تركيز ومتابعة شخصية لكل طالب، يرجى ملء بيانات التسجيل وسيتواصل معك فريق شؤون الطلاب خلال 24 ساعة لتأكيد الحجز واستلام كود باركود الحضور.
              </p>

              <div className="space-y-2.5 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>المقر الرئيسي: تقاطع شارع النخبة مع ميدان الثقافة (قاعة الأطلس)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>الخط الساخن والدعم الأكاديمي: 01002345678 - 01229876543</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>متابعة أسبوعية مباشرة لولي الأمر بكشف الدرجات ونسب الحضور</span>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-[#091F38]/95 border border-emerald-500/30 p-6 sm:p-8 shadow-xl">
                {bookingSubmitted ? (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-lg font-bold text-white">تم استلام طلب الحجز بنجاح!</h4>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                      أهلاً بك يا <strong>{bookingData.studentName}</strong> في سنتر ابن الطارق. تم تسجيل مقعدك وسيرسل لك منسق الفرع رسالة واتساب بكود الطالب وموعد الحصة التمهيدية.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBookingSubmitted(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:text-white"
                    >
                      تسجيل حجز طالب آخر
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        اسم الطالب ثلاثي *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.studentName}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, studentName: e.target.value })
                        }
                        placeholder="مثال: يوسف أحمد عبد المنعم"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#061426] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          رقم هاتف الطالب (واتساب) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingData.phone}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, phone: e.target.value })
                          }
                          placeholder="010XXXXXXXX"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#061426] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-left font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          رقم هاتف ولي الأمر *
                        </label>
                        <input
                          type="tel"
                          required
                          value={bookingData.parentPhone}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, parentPhone: e.target.value })
                          }
                          placeholder="012XXXXXXXX"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#061426] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-left font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          المرحلة الدراسية
                        </label>
                        <select
                          value={bookingData.grade}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, grade: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#061426] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option>الصف الثالث الثانوي</option>
                          <option>الصف الثاني الثانوي</option>
                          <option>الصف الأول الثانوي</option>
                          <option>الشهادة الإعدادية</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          الفرع أو نظام الحضور
                        </label>
                        <select
                          value={bookingData.branch}
                          onChange={(e) =>
                            setBookingData({ ...bookingData, branch: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#061426] border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                        >
                          <option>المقر الرئيسي (قاعة الأطلس)</option>
                          <option>فرع الدقي</option>
                          <option>فرع مصر الجديدة</option>
                          <option>المنصة أونلاين (بث مباشر)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50"
                    >
                      تأكيد حجز المقعد فـوراً
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Global Academic Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#061224]/95 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <CompassRose size={36} interactive={false} />
              <div>
                <div className="text-sm font-black text-white">IBN ELTAREK CENTER · سنتر ابن الطارق</div>
                <div className="text-xs text-slate-400">صرح التدريب والتفوق لمادتي التاريخ والجغرافيا</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <a href="#hero" className="hover:text-emerald-300 transition-colors">الصفحة الرئيسية</a>
              <span>·</span>
              <a href="#maps-lab" className="hover:text-emerald-300 transition-colors">معمل الخرائط</a>
              <span>·</span>
              <a href="#schedules" className="hover:text-emerald-300 transition-colors">جدول المجموعات</a>
              <span>·</span>
              <button onClick={onOpenPortal} className="text-emerald-400 hover:underline">لوحة تحكم الطالب</button>
              <span>·</span>
              <button onClick={() => onOpenAuth('login')} className="hover:text-white">بوابة تسجيل الدخول</button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400 text-center sm:text-right">
            <span>جميع الحقوق محفوظة © 2026 سنتر ابن الطارق (IBN ELTAREK) · إشراف أ/ طارق عبد الرحمن</span>
            <span>تصميم وتطوير المنصة التعليمية المتكاملة للثانوية العامة</span>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Dock (Thumb-Zone Ergonomics) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#061426]/95 backdrop-blur-lg border-t border-emerald-950/80 flex items-center justify-around py-1.5 px-2 pb-[calc(env(safe-area-inset-bottom,0px)+8px)] shadow-2xl">
        <a
          href="#hero"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <Home className="w-5 h-5 text-emerald-400" />
          <span className="text-[10px] font-medium">الرئيسية</span>
        </a>

        <a
          href="#maps-lab"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <Globe2 className="w-5 h-5 text-teal-400" />
          <span className="text-[10px] font-medium">الخرائط</span>
        </a>

        <a
          href="#schedules"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <Calendar className="w-5 h-5 text-blue-400" />
          <span className="text-[10px] font-medium">المواعيد</span>
        </a>

        <a
          href="#booking"
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 text-slate-400 hover:text-emerald-300 transition-colors"
        >
          <BookmarkCheck className="w-5 h-5 text-amber-400" />
          <span className="text-[10px] font-medium">حجز مقعد</span>
        </a>

        <button
          type="button"
          onClick={onOpenPortal}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] py-1 text-emerald-300 font-bold hover:text-white transition-colors cursor-pointer"
        >
          <div className="p-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
            <LayoutDashboard className="w-4 h-4 text-emerald-300" />
          </div>
          <span className="text-[10px]">لوحة الطالب</span>
        </button>
      </nav>
    </div>
  );
};
