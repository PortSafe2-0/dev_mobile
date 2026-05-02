import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const handleSubmit = () => {
    setCodeSent(true);
    console.log({ email });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PortSafe</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, isWeb && styles.containerWeb]}>

            {/* Ícone */}
            <View style={styles.iconWrapper}>
              <Ionicons name="time-outline" size={40} color={Colors.accent} />
            </View>

            <Text style={styles.title}>Esqueci a senha</Text>
            <Text style={styles.subtitle}>Recupere o acesso à sua conta</Text>

            {/* Banner de código enviado */}
            {codeSent && (
              <View style={styles.infoBanner}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={Colors.accent}
                  style={{ marginTop: 1 }}
                />
                <Text style={styles.infoBannerText}>
                  Código enviado! Verifique seu e-mail (e a pasta de spam).
                </Text>
              </View>
            )}

            {/* Campo E-mail */}
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.textSecondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Botão */}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Redefinir</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </TouchableOpacity>

            <Text style={styles.hint}>
              Enviaremos um código de 6 dígitos para o seu e-mail.
            </Text>

            {/* Link login */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Lembrou a senha? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.loginLink}>Faça login</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 30, // equilibra o botão voltar para centralizar o título
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 40,
  },
  scrollWeb: {
    alignItems: "center",
  },

  container: { width: "100%", alignItems: "center" },
  containerWeb: { maxWidth: 500 },

  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceElevated,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 28,
  },

  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 24,
    width: "100%",
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 18,
  },

  label: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
    marginBottom: 8,
    alignSelf: "flex-start",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 48,
    width: "100%",
    marginBottom: 24,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },

  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 52,
    width: "100%",
    marginBottom: 12,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  hint: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 48,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: { color: Colors.textSecondary, fontSize: 14 },
  loginLink: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },
});