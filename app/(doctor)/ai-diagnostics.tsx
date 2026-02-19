import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator,
} from 'react-native';
// @ts-ignore
import {
    BotMessageSquare, Send, Sparkles, AlertTriangle,
    FileText, Stethoscope,
} from 'lucide-react-native';

const QUICK_PROMPTS = [
    'Analyze patient vitals for Sunita Devi',
    'Suggest treatment for high BP',
    'Drug interaction check: Metformin + Lisinopril',
    'Summarize prenatal care guidelines',
];

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
}

export default function AIDiagnosticsScreen() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            text: 'Hello Dr. Sharma! I am your AI diagnostics assistant. I can help with patient analysis, drug interactions, treatment suggestions, and more. How can I help you today?',
            sender: 'bot',
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async (text?: string) => {
        const msg = text || inputText.trim();
        if (!msg) return;

        const userMsg: Message = { id: Date.now().toString(), text: msg, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setLoading(true);

        // Simulated AI response
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: `Based on medical analysis:\n\n• ${msg.includes('BP') || msg.includes('vitals')
                    ? 'Patient shows Stage 2 hypertension (BP 160/100). Recommend Amlodipine 5mg daily. Schedule follow-up in 1 week.\n• Consider lifestyle modifications: low-sodium diet, 30 min daily walk.\n• Monitor for end-organ damage signs.'
                    : msg.includes('drug') || msg.includes('interaction')
                        ? 'No major interactions found between these medications. However:\n• Monitor renal function quarterly\n• Check potassium levels — both can cause hyperkalemia\n• Space doses if GI discomfort occurs.'
                        : 'I have analyzed the request. Based on current clinical guidelines and the patient data available:\n• Recommended action has been generated\n• Please review the detailed report in the patient file\n• Schedule follow-up as clinically indicated.'}`,
                sender: 'bot',
            };
            setMessages(prev => [...prev, botMsg]);
            setLoading(false);
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
                {/* Quick Prompts */}
                {messages.length <= 1 && (
                    <View style={styles.promptSection}>
                        <View style={styles.promptHeader}>
                            <Sparkles size={16} color="#0891b2" />
                            <Text style={styles.promptTitle}>Quick Actions</Text>
                        </View>
                        {QUICK_PROMPTS.map((p, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.promptChip}
                                onPress={() => handleSend(p)}>
                                <Text style={styles.promptText}>{p}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Messages */}
                {messages.map(m => (
                    <View
                        key={m.id}
                        style={[styles.msgRow, m.sender === 'user' ? styles.msgUser : styles.msgBot]}>
                        {m.sender === 'bot' && (
                            <View style={styles.botAvatar}>
                                <BotMessageSquare size={16} color="#0891b2" />
                            </View>
                        )}
                        <View style={[
                            styles.msgBubble,
                            m.sender === 'user' ? styles.bubbleUser : styles.bubbleBot,
                        ]}>
                            <Text style={[
                                styles.msgText,
                                m.sender === 'user' && styles.msgTextUser,
                            ]}>{m.text}</Text>
                        </View>
                    </View>
                ))}

                {loading && (
                    <View style={[styles.msgRow, styles.msgBot]}>
                        <View style={styles.botAvatar}>
                            <BotMessageSquare size={16} color="#0891b2" />
                        </View>
                        <View style={[styles.msgBubble, styles.bubbleBot]}>
                            <ActivityIndicator size="small" color="#0891b2" />
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputBar}>
                <TextInput
                    style={styles.input}
                    placeholder="Ask about diagnostics, patients..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={() => handleSend()}
                    returnKeyType="send"
                />
                <TouchableOpacity
                    style={[styles.sendBtn, !inputText && styles.sendDisabled]}
                    onPress={() => handleSend()}
                    disabled={!inputText || loading}>
                    <Send size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    chatArea: { flex: 1 },
    chatContent: { padding: 16, paddingBottom: 20 },
    promptSection: { marginBottom: 20 },
    promptHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
    promptTitle: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: '#0891b2' },
    promptChip: {
        backgroundColor: '#e0f2fe', paddingHorizontal: 14, paddingVertical: 10,
        borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#bae6fd',
    },
    promptText: { fontFamily: 'Inter-Medium', fontSize: 13, color: '#0891b2' },
    msgRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
    msgUser: { justifyContent: 'flex-end' },
    msgBot: { justifyContent: 'flex-start' },
    botAvatar: {
        width: 32, height: 32, borderRadius: 10, backgroundColor: '#e0f2fe',
        justifyContent: 'center', alignItems: 'center', marginTop: 4,
    },
    msgBubble: { maxWidth: '78%', borderRadius: 16, padding: 14 },
    bubbleUser: { backgroundColor: '#0891b2', borderBottomRightRadius: 4 },
    bubbleBot: { backgroundColor: '#fff', borderBottomLeftRadius: 4, borderWidth: 1, borderColor: '#e2e8f0' },
    msgText: { fontFamily: 'Inter-Regular', fontSize: 14, color: '#334155', lineHeight: 20 },
    msgTextUser: { color: '#fff' },
    inputBar: {
        flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8,
        backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0',
    },
    input: {
        flex: 1, backgroundColor: '#f1f5f9', borderRadius: 14,
        paddingHorizontal: 16, height: 48, fontFamily: 'Inter-Regular', fontSize: 14,
    },
    sendBtn: {
        width: 48, height: 48, borderRadius: 14, backgroundColor: '#0891b2',
        justifyContent: 'center', alignItems: 'center',
    },
    sendDisabled: { backgroundColor: '#94a3b8' },
});
