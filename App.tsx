import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import TeacherList from './components/TeacherList';
import Loading from './components/Loading';
import { fetchAndParseData } from './services/dataService';
import { AppState, FilterState } from './types';

function App() {
  const [data, setData] = useState<AppState>({
    teachers: [],
    schools: [],
    isLoading: true,
    error: null,
    lastUpdated: null,
  });

  const [filters, setFilters] = useState<FilterState>({
    selectedSchool: '',
    searchQuery: '',
    showAll: false,
  });

  const loadData = async () => {
    try {
      const { teachers, schools } = await fetchAndParseData();
      setData({
        teachers,
        schools,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (err) {
      console.error(err);
      // Don't set error state on background refreshes if we already have data
      setData(prev => ({
        ...prev,
        isLoading: prev.teachers.length === 0, // Only show loading if no data
        error: prev.teachers.length === 0 ? "Impossibile caricare i dati." : null, 
      }));
    }
  };

  // Initial Load and Auto-Refresh
  useEffect(() => {
    loadData();
    // Refresh every 60 seconds (60000 ms)
    const intervalId = setInterval(loadData, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Filter Logic
  const filteredTeachers = useMemo(() => {
    // 1. Check if filters are sufficient
    const isSchoolSelected = filters.selectedSchool !== '';
    const isSearchValid = filters.searchQuery.trim().length >= 2;
    const isShowAll = filters.showAll;

    // Privacy rule: Only show if school is selected AND (search is valid OR showAll is checked)
    if (!isSchoolSelected) {
      return [];
    }
    
    if (!isSearchValid && !isShowAll) {
        return [];
    }

    const query = filters.searchQuery.toLowerCase();

    return data.teachers.filter(teacher => {
      // School Match (if specific school selected)
      if (teacher.school !== filters.selectedSchool) return false;

      // If Show All is checked, skip name matching
      if (isShowAll) return true;

      // Name Match
      const fullName = `${teacher.lastName} ${teacher.firstName}`.toLowerCase();
      const reverseName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      
      return fullName.includes(query) || reverseName.includes(query);
    });
  }, [data.teachers, filters]);

  // Filtered Stats
  const filteredStats = useMemo(() => {
     const count = filteredTeachers.length;
     const hours = filteredTeachers.reduce((acc, curr) => acc + curr.totalHours, 0);
     return { count, hours };
  }, [filteredTeachers]);

  const handleSchoolChange = (school: string) => {
    setFilters(prev => ({ 
        ...prev, 
        selectedSchool: school,
        // Optional: reset showAll when school changes to prevent accidental exposure of new list
        showAll: false 
    }));
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const handleShowAllChange = (showAll: boolean) => {
    setFilters(prev => ({ ...prev, showAll }));
  };

  // Valid search now includes the "Show All" flag
  const hasValidSearch = filters.selectedSchool !== '' && (filters.searchQuery.trim().length >= 2 || filters.showAll);

  if (data.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header lastUpdated={null} />
        <Loading />
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header lastUpdated={data.lastUpdated} />
        <div className="flex flex-col items-center justify-center flex-1 p-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg text-center">
            <strong className="font-bold">Errore!</strong>
            <span className="block sm:inline"> {data.error}</span>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Ricarica Pagina
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-10">
      <Header lastUpdated={data.lastUpdated} />
      
      <main className="flex-1 flex flex-col">
        
        {/* Istruzioni Compatte - Visibili SOLO se non c'è una ricerca attiva */}
        {!hasValidSearch && (
          <div className="container mx-auto px-4 mb-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-row items-center gap-4">
               <div className="bg-slate-100 p-2 rounded-full shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
               </div>
               <div className="text-left">
                  <h3 className="font-semibold text-slate-800 text-sm">Inizia la ricerca</h3>
                  <p className="text-slate-500 text-sm leading-tight">
                    Seleziona una scuola e digita almeno 2 caratteri del nome o cognome del docente per visualizzare il report.
                  </p>
                  <p className="text-slate-500 text-sm leading-tight mt-1">
                    Per vedere il catalogo ed il calendario completo, visita il <a href="https://sites.google.com/operasantalessandro.it/operainformazione/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">sito dedicato</a>.
                  </p>
               </div>
            </div>
          </div>
        )}

        <FilterBar 
          schools={data.schools}
          selectedSchool={filters.selectedSchool}
          searchQuery={filters.searchQuery}
          showAll={filters.showAll}
          onSchoolChange={handleSchoolChange}
          onSearchChange={handleSearchChange}
          onShowAllChange={handleShowAllChange}
        />

        {/* Info Cards Row - Visibili SOLO se c'è una ricerca attiva */}
        {hasValidSearch && (
          <div className="container mx-auto px-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card Docenti Filtrati */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center">
                      <div className="p-3 bg-primary-50 rounded-full mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                          </svg>
                      </div>
                      <div>
                          <p className="text-slate-500 font-medium text-sm">Docenti Filtrati</p>
                          <p className="text-3xl font-bold text-slate-800">{filteredStats.count}</p>
                      </div>
                  </div>

                  {/* Card Ore Totali */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center">
                      <div className="p-3 bg-green-50 rounded-full mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                      </div>
                      <div>
                          <p className="text-slate-500 font-medium text-sm">Ore Totali Rilevate</p>
                          <p className="text-3xl font-bold text-slate-800">{filteredStats.hours.toLocaleString('it-IT')}</p>
                      </div>
                  </div>
              </div>
          </div>
        )}
        
        <TeacherList 
          teachers={filteredTeachers} 
          hasSearched={hasValidSearch} 
        />
      </main>
    </div>
  );
}

export default App;