
import React, { useState } from 'react';
import Layout from './components/Layout';
import QuestionnaireFlow from './components/QuestionnaireFlow';
import AdminDashboard from './components/AdminDashboard';
import { LOGO_URL } from './constants';

type AppMode = 'welcome' | 'interview' | 'admin' | 'admin_login';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('welcome');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1677') {
      setMode('admin');
      setError('');
    } else {
      setError('Invalid Access Code');
    }
  };

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-10 animate-in fade-in duration-700 max-w-4xl mx-auto py-10 px-4">
      <img src={LOGO_URL} alt="MSU Logo" className="w-24 h-24 md:w-32 md:h-32 object-contain" />
      
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-black text-emerald-900 tracking-tight leading-tight uppercase">
          MSU Farmer Research Portal
        </h1>
        <div className="h-1 w-24 bg-emerald-700 mx-auto rounded-full"></div>
        <div className="space-y-6 max-w-2xl mx-auto">
          <p className="text-stone-700 text-sm md:text-lg font-bold leading-relaxed">
            "Assessing Socioeconomic Determinants of Sustainable Agricultural Practices: A Study of Finger Millet Production in Semi-Arid Zimbabwe."
          </p>
        </div>
      </div>

      <div className="w-full max-w-xs pt-4">
        <button 
          onClick={() => setMode('interview')}
          className="w-full bg-emerald-700 text-white font-black py-4 md:py-6 rounded-2xl text-lg md:text-xl shadow-xl active:scale-95 hover:bg-emerald-800 transition-all flex items-center justify-center gap-3"
        >
          <span>Start Interview</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );

  const renderAdminLogin = () => (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-8 px-4 max-w-sm mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-emerald-900">Research Access</h2>
        <p className="text-stone-500 font-medium text-sm">Enter institutional access code</p>
      </div>
      
      <form onSubmit={handleAdminLogin} className="w-full space-y-4">
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Code"
          className="w-full p-4 border-2 border-stone-200 rounded-xl focus:border-emerald-500 outline-none text-center text-2xl tracking-[0.3em] bg-white"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs text-center font-bold animate-bounce">{error}</p>}
        <button type="submit" className="w-full bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-md active:scale-95 hover:bg-emerald-800 transition-all">
          Authorize
        </button>
        <button type="button" onClick={() => setMode('welcome')} className="w-full py-2 text-stone-400 text-xs font-bold hover:text-stone-600">
          Cancel
        </button>
      </form>
    </div>
  );

  return (
    <Layout 
      title={mode === 'interview' ? 'Active Survey' : mode === 'admin' ? 'Analytics Console' : 'MSU Research Portal'}
      onBack={mode !== 'welcome' ? () => setMode('welcome') : undefined}
      onAdminClick={() => setMode('admin_login')}
      showAdminLink={mode === 'welcome'}
    >
      {mode === 'welcome' && renderWelcome()}
      {mode === 'admin_login' && renderAdminLogin()}
      {mode === 'interview' && (
        <QuestionnaireFlow onComplete={() => setMode('welcome')} onExit={() => setMode('welcome')} />
      )}
      {mode === 'admin' && <AdminDashboard />}
    </Layout>
  );
};

export default App;
