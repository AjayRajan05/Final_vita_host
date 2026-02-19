import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
// @ts-ignore
import {
    CalendarClock, Clock, User, Filter, ChevronRight,
    CheckCircle, AlertCircle, Plus,
} from 'lucide-react-native';

const TODAY = [
    { id: '1', name: 'Sunita Devi', time: '09:00', type: 'Follow-up', status: 'completed' },
    { id: '2', name: 'Ram Prasad', time: '09:30', type: 'New Visit', status: 'in-progress' },
    { id: '3', name: 'Lakshmi Bai', time: '10:00', type: 'Prenatal', status: 'upcoming' },
    { id: '4', name: 'Mohan Kumar', time: '10:30', type: 'Chronic', status: 'upcoming' },
    { id: '5', name: 'Geeta Rani', time: '11:00', type: 'Vaccination', status: 'upcoming' },
];

const UPCOMING = [
    { id: '6', date: 'Tomorrow', name: 'Priya Sharma', time: '09:00', type: 'Prenatal' },
    { id: '7', date: 'Tomorrow', name: 'Anil Verma', time: '10:00', type: 'Chronic Care' },
    { id: '8', date: '3 Days', name: 'Kamla Devi', time: '09:30', type: 'Post-op Review' },
];

type TabType = 'today' | 'upcoming';

export default function AppointmentsScreen() {
    const [tab, setTab] = useState<TabType>('today');

    const statusStyle = (s: string) =>
        s === 'completed' ? styles.statusDone :
            s === 'in-progress' ? styles.statusActive : styles.statusPending;

    const statusLabel = (s: string) =>
        s === 'completed' ? 'Done' :
            s === 'in-progress' ? 'In Progress' : 'Upcoming';

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Summary */}
            <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { borderLeftColor: '#0891b2' }]}>
                    <Text style={styles.summaryValue}>5</Text>
                    <Text style={styles.summaryLabel}>Today</Text>
                </View>
                <View style={[styles.summaryCard, { borderLeftColor: '#7c3aed' }]}>
                    <Text style={styles.summaryValue}>12</Text>
                    <Text style={styles.summaryLabel}>This Week</Text>
                </View>
                <View style={[styles.summaryCard, { borderLeftColor: '#059669' }]}>
                    <Text style={styles.summaryValue}>1</Text>
                    <Text style={styles.summaryLabel}>Completed</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'today' && styles.tabActive]}
                    onPress={() => setTab('today')}>
                    <Text style={[styles.tabText, tab === 'today' && styles.tabTextActive]}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
                    onPress={() => setTab('upcoming')}>
                    <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
                </TouchableOpacity>
            </View>

            {/* Today */}
            {tab === 'today' && TODAY.map(appt => (
                <TouchableOpacity key={appt.id} style={styles.card}>
                    <View style={styles.cardLeft}>
                        <View style={styles.timeWrap}>
                            <Clock size={14} color="#94a3b8" />
                            <Text style={styles.timeText}>{appt.time}</Text>
                        </View>
                        <Text style={styles.cardName}>{appt.name}</Text>
                        <Text style={styles.cardType}>{appt.type}</Text>
                    </View>
                    <View style={styles.cardRight}>
                        <View style={[styles.statusBadge, statusStyle(appt.status)]}>
                            <Text style={[styles.statusText, statusStyle(appt.status)]}>{statusLabel(appt.status)}</Text>
                        </View>
                        <ChevronRight size={18} color="#cbd5e1" />
                    </View>
                </TouchableOpacity>
            ))}

            {/* Upcoming */}
            {tab === 'upcoming' && UPCOMING.map(appt => (
                <TouchableOpacity key={appt.id} style={styles.card}>
                    <View style={styles.cardLeft}>
                        <View style={styles.dateBadge}>
                            <CalendarClock size={12} color="#7c3aed" />
                            <Text style={styles.dateText}>{appt.date}</Text>
                        </View>
                        <Text style={styles.cardName}>{appt.name}</Text>
                        <Text style={styles.cardType}>{appt.type} • {appt.time}</Text>
                    </View>
                    <ChevronRight size={18} color="#cbd5e1" />
                </TouchableOpacity>
            ))}

            {/* FAB */}
            <TouchableOpacity style={styles.fab}>
                <Plus size={24} color="#fff" />
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20, paddingBottom: 100 },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    summaryCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
        borderLeftWidth: 3, alignItems: 'center',
    },
    summaryValue: { fontFamily: 'Inter-Bold', fontSize: 22, color: '#0f172a' },
    summaryLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8', marginTop: 2 },
    tabRow: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    tabText: { fontFamily: 'Inter-Medium', fontSize: 14, color: '#94a3b8' },
    tabTextActive: { color: '#0891b2', fontFamily: 'Inter-SemiBold' },
    card: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
    },
    cardLeft: { flex: 1 },
    cardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    timeWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
    timeText: { fontFamily: 'Inter-Medium', fontSize: 12, color: '#94a3b8' },
    cardName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#0f172a' },
    cardType: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#94a3b8', marginTop: 2 },
    statusBadge: {
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    },
    statusDone: { backgroundColor: '#d1fae5', color: '#059669' },
    statusActive: { backgroundColor: '#e0f2fe', color: '#0891b2' },
    statusPending: { backgroundColor: '#f1f5f9', color: '#94a3b8' },
    statusText: { fontFamily: 'Inter-SemiBold', fontSize: 11 },
    dateBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#ede9fe', paddingHorizontal: 8, paddingVertical: 3,
        borderRadius: 8, alignSelf: 'flex-start', marginBottom: 6,
    },
    dateText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: '#7c3aed' },
    fab: {
        position: 'absolute', bottom: 30, right: 20,
        width: 56, height: 56, borderRadius: 28, backgroundColor: '#0891b2',
        justifyContent: 'center', alignItems: 'center',
        shadowColor: '#0891b2', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
    },
});
