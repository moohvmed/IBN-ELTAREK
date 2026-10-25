export type SubjectType = 'history' | 'geography' | 'all';

export interface ScheduleItem {
  id: string;
  day: string;
  date: string;
  time: string;
  subject: 'history' | 'geography';
  subjectArabic: string;
  title: string;
  tutor: string;
  room: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  badge: string;
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  lectureNumber: number;
  date: string;
  subject: 'history' | 'geography';
  subjectArabic: string;
  topic: string;
  status: 'present' | 'absent' | 'excused' | 'late';
  checkInTime: string;
  hall: string;
  recordedBy: string;
}

export interface GradeRecord {
  id: string;
  examTitle: string;
  examType: 'quiz' | 'monthly' | 'map_test' | 'comprehensive';
  examTypeArabic: string;
  subject: 'history' | 'geography';
  subjectArabic: string;
  score: number;
  totalScore: number;
  percentage: number;
  gradeLabel: 'ممتاز' | 'جيد جداً' | 'جيد' | 'يحتاج تحسين';
  classRank: number;
  totalStudents: number;
  date: string;
  tutorFeedback: string;
}

export interface AcademicKPIs {
  totalLectures: number;
  attendedLectures: number;
  absentLectures: number;
  attendanceRate: number;
  averageGrade: number;
  totalExams: number;
  rankInBatch: number;
  totalInBatch: number;
  homeworkCompletionRate: number;
}
