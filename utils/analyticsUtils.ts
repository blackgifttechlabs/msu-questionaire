
import { SurveyResponse, Question } from '../types';
import { QUESTIONS } from '../constants';

export const getQualityMetrics = (responses: SurveyResponse[]) => {
  if (responses.length === 0) return { completionRate: 0, textQuality: { detailed: 0, brief: 0, skipped: 0 } };

  // A response is considered "high completion" if it has answers for 80% of relevant questions
  const totalRelevant = QUESTIONS.filter(q => q.type !== 'info').length;
  const highCompletionCount = responses.filter(r => 
    Object.keys(r.answers).length >= totalRelevant * 0.8
  ).length;

  return {
    completionRate: (highCompletionCount / responses.length) * 100,
    textQuality: {
      detailed: responses.filter(r => (r.answers['E1_challenge']?.length || 0) > 50).length,
      brief: responses.filter(r => (r.answers['E1_challenge']?.length || 0) <= 50 && (r.answers['E1_challenge']?.length || 0) > 0).length,
      skipped: responses.filter(r => !r.answers['E1_challenge']).length
    }
  };
};

export const getPracticeAdoption = (responses: SurveyResponse[]) => {
  return {
    tillage: [
      { name: 'Conventional', value: responses.filter(r => r.answers['B1_1_method'] === 'conventional').length },
      { name: 'Conservation', value: responses.filter(r => r.answers['B1_1_method'] === 'conservation').length },
      { name: 'Zero Tillage', value: responses.filter(r => r.answers['B1_1_method'] === 'zero').length },
      { name: 'Other', value: responses.filter(r => r.answers['B1_1_method'] === 'other').length }
    ],
    nutrients: responses.reduce((acc, r) => {
      (r.answers['B2_2_methods'] || []).forEach((method: string) => {
        acc[method] = (acc[method] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>),
    inmAwareness: [
      { name: 'Heard of INM', value: responses.filter(r => r.answers['B2_5_inm_heard'] === 'yes').length },
      { name: 'Not Heard', value: responses.filter(r => r.answers['B2_5_inm_heard'] === 'no').length }
    ]
  };
};

export const getDemographicInsights = (responses: SurveyResponse[]) => {
  return {
    education: [
      { level: 'None', count: responses.filter(r => r.answers['A3_education'] === 'none').length },
      { level: 'Primary', count: responses.filter(r => r.answers['A3_education'] === 'primary').length },
      { level: 'Secondary', count: responses.filter(r => r.answers['A3_education'] === 'secondary').length },
      { level: 'Tertiary', count: responses.filter(r => r.answers['A3_education'] === 'tertiary').length }
    ],
    landSize: [
      { range: '< 2ha', count: responses.filter(r => (Number(r.answers['A9_land_size']) || 0) < 2).length },
      { range: '2-5ha', count: responses.filter(r => (Number(r.answers['A9_land_size']) || 0) >= 2 && (Number(r.answers['A9_land_size']) || 0) < 5).length },
      { range: '> 5ha', count: responses.filter(r => (Number(r.answers['A9_land_size']) || 0) >= 5).length }
    ],
    livestock: {
      cattle: responses.filter(r => (Number(r.answers['A11_cattle']) || 0) > 0).length,
      goats: responses.filter(r => (Number(r.answers['A11_goats']) || 0) > 0).length,
      both: responses.filter(r => (Number(r.answers['A11_cattle']) || 0) > 0 && (Number(r.answers['A11_goats']) || 0) > 0).length
    }
  };
};

export const getPerceptionScores = (responses: SurveyResponse[]) => {
  const likertQuestions = [
    { id: 'C1_barrier', label: 'Fertilizer Cost' },
    { id: 'C2_access', label: 'Manure Access' },
    { id: 'C3_knowledge', label: 'Knowledge' },
    { id: 'C4_willing', label: 'Willingness' },
    { id: 'C5_climate', label: 'Climate Risk' }
  ];
  
  return likertQuestions.map(q => {
    const scores = responses
      .map(r => parseInt(r.answers[q.id]))
      .filter(s => !isNaN(s));
    
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    
    return {
      subject: q.label,
      average: Number(avg.toFixed(2)),
      fullMark: 5
    };
  });
};

export const getGeographicData = (responses: SurveyResponse[]) => {
  const wardCounts = responses.reduce((acc, r) => {
    const ward = r.ward || 'Unknown';
    acc[ward] = (acc[ward] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(wardCounts)
    .map(([ward, count]) => ({ name: ward, count }))
    .sort((a, b) => b.count - a.count);
};

export const getExtensionImpact = (responses: SurveyResponse[]) => {
  const hadContact = responses.filter(r => r.answers['D1_contact'] === 'yes');
  
  return {
    contactRate: responses.length > 0 ? (hadContact.length / responses.length * 100).toFixed(1) : "0",
    relevanceDistribution: [
      { name: 'Not Relevant', value: hadContact.filter(r => r.answers['D3_relevance'] === '1').length },
      { name: 'Slightly', value: hadContact.filter(r => r.answers['D3_relevance'] === '2').length },
      { name: 'Moderately', value: hadContact.filter(r => r.answers['D3_relevance'] === '3').length },
      { name: 'Very Relevant', value: hadContact.filter(r => r.answers['D3_relevance'] === '4').length }
    ]
  };
};

export const getChallengeThemes = (responses: SurveyResponse[]) => {
  const challenges = responses
    .map(r => r.answers['E1_challenge'])
    .filter(c => c && c.length > 0);
  
  const keywords = ['water', 'drought', 'fertilizer', 'seed', 'market', 'labor', 'pest', 'disease', 'rain'];
  
  return keywords.map(keyword => ({
    keyword: keyword.charAt(0).toUpperCase() + keyword.slice(1),
    mentions: challenges.filter(c => c.toLowerCase().includes(keyword)).length
  })).sort((a, b) => b.mentions - a.mentions);
};
