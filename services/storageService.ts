
import { SurveyResponse } from '../types';

const STORAGE_KEY = 'msu_survey_responses';

export const storageService = {
  getResponses: (): SurveyResponse[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveResponse: (response: SurveyResponse): void => {
    const responses = storageService.getResponses();
    const index = responses.findIndex(r => r.id === response.id);
    if (index > -1) {
      responses[index] = response;
    } else {
      responses.push(response);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
  },

  deleteResponse: (id: string): void => {
    const responses = storageService.getResponses();
    const filtered = responses.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
};
