import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
// @ts-ignore
import {
    CalendarClock, Clock, MapPin, ChevronRight, Plus,
    Star, User,
} from 'lucide-react-native';

type TabType = 'upcoming' | 'past';

const UPCOMING = [
    { id: '1', doctor: 'Dr. R. Sharma', specialty: 'General Physician', date: 'Today', time: '10:00 AM', location: 'PHC Block A', rating: 4.8 },
    { id: '2', doctor: 'Dr. A. Gupta', specialty: 'Ophthalmologist', date: 'Tomorrow', time: '2:30 PM', location: 'District Hospital', rating: 4.5 },
    { id: '3', doctor: 'Dr. M. Singh', specialty: 'Dentist', date: 'In 5 Days', time: '11:00 AM', location: 'PHC Block B', rating: 4.7 },
];

const PAST = [
    { id: '4', doctor: 'Dr. R. Sharma', specialty: 'General Physician', date: 'Dec 15', time: '09:30 AM', notes: 'Follow-up for cold' },
    { id: '5', doctor: 'Dr. P. Verma', specialty: 'Pediatrician', date: 'Nov 28', time: '03:00 PM', notes: 'Vaccination — completed' },
];

export default function PatientAppointmentsScreen() {
    const [tab, setTab] = useState<TabType>('upcoming');

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Summary */}
            <View style={styles.summaryRow}>
                <View style={[styles.summaryCard, { borderTopColor: '#059669' }]}>
                    <Text style={styles.summaryValue}>3</Text>
                    <Text style={styles.summaryLabel}>Upcoming</Text>
                </View>
                <View style={[styles.summaryCard, { borderTopColor: '#7c3aed' }]}>
                    <Text style={styles.summaryValue}>8</Text>
                    <Text style={styles.summaryLabel}>Total Visits</Text>
                </View>
                <View style={[styles.summaryCard, { borderTopColor: '#d97706' }]}>
                    <Text style={styles.summaryValue}>Today</Text>
                    <Text style={styles.summaryLabel}>Next Visit</Text>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
                    onPress={() => setTab('upcoming')}>
                    <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'past' && styles.tabActive]}
                    onPress={() => setTab('past')}>
                    <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>Past Visits</Text>
                </TouchableOpacity>
            </View>

            {tab === 'upcoming' && UPCOMING.map(appt => (
                <TouchableOpacity key={appt.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.docAvatar}>
                            <User size={20} color="#059669" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.docName}>{appt.doctor}</Text>
                            <Text style={styles.docSpec}>{appt.specialty}</Text>
                        </View>
                        <View style={styles.ratingBadge}>
                            <Star size={12} color="#d97706" />
                            <Text style={styles.ratingText}>{appt.rating}</Text>
                        </View>
                    </View>
                    <View style={styles.cardDetails}>
                        <View style={styles.detailItem}>
                            <CalendarClock size={14} color="#94a3b8" />
                            <Text style={styles.detailText}>{appt.date} • {appt.time}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <MapPin size={14} color="#94a3b8" />
                            <Text style={styles.detailText}>{appt.location}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}

            {tab === 'past' && PAST.map(appt => (
                <TouchableOpacity key={appt.id} style={[styles.card, styles.pastCard]}>
                    <View style={styles.cardHeader}>
                        <View style={[styles.docAvatar, { backgroundColor: '#f1f5f9' }]}>
                            <User size={20} color="#94a3b8" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.docName}>{appt.doctor}</Text>
                            <Text style={styles.docSpec}>{appt.specialty}</Text>
                        </View>
                        <Text style={styles.pastDate}>{appt.date}</Text>
                    </View>
                    <Text style={styles.pastNotes}>{appt.notes}</Text>
                </TouchableOpacity>
            ))}

            {/* Book Button */}
            <TouchableOpacity style={styles.bookBtn}>
                <Plus size={20} color="#fff" />
                <Text style={styles.bookText}>Book New Appointment</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20, paddingBottom: 40 },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    summaryCard: {
        flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14,
        borderTopWidth: 3, alignItems: 'center',
    },
    summaryValue: { fontFamily: 'Inter-Bold', fontSize: 20, color: '#0f172a' },
    summaryLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8', marginTop: 2 },
    tabRow: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 12, padding: 4, marginBottom: 20 },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    tabText: { fontFamily: 'Inter-Medium', fontSize: 14, color: '#94a3b8' },
    tabTextActive: { color: '#059669', fontFamily: 'Inter-SemiBold' },
    card: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 2,
    },
    pastCard: { opacity: 0.85 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    docAvatar: {
        width: 44, height: 44, borderRadius: 14, backgroundColor: '#d1fae5',
        justifyContent: 'center', alignItems: 'center',
    },
    docName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#0f172a' },
    docSpec: { fontFamily: 'Inter-Regular', fontSize: 12, color: '#94a3b8', marginTop: 2 },
    ratingBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fef3c7',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8,
    },
    ratingText: { fontFamily: 'Inter-Bold', fontSize: 12, color: '#d97706' },
    cardDetails: { gap: 6, paddingLeft: 56 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailText: { fontFamily: 'Inter-Regular', fontSize: 13, color: '#64748b' },
    pastDate: { fontFamily: 'Inter-Medium', fontSize: 12, color: '#94a3b8' },
    pastNotes: {
        fontFamily: 'Inter-Regular', fontSize: 13, color: '#64748b',
        paddingLeft: 56, marginTop: 4,
    },
    bookBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#059669', borderRadius: 14, height: 52, gap: 8,
        marginTop: 12, shadowColor: '#059669', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
    },
    bookText: { fontFamily: 'Inter-Bold', fontSize: 15, color: '#fff' },
});
