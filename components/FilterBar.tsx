import React from 'react';

interface FilterBarProps {
  schools: string[];
  selectedSchool: string;
  searchQuery: string;
  showAll: boolean;
  onSchoolChange: (school: string) => void;
  onSearchChange: (query: string) => void;
  onShowAllChange: (showAll: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  schools, 
  selectedSchool, 
  searchQuery, 
  showAll,
  onSchoolChange, 
  onSearchChange,
  onShowAllChange
}) => {
  return (
    <div className="container mx-auto px-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
          <div className="w-full md:w-1/2">
            <label htmlFor="school-select" className="block text-sm font-semibold text-slate-700 mb-2">
              Scuola
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                    </svg>
                </div>
                <select
                id="school-select"
                value={selectedSchool}
                onChange={(e) => onSchoolChange(e.target.value)}
                className="w-full pl-10 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-3 transition-colors appearance-none"
                >
                <option value="">Seleziona una scuola...</option>
                {schools.map((school) => (
                    <option key={school} value={school}>
                    {school}
                    </option>
                ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <label htmlFor="search-input" className="block text-sm font-semibold text-slate-700 mb-2">
              Docente
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${showAll ? 'text-slate-300' : 'text-slate-400'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                </div>
                <input
                type="text"
                id="search-input"
                value={searchQuery}
                disabled={!selectedSchool || showAll}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={showAll ? "Ricerca disabilitata (visualizzazione completa)" : "Cerca per cognome o nome..."}
                className={`border text-sm rounded-lg block w-full pl-10 p-3 transition-colors ${
                    showAll 
                    ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 focus:ring-primary-500 focus:border-primary-500'
                }`}
                />
            </div>
            
            {/* Show All Checkbox */}
            <div className="mt-3 flex items-center">
                <input
                    id="show-all-checkbox"
                    type="checkbox"
                    checked={showAll}
                    onChange={(e) => onShowAllChange(e.target.checked)}
                    disabled={!selectedSchool}
                    className="w-4 h-4 text-primary-600 bg-slate-100 border-slate-300 rounded focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label 
                    htmlFor="show-all-checkbox" 
                    className={`ml-2 text-sm font-medium ${!selectedSchool ? 'text-slate-400' : 'text-slate-700'}`}
                >
                    Mostra elenco completo
                </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;