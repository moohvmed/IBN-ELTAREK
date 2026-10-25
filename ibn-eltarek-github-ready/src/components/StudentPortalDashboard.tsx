import React, { useState } from 'react';
import { UserAccount } from '../types/auth';
import { HISTORICAL_SPOTLIGHTS } from '../data/siteData';
import { CompassRose } from './CompassRose';
import {
  LogOut,
  MapPin,
  Calendar,
  Clock,
  Video,
  FileText,
  Compass,
  Layers,
  Award,
  ChevronRight,
  BookOpen,
  Globe2,
  ExternalLink,
} from 'lucide-react';

interface StudentPortalDashboardProps {
  user: UserAccount;
  onLogout: () => void;
}

export const StudentPortalDashboard: React.FC<StudentPortalDashboardProps> = ({
  user,
  onLogout,
}) => {
  const [activeSpotlightIdx, setActiveSpotlightIdx] = useState(0);
  const spotlight = HISTORICAL_SPOTLIGHTS[activeSpotlightIdx];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Academic Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#071324]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CompassRose size={36} interactive={false} />
            <div>
              <span className="font-semibold text-white tracking-wide text-sm sm:text-base flex items-center gap-2">
                IBN ELTAREK CENTER
                <span className="text-[11px] font-normal text-emerald-400 border border-emerald-500/30 bg-emerald-950/50 px-2 py-0.5 rounded uppercase tracking-wider">
                  سنتر ابن الطارق
                </span>
              </span>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                منصة التفوق لمادتي التاريخ والجغرافيا | Geography & History Tutoring Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pr-3 border-r border-slate-800">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div className="text-right hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {user.name}
                </div>
                <div className="text-[11px] text-emerald-400 capitalize">
                  {user.role} · ID: {user.id}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-rose-950/40 hover:border-rose-500/40 border border-slate-700/60 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-[#0B1E38] via-[#0D2924] to-[#0A1A2F] border border-emerald-900/40 shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 pointer-events-none hidden md:block">
            <svg viewBox="0 0 400 400" className="w-full h-full stroke-emerald-400" fill="none">
              <circle cx="200" cy="200" r="160" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="120" strokeWidth="1.5" />
              <line x1="200" y1="20" x2="200" y2="380" strokeWidth="1" />
              <line x1="20" y1="200" x2="380" y2="200" strokeWidth="1" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 tracking-wider uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>العام الدراسي الحالي · سنتر ابن الطارق (IBN ELTAREK)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              أهلاً بك مجدداً، {user.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
              {user.specializationOrGrade}. لديك محاضرة مباشرة وتدريب خرائط تفاعلي مجدول اليوم.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-xs font-medium rounded-xl shadow-md transition-all">
                <Video className="w-4 h-4" />
                <span>دخول قاعة البث المباشر والحصص</span>
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#12243A] hover:bg-[#18314E] text-slate-200 text-xs font-medium rounded-xl border border-slate-700/80 transition-all">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span>فتح أطلس الخرائط التفاعلي</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid Sections: Next Tutoring Session & Assigned Study Cartography */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Next Live Session */}
          <div className="lg:col-span-2 bg-[#09182C] border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>Immediate Tutoring Commitment</span>
                </div>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  Confirmed
                </span>
              </div>

              <div className="mt-5">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {user.nextSession?.topic}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Lead Instructor / Mentee:{' '}
                  <span className="text-emerald-300 font-medium">
                    {user.nextSession?.tutorOrStudent}
                  </span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-3.5 bg-[#061120] rounded-xl border border-slate-800/80 flex items-start gap-3">
                    <Clock className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                        Scheduled Time
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5">
                        {user.nextSession?.time}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-[#061120] rounded-xl border border-slate-800/80 flex items-start gap-3">
                    <Video className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                        Location / Room
                      </div>
                      <div className="text-xs font-semibold text-white mt-0.5">
                        {user.nextSession?.room}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Required prep: Read Dunhuang Caves Cartography excerpt (Ch. 4)</span>
              <button className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1">
                <span>View Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Academic Progress & Discipline Scores */}
          <div className="bg-[#09182C] border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Curriculum Progress</span>
                </div>
                <span className="text-xs text-slate-400">Term II</span>
              </div>

              <div className="space-y-4 mt-5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Spatial Demographics & Migration</span>
                    <span className="text-emerald-400 font-semibold">94%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">AP Historical Document Analysis (DBQ)</span>
                    <span className="text-teal-400 font-semibold">88%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Cartographic Projections & Distortions</span>
                    <span className="text-blue-400 font-semibold">96%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '96%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <div className="p-3 bg-[#061120] rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Next Tutor Assessment: Oct 12, 2026</span>
                <span className="text-emerald-400 font-medium">On Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Historical & Geographic Artifact Viewer */}
        <div className="bg-[#09182C] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" />
                <span>Interactive Historical Geographic Case Studies</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                Archival Coordinate of the Day
              </h2>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-[#061120] rounded-xl border border-slate-800">
              {HISTORICAL_SPOTLIGHTS.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSpotlightIdx(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeSpotlightIdx === idx
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <MapPin className="w-3.5 h-3.5" />
                <span>{spotlight.coordinates}</span>
                <span className="text-slate-600">·</span>
                <span>{spotlight.elevation}</span>
              </div>

              <h3 className="text-2xl font-bold text-white tracking-tight">
                {spotlight.title}
              </h3>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {spotlight.epoch} — {spotlight.location}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pt-2">
                {spotlight.historicalSignificance}
              </p>

              <div className="p-4 bg-[#061120] rounded-xl border border-emerald-900/30 text-xs text-slate-300 flex items-start gap-3 mt-4">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-300 block mb-0.5">
                    Faculty Tutoring Note
                  </span>
                  <span>{spotlight.curatorNote}</span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-[#061120] rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-semibold text-slate-300 uppercase tracking-wider">
                    Cartographic Projection
                  </span>
                  <span className="text-emerald-400 font-mono">{spotlight.projection}</span>
                </div>
                <div className="aspect-video w-full rounded-lg bg-[#0A1A2E] border border-slate-800 flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-blue-900/20" />
                  <CompassRose size={72} interactive={true} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Study Guide Available</span>
                <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1">
                  <span>Open Document</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
