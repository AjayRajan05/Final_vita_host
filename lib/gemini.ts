import { GoogleGenerativeAI } from '@google/generative-ai';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── MedGemma Configuration ──────────────────────────────────────────────────

const MODEL_NAME = 'gemini-pro';
const API_KEY_STORAGE_KEY = 'gemini_api_key';

// System Instruction for Medical Persona
const MEDGEMMA_SYSTEM_PROMPT = `
You are MedGemma, a specialized AI medical assistant for the VitaWeave community health app.
Your users are Community Health Workers (CHWs) and Doctors in rural India.

tone: Professional, empathetic, concise, and clinically accurate.
role: Assist with triage, suggest differential diagnoses, explain medical concepts, and provide public health guidance.
safety: Always include a disclaimer for critical cases: "Please verify with a specialist."
context: You have access to patient data provided in the prompt. Use it to tailor your advice.
`;

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = async (apiKey: string) => {
    genAI = new GoogleGenerativeAI(apiKey);
    await AsyncStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const getStoredApiKey = async () => {
    return await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
};

export async function getMedGemmaResponse(prompt: string, context?: string): Promise<string> {
    const apiKey = await getStoredApiKey();

    if (!apiKey) {
        throw new Error('API Key not found. Please set your Gemini API Key first.');
    }

    if (!genAI) {
        genAI = new GoogleGenerativeAI(apiKey);
    }

    try {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });

        // Construct the full prompt with system instruction and context
        let fullPrompt = `${MEDGEMMA_SYSTEM_PROMPT}\n\n`;
        if (context) {
            fullPrompt += `CONTEXT:\n${context}\n\n`;
        }
        fullPrompt += `USER QUERY: ${prompt}`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        return response.text();
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return `⚠️ MedGemma Error: ${error.message || 'Unable to connect to AI service.'}`;
    }
}
