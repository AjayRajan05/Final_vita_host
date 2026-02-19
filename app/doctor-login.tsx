import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import { Stethoscope, Phone, Lock, ChevronRight, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { signInWithOTP, verifyOTP } from '../lib/auth';

const DEMO_PHONE = '+919999999999';
const DEMO_OTP = '123456';

export default function DoctorLoginScreen() {
    const router = useRouter();
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (phone.length < 10) {
            Alert.alert('Invalid Phone', 'Please enter a valid 10-digit phone number.');
            return;
        }
        setLoading(true);
        const { error } = await signInWithOTP(phone);
        if (error && error.message.includes('your-project')) {
            Alert.alert('Development Mode', 'Proceeding with Mock Login for demo.',
                [{ text: 'Proceed', onPress: () => setStep('otp') }]);
        } else if (error) {
            Alert.alert('Error', error.message);
        } else {
            setStep('otp');
        }
        setLoading(false);
    };

    const handleVerify = async () => {
        if (otp.length < 6) {
            Alert.alert('Invalid OTP', 'Please enter the 6-digit code.');
            return;
        }
        setLoading(true);
        const { error } = await verifyOTP(phone, otp);
        if (error && error.message.includes('your-project')) {
            await AsyncStorage.setItem('user_role', 'doctor');
            router.replace('/(doctor)');
        } else if (error) {
            Alert.alert('Error', error.message);
        } else {
            await AsyncStorage.setItem('user_role', 'doctor');
            router.replace('/(doctor)');
        }
        setLoading(false);
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('user_role', 'doctor');
        router.replace('/(doctor)');
    };

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* Back Button */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <ArrowLeft size={20} color="#0891b2" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Stethoscope size={36} color="#0891b2" />
                    </View>
                    <Text style={styles.title}>Doctor Portal</Text>
                    <Text style={styles.subtitle}>Care. Coordinate. Connect.</Text>
                </Animated.View>

                {/* Feature Pills */}
                <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.featureRow}>
                    {['Patient Management', 'AI Diagnostics', 'Appointments'].map(f => (
                        <View key={f} style={styles.featurePill}>
                            <Text style={styles.featureText}>{f}</Text>
                        </View>
                    ))}
                </Animated.View>

                {/* Form */}
                <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.form}>
                    <Text style={styles.label}>
                        {step === 'phone' ? 'Enter Phone Number' : 'Enter 6-Digit OTP'}
                    </Text>

                    <View style={styles.inputWrapper}>
                        {step === 'phone' ? (
                            <>
                                <Phone size={20} color="#94a3b8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="+91 00000 00000"
                                    keyboardType="phone-pad"
                                    value={phone}
                                    onChangeText={setPhone}
                                    autoFocus
                                />
                            </>
                        ) : (
                            <>
                                <Lock size={20} color="#94a3b8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="000 000"
                                    keyboardType="number-pad"
                                    value={otp}
                                    onChangeText={setOtp}
                                    maxLength={6}
                                    autoFocus
                                />
                            </>
                        )}
                    </View>

                    <View style={styles.hintBox}>
                        <Text style={styles.hintLabel}>Demo Credentials:</Text>
                        <Text style={styles.hintValue}>
                            {step === 'phone' ? 'Phone: +91 99999 99999' : `OTP: ${DEMO_OTP}`}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, (!phone && step === 'phone') && styles.buttonDisabled]}
                        onPress={step === 'phone' ? handleSendOTP : handleVerify}
                        disabled={loading || (step === 'phone' && !phone) || (step === 'otp' && !otp)}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>
                                    {step === 'phone' ? 'Send OTP Code' : 'Verify & Login'}
                                </Text>
                                <ChevronRight size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>

                    {step === 'otp' && (
                        <TouchableOpacity style={styles.changeBtn} onPress={() => setStep('phone')}>
                            <Text style={styles.changeText}>Change Phone Number</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>

                <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip for now (Demo Mode)</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#f0f9ff' },
    scroll: {
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 40,
    },
    backBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24,
    },
    backText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#0891b2' },
    header: { alignItems: 'center', marginBottom: 24 },
    iconCircle: {
        width: 90, height: 90, borderRadius: 28,
        backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16, borderWidth: 2, borderColor: '#bae6fd',
        shadowColor: '#0891b2', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
    },
    title: { fontFamily: 'Inter-Bold', fontSize: 30, color: '#0891b2', marginBottom: 4 },
    subtitle: { fontFamily: 'Inter-Medium', fontSize: 16, color: '#64748b' },
    featureRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
    featurePill: { backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    featureText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#0891b2' },
    form: { width: '100%' },
    label: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#64748b', marginBottom: 12 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 14, borderWidth: 2, borderColor: '#bae6fd',
        paddingHorizontal: 16, height: 56, marginBottom: 16,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 16, color: '#0f172a' },
    hintBox: {
        backgroundColor: '#e0f2fe', padding: 12, borderRadius: 10,
        marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#bae6fd',
    },
    hintLabel: { fontFamily: 'Inter-Medium', fontSize: 12, color: '#64748b', marginBottom: 2 },
    hintValue: { fontFamily: 'Inter-Bold', fontSize: 14, color: '#0891b2' },
    button: {
        backgroundColor: '#0891b2', borderRadius: 14, height: 56,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
        shadowColor: '#0891b2', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    buttonDisabled: { backgroundColor: '#94a3b8', shadowOpacity: 0 },
    buttonText: { fontFamily: 'Inter-Bold', fontSize: 16, color: '#fff' },
    changeBtn: { marginTop: 16, alignSelf: 'center' },
    changeText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#0891b2' },
    skipBtn: { marginTop: 24, alignSelf: 'center' },
    skipText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#94a3b8', textDecorationLine: 'underline' },
});
