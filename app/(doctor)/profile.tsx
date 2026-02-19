import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import {
    UserRound, Mail, Phone, MapPin, Stethoscope, Award,
    Settings, Bell, Globe, LogOut, ChevronRight, ShieldCheck,
} from 'lucide-react-native';

const MENU_ITEMS = [
    { icon: Settings, label: 'Settings', color: '#64748b' },
    { icon: Bell, label: 'Notifications', color: '#d97706', badge: 3 },
    { icon: Globe, label: 'Language', color: '#7c3aed' },
    { icon: ShieldCheck, label: 'Privacy & Security', color: '#059669' },
];

export default function DoctorProfileScreen() {
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: async () => {
                    await AsyncStorage.removeItem('user_role');
                    router.replace('/login');
                },
            },
        ]);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Profile Header */}
            <View style={styles.profileCard}>
                <View style={styles.avatarCircle}>
                    <UserRound size={40} color="#0891b2" />
                </View>
                <Text style={styles.name}>Dr. Rajesh Sharma</Text>
                <Text style={styles.specialty}>General Physician</Text>
                <View style={styles.badgeRow}>
                    <View style={styles.badge}>
                        <Stethoscope size={12} color="#0891b2" />
                        <Text style={styles.badgeText}>MBBS, MD</Text>
                    </View>
                    <View style={styles.badge}>
                        <Award size={12} color="#d97706" />
                        <Text style={styles.badgeText}>15 yrs exp</Text>
                    </View>
                </View>
            </View>

            {/* Contact Info */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Phone size={16} color="#94a3b8" />
                    <Text style={styles.infoText}>+91 99999 99999</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <Mail size={16} color="#94a3b8" />
                    <Text style={styles.infoText}>dr.sharma@vitaweave.org</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <MapPin size={16} color="#94a3b8" />
                    <Text style={styles.infoText}>PHC Block A, Varanasi, UP</Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>1,847</Text>
                    <Text style={styles.statLabel}>Consultations</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>148</Text>
                    <Text style={styles.statLabel}>Active Patients</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: '#059669' }]}>4.8★</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
            </View>

            {/* Menu */}
            {MENU_ITEMS.map(({ icon: Icon, label, color, badge: b }) => (
                <TouchableOpacity key={label} style={styles.menuItem}>
                    <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
                        <Icon size={18} color={color} />
                    </View>
                    <Text style={styles.menuLabel}>{label}</Text>
                    {b && (
                        <View style={styles.menuBadge}>
                            <Text style={styles.menuBadgeText}>{b}</Text>
                        </View>
                    )}
                    <ChevronRight size={18} color="#cbd5e1" />
                </TouchableOpacity>
            ))}

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <LogOut size={18} color="#dc2626" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    content: { padding: 20, paddingBottom: 40 },
    profileCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 24, alignItems: 'center',
        marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    },
    avatarCircle: {
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe',
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
        borderWidth: 3, borderColor: '#bae6fd',
    },
    name: { fontFamily: 'Inter-Bold', fontSize: 20, color: '#0f172a' },
    specialty: { fontFamily: 'Inter-Medium', fontSize: 14, color: '#0891b2', marginTop: 2 },
    badgeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
    badge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    },
    badgeText: { fontFamily: 'Inter-SemiBold', fontSize: 11, color: '#64748b' },
    infoCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    infoText: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#334155' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 28 },
    statsRow: {
        flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16,
        padding: 18, marginBottom: 20, justifyContent: 'space-between',
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
    },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontFamily: 'Inter-Bold', fontSize: 18, color: '#0f172a' },
    statLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8', marginTop: 2 },
    statDivider: { width: 1, height: 36, backgroundColor: '#e2e8f0' },
    menuItem: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
        borderRadius: 14, padding: 14, marginBottom: 8, gap: 12,
    },
    menuIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    menuLabel: { flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: '#0f172a' },
    menuBadge: {
        width: 22, height: 22, borderRadius: 11, backgroundColor: '#dc2626',
        justifyContent: 'center', alignItems: 'center',
    },
    menuBadgeText: { fontFamily: 'Inter-Bold', fontSize: 10, color: '#fff' },
    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 8, marginTop: 16, paddingVertical: 14, backgroundColor: '#fef2f2',
        borderRadius: 14, borderWidth: 1, borderColor: '#fecaca',
    },
    logoutText: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#dc2626' },
});
