
import React, { useState } from 'react';
import { SurveyResponse, Language } from '../types';
import { QUESTIONS } from '../constants';

interface ResponseDetailProps {
  response: SurveyResponse;
  onBack: () => void;
}

const ResponseDetail: React.FC<ResponseDetailProps> = ({ response, onBack }) => {
  const [showSkipped, setShowSkipped] = useState(false);

  const isAnswered = (val: any) => {
    return val !== undefined && val !== '' && !(Array.isArray(val) && val.length === 0);
  };

  const answeredCount = QUESTIONS.filter(q => q.type !== 'info' && isAnswered(response.answers[q.id])).length;
  const totalRelevant = QUESTIONS.filter(q => q.type !== 'info').length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto pb-20 px-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-stone-500 hover:text-emerald-700 font-bold text-[10px] uppercase tracking-widest transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-stone-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Return to Dashboard
        </button>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Response Rate</p>
            <p className="text-sm font-black text-emerald-600">{Math.round((answeredCount / totalRelevant) * 100)}%</p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
            Authenticated Cloud Record
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-10 border border-stone-200 shadow-xl space-y-8 relative overflow-hidden">
        {/* Header decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-100 pb-8 relative z-10">
          <div>
            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mb-2">Participant Case Study</p>
            <h2 className="text-4xl font-black text-stone-900 leading-none">Farmer {response.farmerId}</h2>
            <div className="flex items-center gap-2 mt-3 text-stone-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="font-bold text-xs">{new Date(response.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-inner">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Location</p>
              <p className="font-black text-stone-800 text-sm">{response.ward}</p>
            </div>
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-100 shadow-inner">
              <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-1">Collector</p>
              <p className="font-black text-stone-800 text-sm truncate">{response.enumerator}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center py-2">
          <h3 className="font-black text-stone-800 uppercase tracking-widest text-xs flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            Survey Questionnaire Data
          </h3>
          <button 
            onClick={() => setShowSkipped(!showSkipped)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${showSkipped ? 'bg-amber-100 text-amber-700 shadow-inner' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
          >
            {showSkipped ? (
              <>
                <svg className="w-3.6 h-3.6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" /></svg>
                Hide Skipped Questions
              </>
            ) : (
              <>
                <svg className="w-3.6 h-3.6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                Show Skipped Questions ({totalRelevant - answeredCount})
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 pt-2">
          {QUESTIONS.filter(q => q.type !== 'info').map(q => {
            const answer = response.answers[q.id];
            const answered = isAnswered(answer);
            
            if (!answered && !showSkipped) return null;
            
            return (
              <div 
                key={q.id} 
                className={`group transition-all duration-300 border-2 rounded-2xl p-5 ${answered ? 'bg-white border-stone-50 hover:border-emerald-100 hover:shadow-lg' : 'bg-stone-50/50 border-dashed border-stone-200 opacity-60'}`}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${answered ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-500'}`}>
                    {q.section.split(':')[0]}
                  </span>
                  <h4 className={`font-bold text-sm ${answered ? 'text-stone-700' : 'text-stone-400'}`}>
                    {q.label[Language.ENGLISH]}
                  </h4>
                </div>
                
                <div className={`rounded-xl p-3 transition-colors ${answered ? 'bg-emerald-50/30' : 'bg-transparent italic text-stone-400 font-medium text-sm'}`}>
                  {answered ? (
                    <p className="text-emerald-900 font-black text-lg">
                      {Array.isArray(answer) ? answer.join(", ") : String(answer)}
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      No data recorded / Logic skipped
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center pt-10">
        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Institutional Research Archive • MSU 2024</p>
      </div>
    </div>
  );
};

export default ResponseDetail;
