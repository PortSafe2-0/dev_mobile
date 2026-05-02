    import React, { useState, useRef } from "react";
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

const CODE_LENGTH = 6;

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputsRef = useRef<(TextInput | null)[]>([]);

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const handleCodeChange = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    console.log({ email, code: code.join(""), newPassword, confirmPassword });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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

            <Text style={styles.title}>Redefinir Senha</Text>
            <Text style={styles.subtitle}>Digite o código recebido por e-mail</Text>

            {/* E-mail */}
            <Text style={styles.label}>E-mail</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Código de 6 dígitos */}
            <Text style={[styles.label, { marginTop: 16 }]}>Código de 6 dígitos</Text>
            <View style={styles.codeWrapper}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputsRef.current[index] = ref; }}
                  style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                  value={digit}
                  onChangeText={(text) => handleCodeChange(text, index)}
                  onKeyPress={(e) => handleCodeKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  textAlign="center"
                  selectionColor={Colors.primary}
                />
              ))}
            </View>

            {/* Nova Senha */}
            <Text style={[styles.label, { marginTop: 16 }]}>Nova Senha</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Digite sua nova senha"
                placeholderTextColor={Colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword((v) => !v)}>
                <Ionicons
                  name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Confirmar Nova Senha */}
            <Text style={[styles.label, { marginTop: 16 }]}>Confirmar a nova senha</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirme sua nova senha"
                placeholderTextColor={Colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((v) => !v)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>

            {/* Botão */}
            <TouchableOpacity style={styles.submitButton}  onPress={() => router.push("/auth/login")}>
              <Text style={styles.submitButtonText}>Redefinir Senha</Text>
            </TouchableOpacity>

            {/* Voltar para o login */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.push("/auth/login")}
            >
              <Ionicons name="chevron-back" size={14} color={Colors.textSecondary} />
              <Text style={styles.backText}>Voltar para o login</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  root: { flex: 1, backgroundColor: Colors.background },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 48,
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
  },
  input: { flex: 1, color: Colors.textPrimary, fontSize: 15 },

  // Inputs do código OTP
  codeWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 8,
  },
  codeInput: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "700",
  },
  codeInputFilled: {
    borderColor: Colors.primary,
  },

  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 28,
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 8,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});