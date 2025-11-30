import React from 'react';
import { Teacher } from '../types';
import TeacherCard from './TeacherCard';

interface TeacherListProps {
  teachers: Teacher[];
  hasSearched: boolean;
}

const TeacherList: React.FC<TeacherListProps> = ({ teachers, hasSearched }) => {
  if (!hasSearched) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">Inizia la ricerca</h3>
        <p className="text-slate-500 max-w-md">
          Seleziona una scuola e digita almeno 2 caratteri del nome o cognome del docente per visualizzare il report.
        </p>
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="bg-red-50 p-6 rounded-full mb-6">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-800">Nessun docente trovato</h3>
        <p className="text-slate-500 mt-1">Prova a modificare i filtri di ricerca.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
         <h2 className="text-xl font-bold text-slate-800">
           Risultati Ricerca
           <span className="ml-2 inline-flex items-center justify-center bg-slate-200 text-slate-700 text-sm font-semibold rounded-full px-3 py-1">
             {teachers.length}
           </span>
         </h2>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {teachers.map((teacher) => (
          <TeacherCard key={teacher.id} teacher={teacher} />
        ))}
      </div>
    </div>
  );
};

export default TeacherList;