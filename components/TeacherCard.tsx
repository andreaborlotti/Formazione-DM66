import React from 'react';
import { Teacher, CourseSession } from '../types';

interface TeacherCardProps {
  teacher: Teacher;
}

const StatusBadge: React.FC<{ status: CourseSession['status']; hours: number }> = ({ status, hours }) => {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center justify-center min-w-[3.5rem] px-2 py-0.5 rounded text-sm font-bold bg-green-100 text-green-700 border border-green-200">
        {hours} h
      </span>
    );
  }
  if (status === 'registered') {
    return (
      <span className="inline-flex items-center justify-center min-w-[3.5rem] px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        Iscritto
      </span>
    );
  }
  if (status === 'absent') {
    return (
      <span className="inline-flex items-center justify-center min-w-[3.5rem] px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
        Assente
      </span>
    );
  }
  // Case for 'none' (empty cell in CSV)
  return (
    <span className="inline-flex items-center justify-center min-w-[3.5rem] px-2 py-0.5 text-xs text-slate-300">
      -
    </span>
  );
};

const TeacherCard: React.FC<TeacherCardProps> = ({ teacher }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Header Parte Superiore */}
      <div className="bg-slate-50/80 border-b border-slate-100 p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-4">
           <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
             {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
           </div>
           <div>
            <h3 className="text-xl font-bold text-slate-900">
                {teacher.lastName} {teacher.firstName}
            </h3>
            <p className="text-sm text-slate-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.012.006.009.004.003.001zM10 5a4 4 0 110 8 4 4 0 010-8z" clipRule="evenodd" />
                </svg>
                {teacher.school}
            </p>
           </div>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200 shadow-sm self-end sm:self-auto">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ore Totali</p>
            <p className="text-xl font-bold text-primary-600 leading-none">{teacher.totalHours}</p>
          </div>
        </div>
      </div>

      {/* Dettaglio Corsi Parte Inferiore */}
      <div className="p-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6 border-b border-slate-100 pb-2">
            Formazione Svolta
        </h4>
        
        {teacher.courseGroups.length > 0 ? (
          <div className="flex flex-col gap-8">
            {teacher.courseGroups.map((group, idx) => (
              <div key={idx} className="relative">
                {/* 1. Nome del Corso (Una sola volta) */}
                <h5 className="text-lg font-bold text-primary-700 mb-3 border-l-4 border-primary-500 pl-3">
                  {group.title}
                </h5>

                {/* 2. Elenco delle Lezioni/Sessioni (Sotto) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4">
                  {group.sessions.map((session, sIdx) => (
                    <div 
                      key={sIdx}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        session.status === 'none' 
                          ? 'border-slate-100 bg-slate-50 text-slate-400' 
                          : session.status === 'absent'
                            ? 'border-red-100 bg-red-50/30'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${session.status === 'none' ? 'text-slate-300' : 'text-slate-400'}`}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={`text-sm font-medium ${session.status === 'none' ? 'text-slate-400' : 'text-slate-600'}`}>
                          {session.dateInfo || "Data non specificata"}
                        </span>
                      </div>
                      
                      <StatusBadge status={session.status} hours={session.hours} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">Nessun corso registrato per questo docente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCard;