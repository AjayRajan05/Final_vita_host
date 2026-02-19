import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
// @ts-ignore
import {
    Calendar, Users, Clock, Activity, TrendingUp, AlertCircle,
    ChevronRight, Stethoscope, BellDot,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const MOCK_APPOINTMENTS = [
    { id: '1', name: 'Sunita Devi', time: '09:00 AM', type: 'Follow-up', risk: 'high' },
    { id: '2', name: 'Ram Prasad', time: '09:30 AM', type: 'New Visit', risk: 'moderate' },
    { id: '3', name: 'Lakshmi Bai', time: '10:00 AM', type: 'Prenatal', risk: 'low' },
    { id: '4', name: 'Mohan Kumar', time: '10:30 AM', type: 'Chronic Care', risk: 'high' },
];

const STATS = [
    { label: 'Today', value: '12', icon: Calendar, color: '#0891b2', bg: '#e0f2fe' },
    { label: 'Patients', value: '148', icon: Users, color: '#7c3aed', bg: '#ede9fe' },
    { label: 'Pending', value: '5', icon: Clock, color: '#d97706', bg: '#fef3c7' },
    { label: 'Critical', value: '3', icon: AlertCircle, color: '#dc2626', bg: '#fee2e2' },
];

const ALERTS = [
    { text: 'Sunita Devi: BP 160/100 — Urgent follow-up needed', severity: 'high' },
    { text: 'Blood bank stock low — schedule donation camp', severity: 'moderate' },
    { text: 'Vaccination drive report pending for review', severity: 'low' },
];

export default function DoctorDashboard() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Good Morning,</Text>
                    <Text style={styles.doctorName}>Dr. Sharma</Text>
                </View>
                <TouchableOpacity style={styles.notifBtn}>
                    <BellDot size={22} color="#0891b2" />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </Animated.View>

            {/* Stats */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.statsGrid}>
                {STATS.map(({ label, value, icon: Icon, color, bg }) => (
                    <View key={label} style={[styles.statCard, { borderLeftColor: color }]}>
                        <View style={[styles.statIcon, { backgroundColor: bg }]}>
                            <Icon size={18} color={color} />
                        </View>
                        <Text style={[styles.statValue, { color }]}>{value}</Text>
                        <Text style={styles.statLabel}>{label}</Text>
                    </View>
                ))}
            </Animated.View>

            {/* AI Quick Insights */}
            <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.aiCard}>
                <View style={styles.aiHeader}>
                    <View style={styles.aiIconWrap}>
                        <Activity size={18} color="#0891b2" />
                    </View>
                    <Text style={styles.aiTitle}>AI Quick Insights</Text>
                </View>
                <Text style={styles.aiText}>
                    3 patients showing deteriorating trends. Sunita Devi's BP has risen 15% over 2 weeks.
                    Mohan Kumar's glucose levels require medication adjustment.
                </Text>
                <TouchableOpacity style={styles.aiBtn}>
                    <Text style={styles.aiBtnText}>View Full Analysis</Text>
                    <ChevronRight size={16} color="#0891b2" />
                </TouchableOpacity>
            </Animated.View>

            {/* Alerts */}
            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
                <Text style={styles.sectionTitle}>Priority Alerts</Text>
                {ALERTS.map((a, i) => (
                    <View key={i} style={[
                        styles.alertRow,
                        a.severity === 'high' && styles.alertHigh,
                        a.severity === 'moderate' && styles.alertModerate,
                    ]}>
                        <AlertCircle size={16} color={
                            a.severity === 'high' ? '#dc2626' :
                                a.severity === 'moderate' ? '#d97706' : '#059669'
                        } />
                        <Text style={styles.alertText}>{a.text}</Text>
                    </View>
                ))}
            </Animated.View>

            {/* Today's Queue */}
            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Patient Queue</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See All</Text>
                    </TouchableOpacity>
                </View>
                {MOCK_APPOINTMENTS.map((appt) => (
                    <TouchableOpacity key={appt.id} style={styles.apptCard}>
                        <View style={[
                            styles.riskDot,
                            appt.risk === 'high' && { backgroundColor: '#dc2626' },
                            appt.risk === 'moderate' && { backgroundColor: '#d97706' },
                            appt.risk === 'low' && { backgroundColor: '#059669' },
                        ]} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.apptName}>{appt.name}</Text>
                            <Text style={styles.apptType}>{appt.type}</Text>
                        </View>
                        <View style={styles.apptTimeWrap}>
                            <Clock size={14} color="#94a3b8" />
                            <Text style={styles.apptTime}>{appt.time}</Text>
                        </View>
                        <ChevronRight size={18} color="#cbd5e1" />
                    </TouchableOpacity>
                ))}
            </Animated.View>

            {/* Performance */}
            <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.perfCard}>
                <View style={styles.perfHeader}>
                    <TrendingUp size={18} color="#059669" />
                    <Text style={styles.perfTitle}>Weekly Performance</Text>
                </View>
                <View style={styles.perfGrid}>
                    <View style={styles.perfItem}>
                        <Text style={styles.perfValue}>47</Text>
                        <Text style={styles.perfLabel}>Consultations</Text>
                    </View>
                    <View style={styles.perfDivider} />
                    <View style={styles.perfItem}>
                        <Text style={styles.perfValue}>92%</Text>
                        <Text style={styles.perfLabel}>Satisfaction</Text>
                    </View>
                    <View style={styles.perfDivider} />
                    <View style={styles.perfItem}>
                        <Text style={[styles.perfValue, { color: '#059669' }]}>↑12%</Text>
                        <Text style={styles.perfLabel}>vs. Last Week</Text>
                    </View>
                </View>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20, paddingBottom: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    greeting: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#64748b' },
    doctorName: { fontFamily: 'Inter-Bold', fontSize: 24, color: '#0f172a' },
    notifBtn: {
        width: 44, height: 44, borderRadius: 14, backgroundColor: '#e0f2fe',
        justifyContent: 'center', alignItems: 'center',
    },
    badge: {
        position: 'absolute', top: 10, right: 10, width: 8, height: 8,
        borderRadius: 4, backgroundColor: '#dc2626',
    },
    statsGrid: {
        flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20,
    },
    statCard: {
        flex: 1, minWidth: '46%', backgroundColor: '#fff', borderRadius: 14,
        padding: 14, borderLeftWidth: 3, shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04,
        shadowRadius: 4, elevation: 2,
    },
    statIcon: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statValue: { fontFamily: 'Inter-Bold', fontSize: 22 },
    statLabel: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#94a3b8', marginTop: 2 },
    aiCard: {
        backgroundColor: '#f0f9ff', borderRadius: 16, padding: 18,
        marginBottom: 24, borderWidth: 1, borderColor: '#bae6fd',
    },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    aiIconWrap: { width: 30, height: 30, borderRadius: 8, backgroundColor: '#e0f2fe', justifyContent: 'center', alignItems: 'center' },
    aiTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#0891b2' },
    aiText: { fontFamily: 'Inter-Regular', fontSize: 13, color: '#334155', lineHeight: 20, marginBottom: 12 },
    aiBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end' },
    aiBtnText: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: '#0891b2' },
    sectionTitle: { fontFamily: 'Inter-SemiBold', fontSize: 16, color: '#0f172a', marginBottom: 12 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    seeAll: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: '#0891b2' },
    alertRow: {
        flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12,
        backgroundColor: '#fff', borderRadius: 12, marginBottom: 8, borderLeftWidth: 3, borderLeftColor: '#059669',
    },
    alertHigh: { borderLeftColor: '#dc2626', backgroundColor: '#fef2f2' },
    alertModerate: { borderLeftColor: '#d97706', backgroundColor: '#fffbeb' },
    alertText: { fontFamily: 'Inter-Regular', fontSize: 13, color: '#334155', flex: 1, lineHeight: 18 },
    apptCard: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 14, padding: 14, marginBottom: 8, gap: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
    },
    riskDot: { width: 10, height: 10, borderRadius: 5 },
    apptName: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#0f172a' },
    apptType: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#94a3b8', marginTop: 2 },
    apptTimeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    apptTime: { fontFamily: 'Inter-Medium', fontSize: 12, color: '#64748b' },
    perfCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 18, marginTop: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    },
    perfHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
    perfTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#0f172a' },
    perfGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    perfItem: { alignItems: 'center', flex: 1 },
    perfValue: { fontFamily: 'Inter-Bold', fontSize: 20, color: '#0f172a' },
    perfLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8', marginTop: 2 },
    perfDivider: { width: 1, height: 36, backgroundColor: '#e2e8f0' },
});
