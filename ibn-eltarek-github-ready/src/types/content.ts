export type ContentSubject = 'all' | 'geography' | 'history' | 'cartography';
export type ContentTypeFilter = 'all' | 'videos' | 'files';

export interface VideoChapter {
  time: string;
  title: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'atlas' | 'sheet';
  pages: number;
}

export interface OnlineLesson {
  id: string;
  title: string;
  description: string;
  subject: 'geography' | 'history' | 'cartography';
  subjectArabic: string;
  unitOrChapter: string;
  duration: string;
  videoThumbnail: string;
  lectureDate: string;
  tutor: string;
  isWatched?: boolean;
  progress?: number;
  quality: string;
  chapters: VideoChapter[];
  attachedFiles: AttachedFile[];
  keyPoints: string[];
}

export interface AcademicFile {
  id: string;
  title: string;
  category: 'memos' | 'atlases' | 'question_banks' | 'summaries';
  categoryArabic: string;
  subject: 'geography' | 'history' | 'all';
  subjectArabic: string;
  size: string;
  pages: number;
  uploadDate: string;
  downloadCount: number;
  description: string;
  fileType: 'pdf' | 'atlas' | 'sheet';
  badge?: string;
}
