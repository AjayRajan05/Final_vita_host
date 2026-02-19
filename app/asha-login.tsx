import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import { Users, Phone, Lock, ChevronRight, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { signInWithOTP, verifyOTP } from '../lib/auth';

const DEMO_PHONE = '+917777777777';
const DEMO_OTP = '123456';

export default function AshaLoginScreen() {
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
            await AsyncStorage.setItem('user_role', 'asha');
            router.replace('/(asha)');
        } else if (error) {
            Alert.alert('Error', error.message);
        } else {
            await AsyncStorage.setItem('user_role', 'asha');
            router.replace('/(asha)');
        }
        setLoading(false);
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('user_role', 'asha');
        router.replace('/(asha)');
    };

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <ArrowLeft size={20} color="#d97706" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>

                <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Users size={36} color="#d97706" />
                    </View>
                    <Text style={styles.title}>ASHA/ANM Portal</Text>
                    <Text style={styles.subtitle}>Empowering Community Health Workers</Text>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.featureRow}>
                    {['Field Visits', 'Health Surveys', 'Patient Tracking'].map(f => (
                        <View key={f} style={styles.featurePill}>
                            <Text style={styles.featureText}>{f}</Text>
                        </View>
                    ))}
                </Animated.View>

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
                            {step === 'phone' ? 'Phone: +91 77777 77777' : `OTP: ${DEMO_OTP}`}
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
    root: { flex: 1, backgroundColor: '#fffbeb' },
    scroll: {
        padding: 24,
        paddingTop: Platform.OS === 'ios' ? 60 : 48,
        paddingBottom: 40,
    },
    backBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24,
    },
    backText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#d97706' },
    header: { alignItems: 'center', marginBottom: 24 },
    iconCircle: {
        width: 90, height: 90, borderRadius: 28,
        backgroundColor: '#fef3c7', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16, borderWidth: 2, borderColor: '#fde68a',
        shadowColor: '#d97706', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15, shadowRadius: 12, elevation: 6,
    },
    title: { fontFamily: 'Inter-Bold', fontSize: 28, color: '#d97706', marginBottom: 4 },
    subtitle: { fontFamily: 'Inter-Medium', fontSize: 15, color: '#92400e' },
    featureRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 28 },
    featurePill: { backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    featureText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#d97706' },
    form: { width: '100%' },
    label: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#92400e', marginBottom: 12 },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 14, borderWidth: 2, borderColor: '#fde68a',
        paddingHorizontal: 16, height: 56, marginBottom: 16,
    },
    inputIcon: { marginRight: 12 },
    input: { flex: 1, fontFamily: 'Inter-Regular', fontSize: 16, color: '#0f172a' },
    hintBox: {
        backgroundColor: '#fef3c7', padding: 12, borderRadius: 10,
        marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: '#fde68a',
    },
    hintLabel: { fontFamily: 'Inter-Medium', fontSize: 12, color: '#92400e', marginBottom: 2 },
    hintValue: { fontFamily: 'Inter-Bold', fontSize: 14, color: '#d97706' },
    button: {
        backgroundColor: '#d97706', borderRadius: 14, height: 56,
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
        shadowColor: '#d97706', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    buttonDisabled: { backgroundColor: '#94a3b8', shadowOpacity: 0 },
    buttonText: { fontFamily: 'Inter-Bold', fontSize: 16, color: '#fff' },
    changeBtn: { marginTop: 16, alignSelf: 'center' },
    changeText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#d97706' },
    skipBtn: { marginTop: 24, alignSelf: 'center' },
    skipText: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#94a3b8', textDecorationLine: 'underline' },
});
