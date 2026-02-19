import { supabase } from './supabase';
import { getCached, setCached } from './cache';
import type {
    Patient,
    CommunityAlert,
    PharmacyTrend,
    SymptomReport,
    WeeklyTrend,
    AIInsight,
    DashboardTask,
    WeeklyAlert
} from '../app/constants/data';

/**
 * Generic fetcher with offline cache support
 */
async function fetchWithCache<T>(
    key: string,
    supabaseQuery: () => Promise<{ data: T[] | null; error: any }>,
    maxAge?: number
): Promise<T[]> {
    // 1. Try cache first for immediate UI update (optimistic)
    const cached = await getCached<T[]>(key, maxAge);

    // 2. Fetch fresh data from Supabase
    try {
        const { data, error } = await supabaseQuery();
        if (error) throw error;
        if (data) {
            // 3. Update cache
            await setCached(key, data);
            return data;
        }
    } catch (e) {
        console.warn(`Supabase fetch failed for ${key}, using cache:`, e);
    }

    // 4. Return cache if available, or empty array
    return cached || [];
}

// --- API Functions ---

export async function getPatients(): Promise<Patient[]> {
    return fetchWithCache<Patient>('patients', async () =>
        supabase
            .from('patients')
            .select('*')
            .order('name', { ascending: true })
    );
}

export async function getCommunityAlerts(): Promise<CommunityAlert[]> {
    return fetchWithCache<CommunityAlert>('community_alerts', async () =>
        supabase
            .from('community_alerts')
            .select('*')
            .order('date', { ascending: false })
    );
}

export async function getPharmacyTrends(): Promise<PharmacyTrend[]> {
    return fetchWithCache<PharmacyTrend>('pharmacy_trends', async () =>
        supabase
            .from('pharmacy_trends')
            .select('*')
            .order('count', { ascending: false })
    );
}

export async function getSymptomReports(): Promise<SymptomReport[]> {
    return fetchWithCache<SymptomReport>('symptom_reports', async () =>
        supabase
            .from('symptom_reports')
            .select('*')
            .order('count', { ascending: false })
    );
}

export async function getWeeklyTrends(): Promise<WeeklyTrend[]> {
    return fetchWithCache<WeeklyTrend>('weekly_trends', async () =>
        supabase
            .from('weekly_trends')
            .select('*')
            .order('id', { ascending: true })
    );
}

export async function getAIInsights(): Promise<AIInsight[]> {
    return fetchWithCache<AIInsight>('ai_insights', async () =>
        supabase
            .from('ai_insights')
            .select('*')
            .order('created_at', { ascending: false })
    );
}

export async function getDashboardTasks(): Promise<DashboardTask[]> {
    return fetchWithCache<DashboardTask>('dashboard_tasks', async () =>
        supabase
            .from('dashboard_tasks')
            .select('*')
            .order('id', { ascending: true })
    );
}

export async function getWeeklyAlerts(): Promise<WeeklyAlert[]> {
    return fetchWithCache<WeeklyAlert>('weekly_alerts', async () =>
        supabase
            .from('weekly_alerts')
            .select('*')
            .order('created_at', { ascending: false })
    );
}

// --- Mutation Functions ---

export async function addPatient(patient: Omit<Patient, 'id'>) {
    const { data, error } = await supabase
        .from('patients')
        .insert([patient])
        .select();
    return { data, error };
}

export async function updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
    return { data, error };
}
