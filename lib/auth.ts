import { supabase } from './supabase';
import { Alert } from 'react-native';

/**
 * Sign in with Phone OTP
 * Ideal for rural areas where ASHA workers might not have email
 */
export async function signInWithOTP(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
    });

    if (error) {
        console.error('Auth error:', error.message);
        return { error };
    }

    return { data };
}

/**
 * Verify OTP code
 */
export async function verifyOTP(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
    });

    return { data, error };
}

/**
 * Sign out
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) Alert.alert('Error', error.message);
}

/**
 * Get current session user
 */
export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

/**
 * Get profile data for the logged in user
 */
export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    return { data, error };
}
