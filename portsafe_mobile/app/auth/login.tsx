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
  Image,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type Role = "morador" | "porteiro";

export default function LoginScreen() {
  const [role, setRole] = useState<Role>("morador");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => console.log({ role, email, password });

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView 
        style={styles.root} 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Logo */}
        <Image source={require("@/assets/images/icon_portsafee.png")} style={styles.logo} />

        <ScrollView 
          contentContainerStyle={styles.scroll} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, isWeb && styles.containerWeb]}>
            <Text style={styles.title}>Bem-vindo de volta</Text>
            <Text style={styles.subtitle}>Faça login para ter acesso a sua conta</Text>
            
            <View style={styles.toggleWrapper}>
              <RoleToggle selected={role} onSelect={setRole} />
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Insira aqui seu e-mail"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <Text style={[styles.label, { marginTop: 16 }]}>Senha</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Insira aqui sua senha"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                  <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotWrapper}>
                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Entrar</Text>
              </TouchableOpacity>

              <View style={styles.registerRow}>
                <Text style={styles.registerText}>Não tem uma conta? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                  <Text style={styles.registerLink}>Cadastre-se aqui</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Botão Voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
          <Text style={styles.backText}>VOLTAR A PÁGINA INICIAL</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  root: { flex: 1, backgroundColor: Colors.background },

  logo: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    width: 140,
    height: 140,
    resizeMode: "contain",
    zIndex: 5,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 210,
    paddingBottom: 100,   // reduzido
  },

  container: { width: "100%", alignItems: "center" },
  containerWeb: { maxWidth: 500 },

  title: { fontSize: 26, fontWeight: "800", color: Colors.textPrimary, textAlign: "center", marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: "center", marginBottom: 32 },

  toggleWrapper: { marginBottom: 32, width: "100%" },
  form: { width: "100%" },
  label: { fontSize: 14, color: Colors.textPrimary, marginBottom: 8, fontWeight: "500" },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 48,
  },
  input: { flex: 1, color: Colors.textPrimary, fontSize: 15 },

  forgotWrapper: { marginTop: 12, marginBottom: 24 },
  forgotText: { color: Colors.textSecondary, fontSize: 14 },

  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  registerRow: { flexDirection: "row", justifyContent: "center" },
  registerText: { color: Colors.textSecondary, fontSize: 14 },
  registerLink: { color: Colors.accent, fontSize: 14, fontWeight: "600" },

  backButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 50,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "600",
  },
});