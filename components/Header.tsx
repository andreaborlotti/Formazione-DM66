import React from 'react';

interface HeaderProps {
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  const formattedTime = lastUpdated 
    ? lastUpdated.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
    : '--:--:--';

  return (
    <header className="bg-slate-50 pt-8 pb-4">
      <div className="container mx-auto px-4 text-center">
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-primary-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Report Formazione Docenti DM66</h1>
        </div>

        {/* Status Pills */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Connesso Live
            </div>

            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-sm font-medium shadow-sm">
                 Aggiornato: {formattedTime}
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 ml-2 animate-pulse">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                 </svg>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;