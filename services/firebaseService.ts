
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { SurveyResponse } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBVkYt0vzcdAwSJWj-Sn-QwFgZG3HvRNf8",
  authDomain: "msuquestionare.firebaseapp.com",
  projectId: "msuquestionare",
  storageBucket: "msuquestionare.firebasestorage.app",
  messagingSenderId: "773220136166",
  appId: "1:773220136166:web:24875c3e064adaba5d3727"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const responsesCollection = collection(db, "survey_responses");

export const firebaseService = {
  getResponses: async (): Promise<SurveyResponse[]> => {
    try {
      const q = query(responsesCollection, orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as SurveyResponse[];
    } catch (error) {
      console.error("Error getting documents from Firestore: ", error);
      return [];
    }
  },

  saveResponse: async (response: SurveyResponse): Promise<void> => {
    try {
      // Clean undefined values which Firestore doesn't accept
      const sanitizedAnswers = Object.entries(response.answers).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const recordToSave = {
        ...response,
        answers: sanitizedAnswers,
        date: response.date || new Date().toISOString()
      };

      await addDoc(responsesCollection, recordToSave);
    } catch (error) {
      console.error("Error saving document to Firestore: ", error);
      throw error;
    }
  },

  deleteResponse: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "survey_responses", id));
    } catch (error) {
      console.error("Error deleting document from Firestore: ", error);
    }
  }
};
