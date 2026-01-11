import React from 'react';
import InvoiceGenerator from './components/InvoiceGenerator';
import RevenueChart from './components/RevenueChart';
import { LayoutDashboard, Receipt, UserCircle, Globe } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Receipt className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                {t('appTitle')}
              </span>
            </div>
            <div className="flex items-center gap-4">
               {/* Language Switcher */}
               <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <button 
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      language === 'en' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    English
                  </button>
                  <button 
                    onClick={() => setLanguage('ko')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                      language === 'ko' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    한국어
                  </button>
               </div>

               <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                  <UserCircle size={24} />
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 mb-8">
            {/* Dashboard Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-80">
                    <RevenueChart />
                </div>
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-indigo-100 text-sm font-medium mb-1">{t('totalOutstanding')}</h3>
                        <p className="text-4xl font-bold">$12,450</p>
                    </div>
                    <div>
                         <div className="flex items-center justify-between text-sm text-indigo-100 mb-2">
                            <span>{t('paidThisMonth')}</span>
                            <span className="font-semibold text-white">$4,200</span>
                         </div>
                         <div className="w-full bg-indigo-900/30 rounded-full h-1.5">
                            <div className="bg-indigo-300 h-1.5 rounded-full" style={{ width: '35%' }}></div>
                         </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-indigo-500/30">
                        <p className="text-xs text-indigo-200 leading-relaxed">
                            💡 <strong>{t('aiTip')}</strong> {t('aiTipContent')}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Invoice Generator Section */}
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
                 <LayoutDashboard className="text-indigo-600" size={24} />
                 <h2 className="text-2xl font-bold text-slate-800">{t('newInvoiceGenerator')}</h2>
            </div>
            <InvoiceGenerator />
        </div>
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} {t('footer')}</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
