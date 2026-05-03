import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type MessageRole = "bot" | "user";

interface Message {
  id: number;
  role: MessageRole;
  text: string;
  time: string;
  isTyping?: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "Olá! Eu sou o Safeboot, o assistente virtual do PortSafe. Como posso ajudar na sua segurança hoje?",
    time: "10:45 AM",
  },
  {
    id: 2,
    role: "user",
    text: "Gostaria de verificar o status dos meus protocolos de criptografia ativos.",
    time: "10:46 AM",
  },
  {
    id: 3,
    role: "bot",
    text: "Entendido. Estou acessando o painel do PortSafe. Atualmente, você possui 3 camadas de criptografia AES-256 habilitadas. Deseja realizar um teste de integridade?",
    time: "10:46 AM",
  },
  {
    id: 4,
    role: "user",
    text: "Sim, por favor. Execute o teste agora.",
    time: "10:47 AM",
  },
  {
    id: 5,
    role: "bot",
    text: "PROCESSANDO...",
    time: "10:47 AM",
    isTyping: true,
  },
];

export default function AjustesScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const newMessage: Message = {
      id: messages.length + 1,
      role: "user",
      text: inputText.trim(),
      time,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.botName}>Safeboot</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>ONLINE</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Mensagens */}
        <ScrollView
          ref={scrollRef}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((message) => {
            const isBot = message.role === "bot";
            return (
              <View key={message.id} style={styles.messageGroup}>
                {/* Label do remetente */}
                <Text style={[styles.senderLabel, !isBot && styles.senderLabelUser]}>
                  {isBot ? "SAFEBOOT" : "VOCÊ"}
                </Text>

                {/* Balão */}
                <View style={[styles.bubbleRow, !isBot && styles.bubbleRowUser]}>
                  {isBot && (
                    <View style={styles.botAvatarSmall}>
                      <Ionicons name="shield-checkmark" size={14} color={Colors.primary} />
                    </View>
                  )}
                  <View style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}>
                    {message.isTyping ? (
                      <View style={styles.typingRow}>
                        <View style={[styles.typingDot, { opacity: 1 }]} />
                        <View style={[styles.typingDot, { opacity: 0.6 }]} />
                        <View style={[styles.typingDot, { opacity: 0.3 }]} />
                      </View>
                    ) : (
                      <Text style={[styles.bubbleText, !isBot && styles.bubbleTextUser]}>
                        {message.text}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Horário */}
                <Text style={[styles.messageTime, !isBot && styles.messageTimeUser]}>
                  {message.time}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={Colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(33,150,243,0.12)",
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  botName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  onlineText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#4CAF50",
    letterSpacing: 0.5,
  },
  closeBtn: { padding: 4 },

  // Mensagens
  messagesList: { flex: 1 },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 16,
  },

  messageGroup: {
    gap: 4,
  },

  senderLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  senderLabelUser: {
    textAlign: "right",
  },

  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  bubbleRowUser: {
    justifyContent: "flex-end",
  },

  botAvatarSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(33,150,243,0.12)",
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.2)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  bubble: {
    maxWidth: "78%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleBot: {
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bubbleTextUser: {
    color: "#fff",
  },

  // Typing
  typingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textSecondary,
  },

  messageTime: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginLeft: 34,
  },
  messageTimeUser: {
    textAlign: "right",
    marginLeft: 0,
  },

  // Input
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surfaceElevated,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: Colors.textPrimary,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
});