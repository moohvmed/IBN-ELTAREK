import { ScheduleItem, AttendanceRecord, GradeRecord, AcademicKPIs } from '../types/dashboard';

// Live records are served by the authenticated API. Empty defaults prevent fictitious grades or attendance from appearing.
export const ACADEMIC_KPIS: AcademicKPIs = {
  totalLectures: 0, attendedLectures: 0, absentLectures: 0, attendanceRate: 0, averageGrade: 0,
  totalExams: 0, rankInBatch: 0, totalInBatch: 0, homeworkCompletionRate: 0,
};
export const MOCK_SCHEDULE: ScheduleItem[] = [];
export const MOCK_ATTENDANCE: AttendanceRecord[] = [];
export const MOCK_GRADES: GradeRecord[] = [];
