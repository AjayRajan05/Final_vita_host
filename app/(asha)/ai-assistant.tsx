import { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Send, Bot, User, MessageSquare, BarChart2, ChevronRight, Mic, MicOff, Key } from 'lucide-react-native';
import { Colors, Fonts, getRiskColors } from '../constants/theme';
import { AI_INSIGHTS, type AIInsight, ALL_PATIENTS, type Patient } from '../constants/data';
import { getAIInsights } from '../../lib/api';
import { generateCaseSummary } from '../../lib/logic';
import { getStoredApiKey, initializeGemini, getMedGemmaResponse } from '../../lib/gemini';

type Message = {
  id: number;
  type: 'bot' | 'user';
  text: string;
};

const BOT_RESPONSES: Record<string, string> = {
  default: "I'm here to help with health queries. Could you please provide more details?",
  blood: "Blood test results should be interpreted by a qualified doctor. Common values: Haemoglobin (normal: 12–17 g/dL), Blood Sugar (fasting: 70–100 mg/dL), Creatinine (0.6–1.2 mg/dL). Share specific values for guidance.",
  pregnancy: "For prenatal care, ensure regular ANC check-ups at 4, 6, 8, and 9 months. Key supplements: Iron-Folic Acid tablets daily. Watch for danger signs: severe headache, blurred vision, or reduced foetal movement.\n\n⚠️ Community Alert: 3 pregnant patients in your ward missed their 6-month ANC. Check the Insights tab.",
  vaccine: "Immunisation schedule for infants: BCG at birth, OPV + Pentavalent at 6, 10, 14 weeks, MR vaccine at 9–12 months. Ensure cold chain is maintained.\n\n📅 Upcoming: DPT booster camp on Mar 5 — 12 children registered.",
  nutrition: "A balanced diet for a pregnant woman: 2300–2500 kcal/day, 60g protein, iron-rich foods (leafy greens, lentils), and calcium sources (milk, curd). Avoid raw/undercooked foods.",
  diabetes: "For diabetes management: monitor fasting blood sugar (target < 126 mg/dL), encourage low-GI foods, regular 30-min walks, and medication adherence. Schedule HbA1c every 3 months.",
  fever: "🌡️ Community Signal: Fever cases are rising in Ward 3 — 7 reports this week. Recommend:\n1. Visit affected households\n2. Check for malaria/dengue symptoms\n3. Escalate to PHC if cluster confirmed\n4. Ensure ORS availability",
  diarrhea: "💧 ORS demand is up 60% in Ward 2. Recommend:\n1. Check local water source quality\n2. Distribute ORS sachets\n3. Educate on hand hygiene\n4. Report to PHC if cases exceed 5 per day",
};

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();

  // 1. Patient Summary Logic
  if (lower.includes('summary') || lower.includes('case') || lower.includes('patient') || lower.includes('detail')) {
    // Attempt to find a patient name in the query
    const foundPatient = ALL_PATIENTS.find(p => lower.includes(p.name.toLowerCase()));
    if (foundPatient) {
      return "✨ Case Summary: " + generateCaseSummary(foundPatient);
    }
  }

  // 2. Existing Static Responses
  if (lower.includes('blood')) return BOT_RESPONSES.blood;
  if (lower.includes('pregnan') || lower.includes('prenatal') || lower.includes('maternal')) return BOT_RESPONSES.pregnancy;
  if (lower.includes('vaccine') || lower.includes('vaccin') || lower.includes('immunis')) return BOT_RESPONSES.vaccine;
  if (lower.includes('nutrition') || lower.includes('diet') || lower.includes('food')) return BOT_RESPONSES.nutrition;
  if (lower.includes('diabetes') || lower.includes('sugar')) return BOT_RESPONSES.diabetes;
  if (lower.includes('fever') || lower.includes('temperature')) return BOT_RESPONSES.fever;
  if (lower.includes('diarr') || lower.includes('loose') || lower.includes('ors')) return BOT_RESPONSES.diarrhea;

  return BOT_RESPONSES.default;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    type: 'bot',
    text: "Hello! I'm VitaWeave AI, your health assistant. I can help with patient queries, medication info, and health guidelines. Switch to 📊 Insights to see community health summaries.",
  },
];

const QUICK_SUGGESTIONS = [
  'Fever in community',
  'Pregnancy care',
  'Vaccination schedule',
  'Nutrition tips',
  'Diabetes management',
  'Diarrhoea outbreak',
];

type Mode = 'chat' | 'insights';

function InsightCard({ insight }: { insight: AIInsight }) {
  const isInfo = insight.severity === 'info';
  const colors = isInfo
    ? { bg: Colors.primaryLight, text: Colors.primary }
    : getRiskColors(insight.severity as any);
  return (
    <View style={[insightStyles.card, { borderLeftColor: colors.text }]}>
      <View style={insightStyles.cardHeader}>
        <Text style={insightStyles.icon}>{insight.icon}</Text>
        <View style={{ flex: 1 }}>
          <Text style={insightStyles.title}>{insight.title}</Text>
        </View>
        <View style={[insightStyles.severityPill, { backgroundColor: colors.bg }]}>
          <Text style={[insightStyles.severityText, { color: colors.text }]}>
            {isInfo ? 'Info' : insight.severity}
          </Text>
        </View>
      </View>
      <Text style={insightStyles.desc}>{insight.description}</Text>
      <TouchableOpacity style={[insightStyles.actionBtn, { backgroundColor: colors.bg }]}>
        <Text style={[insightStyles.actionText, { color: colors.text }]}>{insight.action}</Text>
        <ChevronRight size={13} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
}

export default function AIAssistantScreen() {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [mode, setMode] = useState<Mode>('chat');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>(AI_INSIGHTS);
  const [loading, setLoading] = useState(true);

  // Gemini State
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadInsights();
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    const key = await getStoredApiKey();
    if (key) setApiKey(key);
  };

  const handleSaveKey = async () => {
    if (tempKey.trim()) {
      await initializeGemini(tempKey.trim());
      setApiKey(tempKey.trim());
      setShowKeyModal(false);
    }
  };

  const loadInsights = async () => {
    setLoading(true);
    const data = await getAIInsights();
    if (data.length > 0) setInsights(data);
    setLoading(false);
  };

  const sendMessage = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), type: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      handleBotResponse(trimmed);
    }, 1200);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [inputText]);

  const handleBotResponse = async (text: string) => {
    let responseText = '';

    // Check for local logic first (summaries)
    const lower = text.toLowerCase();
    if (lower.includes('summary') || lower.includes('case') || lower.includes('patient')) {
      const foundPatient = ALL_PATIENTS.find(p => lower.includes(p.name.toLowerCase()));
      if (foundPatient) {
        responseText = "✨ Case Summary: " + generateCaseSummary(foundPatient);
      }
    }

    // If no local logic, try Gemini if key exists
    if (!responseText) {
      if (apiKey) {
        responseText = await getMedGemmaResponse(text);
      } else {
        responseText = getBotResponse(text); // Fallback to mocks
      }
    }

    const botMsg: Message = {
      id: Date.now() + 1,
      type: 'bot',
      text: responseText,
    };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  // ─── Voice AI Logic ───
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e: any) => {
        console.error('Speech error:', e);
        setIsListening(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(prev => (prev ? prev + ' ' + transcript : transcript));
      };
      recognition.start();
    } else {
      alert('Voice input is only supported on Chrome (Web) for this demo.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <View style={[styles.container, isLargeScreen && styles.containerLarge]}>

        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'chat' && styles.modeBtnActive]}
            onPress={() => setMode('chat')}>
            <MessageSquare size={15} color={mode === 'chat' ? '#fff' : Colors.textSecondary} />
            <Text style={[styles.modeBtnText, mode === 'chat' && styles.modeBtnTextActive]}>
              Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'insights' && styles.modeBtnActive]}
            onPress={() => setMode('insights')}>
            <BarChart2 size={15} color={mode === 'insights' ? '#fff' : Colors.textSecondary} />
            <Text style={[styles.modeBtnText, mode === 'insights' && styles.modeBtnTextActive]}>
              Insights
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, { flex: 0, width: 40 }]}
            onPress={() => setShowKeyModal(true)}>
            <Key size={15} color={apiKey ? Colors.success : Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* API Key Modal */}
        {showKeyModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Setup MedGemma AI 🧠</Text>
              <Text style={styles.modalText}>Enter your Google Gemini API Key to enable real-time medical intelligence using the "MedGemma" system.</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Paste API Key here..."
                value={tempKey}
                onChangeText={setTempKey}
                secureTextEntry
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowKeyModal(false)}>
                  <Text style={styles.modalBtnTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalBtnSave} onPress={handleSaveKey}>
                  <Text style={styles.modalBtnTextSave}>Save Key</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {mode === 'insights' ? (
          /* ── Insights Panel ── */
          <ScrollView style={styles.insightsScroll} contentContainerStyle={styles.insightsContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Text style={styles.insightsHeading}>Community Health Insights</Text>
              {loading && <ActivityIndicator size="small" color={Colors.primary} />}
            </View>
            <Text style={styles.insightsSubheading}>
              AI-detected patterns from your ward — updated weekly
            </Text>
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </ScrollView>
        ) : (
          /* ── Chat Panel ── */
          <>
            <ScrollView
              ref={scrollRef}
              style={styles.messagesContainer}
              contentContainerStyle={styles.messagesContent}
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
              {messages.map((message) => (
                <View
                  key={message.id}
                  style={[
                    styles.messageWrapper,
                    message.type === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
                  ]}>
                  {message.type === 'bot' && (
                    <View style={styles.botIcon}>
                      <Bot size={16} color={Colors.primary} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.message,
                      message.type === 'user' ? styles.userMessage : styles.botMessage,
                      isLargeScreen && styles.messageLarge,
                    ]}>
                    <Text
                      style={[
                        styles.messageText,
                        message.type === 'user' ? styles.userMessageText : styles.botMessageText,
                      ]}>
                      {message.text}
                    </Text>
                  </View>
                  {message.type === 'user' && (
                    <View style={styles.userIcon}>
                      <User size={16} color={Colors.primary} />
                    </View>
                  )}
                </View>
              ))}

              {isTyping && (
                <View style={[styles.messageWrapper, styles.botMessageWrapper]}>
                  <View style={styles.botIcon}>
                    <Bot size={16} color={Colors.primary} />
                  </View>
                  <View style={[styles.message, styles.botMessage, styles.typingBubble]}>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text style={styles.typingText}>Thinking...</Text>
                  </View>
                </View>
              )}
            </ScrollView>

            {/* Quick Suggestions */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.suggestionsContainer}
              contentContainerStyle={styles.suggestionsContent}>
              {QUICK_SUGGESTIONS.map((s) => (
                <TouchableOpacity
                  key={s}
                  style={styles.suggestion}
                  onPress={() => setInputText(s)}>
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ask a health question..."
                placeholderTextColor="#94a3b8"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[styles.micButton, isListening && styles.micButtonActive]}
                onPress={startListening}>
                {isListening ? <MicOff size={18} color="#fff" /> : <Mic size={18} color={Colors.textSecondary} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!inputText.trim() || isTyping}>
                <Send size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  containerLarge: { maxWidth: 800, alignSelf: 'center', width: '100%' },
  // Mode Toggle
  modeToggle: {
    flexDirection: 'row',
    margin: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9,
  },
  modeBtnActive: { backgroundColor: Colors.primary },
  modeBtnText: { fontFamily: Fonts.semiBold, fontSize: 13, color: Colors.textSecondary },
  modeBtnTextActive: { color: '#fff' },
  // Insights
  insightsScroll: { flex: 1 },
  insightsContent: { padding: 16, paddingBottom: 32 },
  insightsHeading: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.textPrimary, marginBottom: 4 },
  insightsSubheading: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
  // Chat
  messagesContainer: { flex: 1 },
  messagesContent: { padding: 16, paddingBottom: 8 },
  messageWrapper: { marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  userMessageWrapper: { justifyContent: 'flex-end' },
  botMessageWrapper: { justifyContent: 'flex-start' },
  botIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  userIcon: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center', alignItems: 'center', flexShrink: 0,
  },
  message: { borderRadius: 16, padding: 12, maxWidth: '75%' },
  messageLarge: { maxWidth: '60%' },
  userMessage: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  botMessage: {
    backgroundColor: Colors.surface, borderBottomLeftRadius: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 3, elevation: 2,
  },
  typingBubble: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  typingText: { fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary },
  messageText: { fontSize: 14, lineHeight: 20 },
  userMessageText: { color: '#ffffff', fontFamily: Fonts.regular },
  botMessageText: { color: Colors.textPrimary, fontFamily: Fonts.regular },
  suggestionsContainer: {
    borderTopWidth: 1, borderTopColor: '#f1f5f9', backgroundColor: Colors.surface,
  },
  suggestionsContent: { paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  suggestion: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 4,
  },
  suggestionText: { fontFamily: Fonts.regular, fontSize: 12, color: Colors.primary },
  inputContainer: {
    flexDirection: 'row', padding: 12, gap: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.surface, alignItems: 'flex-end',
  },
  input: {
    flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, fontFamily: Fonts.regular, color: Colors.textPrimary,
    maxHeight: 100, borderWidth: 1, borderColor: Colors.border,
  },
  sendButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  sendButtonDisabled: { backgroundColor: Colors.textMuted },
  micButton: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  micButtonActive: {
    backgroundColor: Colors.danger, borderColor: Colors.danger,
  },
  // Modal Styles
  modalOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 100,
  },
  modalContent: {
    backgroundColor: Colors.surface, width: '85%', maxWidth: 400,
    borderRadius: 16, padding: 20, shadowColor: '#000', elevation: 5,
  },
  modalTitle: { fontFamily: Fonts.bold, fontSize: 18, marginBottom: 10, color: Colors.textPrimary },
  modalText: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary, marginBottom: 16 },
  modalInput: {
    backgroundColor: '#f1f5f9', borderRadius: 8, padding: 12, marginBottom: 16,
    fontFamily: Fonts.regular, borderWidth: 1, borderColor: Colors.border,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  modalBtnCancel: { padding: 10 },
  modalBtnTextCancel: { fontFamily: Fonts.semiBold, color: Colors.textSecondary },
  modalBtnSave: { backgroundColor: Colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  modalBtnTextSave: { fontFamily: Fonts.semiBold, color: '#fff' },
});

const insightStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  icon: { fontSize: 22 },
  title: { fontFamily: Fonts.semiBold, fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  severityPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  severityText: { fontFamily: Fonts.semiBold, fontSize: 10 },
  desc: {
    fontFamily: Fonts.regular, fontSize: 13, color: Colors.textSecondary,
    lineHeight: 18, marginBottom: 10,
  },
  actionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
  },
  actionText: { fontFamily: Fonts.semiBold, fontSize: 12 },
});