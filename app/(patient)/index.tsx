import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
// @ts-ignore
import {
    Heart, Activity, Droplets, Thermometer, Moon,
    CalendarClock, ChevronRight, Lightbulb, BellDot, Pill,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const VITALS = [
    { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: '#dc2626', bg: '#fee2e2' },
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: '#0891b2', bg: '#e0f2fe' },
    { label: 'Blood Sugar', value: '98', unit: 'mg/dL', icon: Droplets, color: '#7c3aed', bg: '#ede9fe' },
    { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, color: '#d97706', bg: '#fef3c7' },
];

const UPCOMING = [
    { doctor: 'Dr. R. Sharma', type: 'General Checkup', date: 'Today, 10:00 AM', color: '#0891b2' },
    { doctor: 'Dr. A. Gupta', type: 'Eye Examination', date: 'Tomorrow, 2:30 PM', color: '#7c3aed' },
];

const MEDICATIONS = [
    { name: 'Paracetamol 500mg', time: 'After Breakfast', taken: true },
    { name: 'Vitamin D3', time: 'After Lunch', taken: false },
    { name: 'Iron Supplement', time: 'Before Bed', taken: false },
];

const TIPS = [
    'Drink at least 8 glasses of water daily 💧',
    'Walk 30 minutes after dinner for better digestion 🚶',
    'Include leafy greens in at least one meal today 🥬',
];

export default function PatientDashboard() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.name}>Lakshmi Bai</Text>
                </View>
                <TouchableOpacity style={styles.notifBtn}>
                    <BellDot size={22} color="#059669" />
                    <View style={styles.notifDot} />
                </TouchableOpacity>
            </Animated.View>

            {/* Vitals */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)}>
                <Text style={styles.sectionTitle}>My Vitals</Text>
                <View style={styles.vitalGrid}>
                    {VITALS.map(({ label, value, unit, icon: Icon, color, bg }) => (
                        <View key={label} style={[styles.vitalCard, { borderTopColor: color }]}>
                            <View style={[styles.vitalIcon, { backgroundColor: bg }]}>
                                <Icon size={18} color={color} />
                            </View>
                            <Text style={[styles.vitalValue, { color }]}>{value}</Text>
                            <Text style={styles.vitalUnit}>{unit}</Text>
                            <Text style={styles.vitalLabel}>{label}</Text>
                        </View>
                    ))}
                </View>
            </Animated.View>

            {/* Medications */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                <Text style={styles.sectionTitle}>Today's Medications</Text>
                {MEDICATIONS.map((med, i) => (
                    <View key={i} style={styles.medRow}>
                        <View style={[styles.medCheck, med.taken && styles.medCheckDone]}>
                            {med.taken && <Text style={styles.medCheckMark}>✓</Text>}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.medName, med.taken && styles.medNameDone]}>{med.name}</Text>
                            <Text style={styles.medTime}>{med.time}</Text>
                        </View>
                        <Pill size={16} color={med.taken ? '#059669' : '#94a3b8'} />
                    </View>
                ))}
            </Animated.View>

            {/* Upcoming Appointments */}
            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Visits</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {UPCOMING.map((appt, i) => (
                    <TouchableOpacity key={i} style={styles.apptCard}>
                        <View style={[styles.apptDot, { backgroundColor: appt.color }]} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.apptDoctor}>{appt.doctor}</Text>
                            <Text style={styles.apptType}>{appt.type}</Text>
                        </View>
                        <View style={styles.apptDateWrap}>
                            <CalendarClock size={14} color="#94a3b8" />
                            <Text style={styles.apptDate}>{appt.date}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </Animated.View>

            {/* Health Tips */}
            <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.tipsCard}>
                <View style={styles.tipsHeader}>
                    <Lightbulb size={16} color="#d97706" />
                    <Text style={styles.tipsTitle}>Health Tips for You</Text>
                </View>
                {TIPS.map((tip, i) => (
                    <Text key={i} style={styles.tipText}>• {tip}</Text>
                ))}
            </Animated.View>

            {/* Sleep Summary */}
            <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.sleepCard}>
                <View style={styles.sleepHeader}>
                    <Moon size={16} color="#7c3aed" />
                    <Text style={styles.sleepTitle}>Last Night's Sleep</Text>
                </View>
                <View style={styles.sleepGrid}>
                    <View style={styles.sleepItem}>
                        <Text style={styles.sleepValue}>7h 20m</Text>
                        <Text style={styles.sleepLabel}>Duration</Text>
                    </View>
                    <View style={styles.sleepDivider} />
                    <View style={styles.sleepItem}>
                        <Text style={[styles.sleepValue, { color: '#059669' }]}>Good</Text>
                        <Text style={styles.sleepLabel}>Quality</Text>
                    </View>
                    <View style={styles.sleepDivider} />
                    <View style={styles.sleepItem}>
                        <Text style={styles.sleepValue}>11:30 PM</Text>
                        <Text style={styles.sleepLabel}>Bedtime</Text>
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20, paddingBottom: 40 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 24,
    },
    greeting: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#64748b' },
    name: { fontFamily: 'Inter-Bold', fontSize: 24, color: '#0f172a' },
    notifBtn: {
        width: 44, height: 44, borderRadius: 14, backgroundColor: '#d1fae5',
        justifyContent: 'center', alignItems: 'center',
    },
    notifDot: {
        position: 'absolute', top: 10, right: 10,
        width: 8, height: 8, borderRadius: 4, backgroundColor: '#dc2626',
    },
    sectionTitle: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#0f172a', marginBottom: 12 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    seeAll: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: '#059669' },
    vitalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
    vitalCard: {
        flex: 1, minWidth: '46%', backgroundColor: '#fff', borderRadius: 14,
        padding: 14, borderTopWidth: 3, alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    vitalIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    vitalValue: { fontFamily: 'Inter-Bold', fontSize: 22 },
    vitalUnit: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8' },
    vitalLabel: { fontFamily: 'Inter-Medium', fontSize: 12, color: '#64748b', marginTop: 4 },
    medRow: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 12, padding: 14, marginBottom: 8, gap: 12,
    },
    medCheck: {
        width: 24, height: 24, borderRadius: 12, borderWidth: 2,
        borderColor: '#cbd5e1', justifyContent: 'center', alignItems: 'center',
    },
    medCheckDone: { backgroundColor: '#059669', borderColor: '#059669' },
    medCheckMark: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    medName: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#0f172a' },
    medNameDone: { textDecorationLine: 'line-through', color: '#94a3b8' },
    medTime: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#94a3b8', marginTop: 2 },
    apptCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 14, padding: 14, marginBottom: 8, gap: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
    },
    apptDot: { width: 10, height: 10, borderRadius: 5 },
    apptDoctor: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#0f172a' },
    apptType: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#94a3b8', marginTop: 2 },
    apptDateWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    apptDate: { fontFamily: 'Inter-Medium', fontSize: 11, color: '#64748b' },
    tipsCard: {
        backgroundColor: '#fffbeb', borderRadius: 16, padding: 18,
        marginTop: 8, marginBottom: 16, borderWidth: 1, borderColor: '#fde68a',
    },
    tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    tipsTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#d97706' },
    tipText: { fontFamily: 'Inter-Regular', fontSize: 13, color: '#92400e', lineHeight: 22 },
    sleepCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 18,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    sleepHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
    sleepTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#7c3aed' },
    sleepGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    sleepItem: { alignItems: 'center', flex: 1 },
    sleepValue: { fontFamily: 'Inter-Bold', fontSize: 18, color: '#0f172a' },
    sleepLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8', marginTop: 2 },
    sleepDivider: { width: 1, height: 36, backgroundColor: '#e2e8f0' },
});
