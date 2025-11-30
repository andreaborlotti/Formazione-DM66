import React from 'react';
import { Teacher } from '../types';
import TeacherCard from './TeacherCard';

interface TeacherListProps {
  teachers: Teacher[];
  hasSearched: boolean;
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers, hasSearched }) => {
  // Se non è stata fatta una ricerca, non mostriamo nulla qui (lo gestisce App.tsx con un banner compatto)
  if (!hasSearched) {
    return null;
  }

  if (teachers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800">Nessun docente trovato</h3>
        <p className="text-slate-500 mt-1 text-sm">Prova a modificare i filtri di ricerca.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-lg font-bold text-slate-800">
           Risultati Ricerca
           <span className="ml-2 inline-flex items-center justify-center bg-slate-200 text-slate-700 text-xs font-semibold rounded-full px-2 py-0.5">
             {teachers.length}
           </span>
         </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </div>
  );
};

export default TeacherList;