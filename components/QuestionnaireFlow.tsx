
import React, { useState, useMemo } from 'react';
import { Section, Language, Question, SurveyResponse } from '../types';
import { QUESTIONS, MALE_ICON, FEMALE_ICON } from '../constants';
import { firebaseService } from '../services/firebaseService';

interface QuestionnaireFlowProps {
  onComplete: () => void;
  onExit: () => void;
}

const QuestionnaireFlow: React.FC<QuestionnaireFlowProps> = ({ onComplete, onExit }) => {
  const lang = Language.ENGLISH;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const activeQuestions = useMemo(() => {
    return QUESTIONS.filter(q => !q.condition || q.condition(answers));
  }, [answers]);

  const currentQuestion = activeQuestions[currentIndex];
  const progress = Math.round((currentIndex / activeQuestions.length) * 100);

  const handleNext = async () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinishing(true);
      
      const response: SurveyResponse = {
        id: `SR-${Date.now()}`,
        date: new Date().toISOString(),
        ward: answers['ward_location'] || 'Unknown',
        enumerator: 'MSU Research Team',
        farmerId: `F-${Date.now().toString().slice(-4)}`,
        answers,
        status: 'submitted'
      };

      try {
        await firebaseService.saveResponse(response);
        setIsFinishing(false);
        setShowThankYou(true);
      } catch (error) {
        console.error(error);
        alert("Sync error. Please check internet connection.");
        setIsFinishing(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const updateAnswer = (id: string, value: any) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const toggleCheckbox = (id: string, optionValue: string) => {
    const current = answers[id] || [];
    const updated = current.includes(optionValue)
      ? current.filter((v: string) => v !== optionValue)
      : [...current, optionValue];
    updateAnswer(id, updated);
  };

  const renderInput = (q: Question) => {
    const val = answers[q.id] || '';

    switch (q.type) {
      case 'info':
        return (
          <div className="bg-emerald-50 p-6 md:p-8 rounded-2xl border border-emerald-100 text-stone-700 leading-relaxed text-base md:text-lg italic shadow-sm">
            {q.label[lang]}
          </div>
        );

      case 'gender':
        return (
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <button 
              onClick={() => updateAnswer(q.id, 'male')}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center transition-all ${val === 'male' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-stone-100 bg-white hover:border-emerald-200'}`}
            >
              <img src={MALE_ICON} alt="Male" className="w-16 h-16 md:w-24 md:h-24 mb-3 object-contain" />
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-emerald-900">Male</span>
            </button>
            <button 
              onClick={() => updateAnswer(q.id, 'female')}
              className={`p-6 rounded-2xl border-2 flex flex-col items-center transition-all ${val === 'female' ? 'border-emerald-600 bg-emerald-50 shadow-md' : 'border-stone-100 bg-white hover:border-emerald-200'}`}
            >
              <img src={FEMALE_ICON} alt="Female" className="w-16 h-16 md:w-24 md:h-24 mb-3 object-contain" />
              <span className="font-bold text-xs md:text-sm uppercase tracking-widest text-emerald-900">Female</span>
            </button>
          </div>
        );

      case 'checkbox':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-3xl mx-auto">
            {q.options?.map(opt => {
              const checked = (answers[q.id] || []).includes(opt.value);
              return (
                <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-100 text-stone-600 hover:border-emerald-200'}`}>
                  <input type="checkbox" className="hidden" checked={checked} onChange={() => toggleCheckbox(q.id, opt.value)} />
                  <div className={`w-5 h-5 rounded flex-shrink-0 border flex items-center justify-center ${checked ? 'bg-white' : 'bg-stone-100'}`}>
                    {checked && <div className="w-2.5 h-2.5 bg-emerald-600 rounded-sm"></div>}
                  </div>
                  <span className="text-sm font-bold">{opt.label[lang]}</span>
                </label>
              );
            })}
          </div>
        );

      case 'likert':
        return (
          <div className="space-y-6 max-w-xl mx-auto py-4">
            <div className="flex justify-between items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => updateAnswer(q.id, num.toString())}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-xl font-black text-xl transition-all border-2 flex flex-col items-center justify-center ${val === num.toString() ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-105' : 'bg-white text-stone-500 border-stone-100 hover:border-emerald-300'}`}
                >
                  {num}
                  <span className="text-[8px] uppercase tracking-tighter opacity-70">
                    {num === 1 ? 'SD' : num === 5 ? 'SA' : ''}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[9px] md:text-xs text-stone-400 font-bold uppercase tracking-widest px-1">
              <span>1 = Strongly Disagree</span>
              <span>5 = Strongly Agree</span>
            </div>
          </div>
        );

      case 'radio':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-3xl mx-auto">
            {q.options?.map(opt => (
              <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${val === opt.value ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-100 text-stone-600 hover:border-emerald-200'}`}>
                <input type="radio" className="hidden" checked={val === opt.value} onChange={() => updateAnswer(q.id, opt.value)} />
                <div className={`w-5 h-5 rounded-full flex-shrink-0 border-2 flex items-center justify-center ${val === opt.value ? 'border-white' : 'border-stone-200'}`}>
                  {val === opt.value && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="text-sm font-bold">{opt.label[lang]}</span>
              </label>
            ))}
          </div>
        );

      case 'counter':
        const count = Number(val) || 0;
        return (
          <div className="flex items-center justify-center gap-6 py-2">
            <button onClick={() => updateAnswer(q.id, Math.max(0, count - 1))} className="w-12 h-12 rounded-full bg-stone-100 text-xl font-bold">-</button>
            <span className="text-4xl font-black text-emerald-900 w-16 text-center">{count}</span>
            <button onClick={() => updateAnswer(q.id, count + 1)} className="w-12 h-12 rounded-full bg-emerald-600 text-white text-xl font-bold shadow-md shadow-emerald-100">+</button>
          </div>
        );

      case 'number':
        return <input type="number" value={val} onChange={(e) => updateAnswer(q.id, e.target.value)} className="w-full text-3xl md:text-4xl p-4 border-b-2 border-stone-200 focus:border-emerald-500 outline-none text-center bg-transparent font-bold text-emerald-900 max-w-xs mx-auto block" placeholder="0" autoFocus />;

      case 'text':
      case 'voice':
        return (
          <div className="max-w-3xl mx-auto">
            <textarea 
              value={val} 
              onChange={(e) => updateAnswer(q.id, e.target.value)} 
              className="w-full p-4 text-sm md:text-base border-2 border-stone-100 rounded-xl h-40 focus:border-emerald-500 outline-none transition-all shadow-inner bg-stone-50" 
              placeholder="Enter details here..." 
            />
          </div>
        );

      default:
        return <input type="text" value={val} onChange={(e) => updateAnswer(q.id, e.target.value)} className="w-full p-3 text-lg border-2 border-stone-100 rounded-xl focus:border-emerald-500 outline-none shadow-sm transition-all max-w-2xl mx-auto block" placeholder="..." />;
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto px-2">
      {isFinishing && (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin mb-4"></div>
          <p className="text-emerald-900 font-black text-lg animate-pulse uppercase tracking-widest">Syncing with Cloud Database...</p>
        </div>
      )}

      {showThankYou && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-sm w-full text-center shadow-2xl space-y-6 animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-4xl">
              ✅
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-emerald-900">Survey Complete!</h2>
              <p className="text-stone-500 text-sm font-medium leading-relaxed">
                Thank you very much for your time and valuable contribution to this study. Your data has been recorded in the MSU cloud database.
              </p>
            </div>
            <button 
              onClick={onComplete}
              className="w-full bg-emerald-700 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-200 active:scale-95 transition-all uppercase tracking-widest text-sm"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-stone-400 font-bold text-[10px] uppercase tracking-widest">Question {currentIndex + 1} of {activeQuestions.length}</span>
            <div className="text-emerald-800 font-bold text-xs bg-emerald-100 px-2 py-0.5 rounded-md">{progress}%</div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-600 transition-all duration-700" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex-1 mb-20 overflow-y-auto pr-1">
        <div className="mb-4">
          <span className="bg-amber-50 text-amber-800 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100 inline-block shadow-sm">
            {currentQuestion.section}
          </span>
        </div>
        
        {currentQuestion.type !== 'info' && (
          <h2 className="font-black text-stone-800 mb-6 leading-tight text-lg md:text-2xl">
            {currentQuestion.label[lang]}
          </h2>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderInput(currentQuestion)}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full p-2 md:p-3 bg-white/90 backdrop-blur-md border-t border-stone-200 flex justify-center z-40">
        <div className="w-full max-w-4xl flex gap-2">
          <button onClick={handlePrev} disabled={currentIndex === 0} className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${currentIndex === 0 ? 'bg-stone-50 text-stone-300' : 'bg-stone-100 text-stone-600 active:scale-95'}`}>
            Prev
          </button>
          <button onClick={handleNext} className="flex-[2] py-2 rounded-lg font-bold text-white bg-emerald-700 shadow-md active:scale-95 transition-all text-xs flex items-center justify-center gap-2 uppercase tracking-widest">
            {currentIndex === activeQuestions.length - 1 ? "Finish & Submit" : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireFlow;
