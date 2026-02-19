import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// These should be in a .env file typically, but using placeholders for now
// so the app builds. The user will need to replace these.
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://evyzjrntwauhkpecavem.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eXpqcm50d2F1aGtwZWNhdmVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzAzNTYsImV4cCI6MjA4NzAwNjM1Nn0.M82yvwpXlnHVHpJtmreFERQScf1vwOFNNjh6eFHAteQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
