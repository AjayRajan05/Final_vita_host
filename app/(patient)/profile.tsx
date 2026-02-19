import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// @ts-ignore
import {
    UserRound, Mail, Phone, MapPin, Heart,
    Settings, Bell, Globe, LogOut, ChevronRight, FileText,
} from 'lucide-react-native';

const MENU_ITEMS = [
    { icon: FileText, label: 'Health Records', color: '#059669' },
    { icon: Settings, label: 'Settings', color: '#64748b' },
    { icon: Bell, label: 'Notifications', color: '#d97706', badge: 2 },
    { icon: Globe, label: 'Language', color: '#7c3aed' },
];

export default function PatientProfileScreen() {
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
            {/* Profile */}
            <View style={styles.profileCard}>
                <View style={styles.avatarCircle}>
                    <UserRound size={40} color="#059669" />
                </View>
                <Text style={styles.name}>Lakshmi Bai</Text>
                <Text style={styles.meta}>Female • 34 years • Blood Group O+</Text>
                <View style={styles.idBadge}>
                    <Text style={styles.idText}>Patient ID: VW-2024-1847</Text>
                </View>
            </View>

            {/* Contact */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Phone size={16} color="#94a3b8" />
                    <Text style={styles.infoText}>+91 88888 88888</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                    <MapPin size={16} color="#94a3b8" />
                    <Text style={styles.infoText}>Village Ramnagar, Block A, Varanasi</Text>
                </View>
            </View>

            {/* Health Summary */}
            <View style={styles.healthCard}>
                <View style={styles.healthHeader}>
                    <Heart size={16} color="#dc2626" />
                    <Text style={styles.healthTitle}>Health Summary</Text>
                </View>
                <View style={styles.healthGrid}>
                    <View style={styles.healthItem}>
                        <Text style={styles.healthValue}>8</Text>
                        <Text style={styles.healthLabel}>Visits</Text>
                    </View>
                    <View style={styles.healthDivider} />
                    <View style={styles.healthItem}>
                        <Text style={[styles.healthValue, { color: '#059669' }]}>Normal</Text>
                        <Text style={styles.healthLabel}>BP Status</Text>
                    </View>
                    <View style={styles.healthDivider} />
                    <View style={styles.healthItem}>
                        <Text style={styles.healthValue}>Dec 28</Text>
                        <Text style={styles.healthLabel}>Last Visit</Text>
                    </View>
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
        width: 80, height: 80, borderRadius: 40, backgroundColor: '#d1fae5',
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
        borderWidth: 3, borderColor: '#a7f3d0',
    },
    name: { fontFamily: 'Inter-Bold', fontSize: 20, color: '#0f172a' },
    meta: { fontFamily: 'Inter-Medium', fontSize: 13, color: '#64748b', marginTop: 4 },
    idBadge: {
        marginTop: 10, backgroundColor: '#d1fae5', paddingHorizontal: 12,
        paddingVertical: 5, borderRadius: 8,
    },
    idText: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#059669' },
    infoCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
    },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    infoText: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#334155' },
    divider: { height: 1, backgroundColor: '#f1f5f9', marginLeft: 28 },
    healthCard: {
        backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 20,
        shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03, shadowRadius: 3, elevation: 1,
    },
    healthHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 },
    healthTitle: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#0f172a' },
    healthGrid: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    healthItem: { alignItems: 'center', flex: 1 },
    healthValue: { fontFamily: 'Inter-Bold', fontSize: 18, color: '#0f172a' },
    healthLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: '#94a3b8', marginTop: 2 },
    healthDivider: { width: 1, height: 36, backgroundColor: '#e2e8f0' },
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
