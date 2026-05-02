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
type ResidenceType = "apartamento" | "casa";

export default function RegisterScreen() {
  const [role, setRole] = useState<Role>("morador");
  const [residenceType, setResidenceType] = useState<ResidenceType>("apartamento");

  const [condominio, setCondominio] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [bloco, setBloco] = useState("");
  const [apto, setApto] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const isMorador = role === "morador";

  const handleRegister = () => {
    console.log({
      role,
      residenceType,
      condominio,
      nomeCompleto,
      email,
      password,
      confirmPassword,
      telefone,
      cpf,
      ...(isMorador && { bloco, apto }),
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Logo */}
        <Image
          source={require("@/assets/images/icon_portsafee.png")}
          style={styles.logo}
        />

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, isWeb && styles.containerWeb]}>
            <Text style={styles.title}>Criar Nova Conta</Text>
            <Text style={styles.subtitle}>
              Escolha seu tipo de usuário e complete o cadastro
            </Text>

            <View style={styles.toggleWrapper}>
              <RoleToggle selected={role} onSelect={setRole} />
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Condomínio</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Selecione o condomínio"
                  placeholderTextColor={Colors.textSecondary}
                  value={condominio}
                  onChangeText={setCondominio}
                  autoCapitalize="words"
                />
                <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
              </View>

              {isMorador && (
                <>
                  <Text style={[styles.label, { marginTop: 16 }]}>Tipo de Residência</Text>
                  <View style={styles.residenceToggle}>
                    <TouchableOpacity
                      style={[
                        styles.residenceOption,
                        residenceType === "apartamento" && styles.residenceOptionActive,
                      ]}
                      onPress={() => setResidenceType("apartamento")}
                    >
                      <Text style={[
                        styles.residenceOptionText,
                        residenceType === "apartamento" && styles.residenceOptionTextActive,
                      ]}>
                        APARTAMENTO
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.residenceOption,
                        residenceType === "casa" && styles.residenceOptionActive,
                      ]}
                      onPress={() => setResidenceType("casa")}
                    >
                      <Text style={[
                        styles.residenceOptionText,
                        residenceType === "casa" && styles.residenceOptionTextActive,
                      ]}>
                        CASA
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              <View style={[styles.inputWrapper, { marginTop: 16 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome Completo"
                  placeholderTextColor={Colors.textSecondary}
                  value={nomeCompleto}
                  onChangeText={setNomeCompleto}
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Senha"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirmar Senha"
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

              <View style={[styles.row, { marginTop: 12 }]}>
                <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor={Colors.textSecondary}
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                  />
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="CPF"
                    placeholderTextColor={Colors.textSecondary}
                    value={cpf}
                    onChangeText={setCpf}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {isMorador && (
                <View style={[styles.row, { marginTop: 12 }]}>
                  <View style={[styles.inputWrapper, { flex: 1, marginRight: 8 }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Bloco"
                      placeholderTextColor={Colors.textSecondary}
                      value={bloco}
                      onChangeText={setBloco}
                      autoCapitalize="characters"
                    />
                  </View>
                  <View style={[styles.inputWrapper, { flex: 1 }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Apto"
                      placeholderTextColor={Colors.textSecondary}
                      value={apto}
                      onChangeText={setApto}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.registerButtonText}>Cadastrar</Text>
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.loginLink}>Faça login aqui!</Text>
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
    top: 40,
    alignSelf: "center",
    width: 160,
    height: 160,
    resizeMode: "contain",
    zIndex: 5,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 200,     // espaço para a logo
    paddingBottom: 140,  // espaço para o botão voltar
  },

  container: { width: "100%" },
  containerWeb: { maxWidth: 500, alignSelf: "center" },

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
    marginBottom: 32,
  },

  toggleWrapper: { marginBottom: 32 },
  form: { width: "100%" },

  label: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 8,
    fontWeight: "500",
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
  },
  input: { flex: 1, color: Colors.textPrimary, fontSize: 15 },

  row: { flexDirection: "row" },

  residenceToggle: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    height: 44,
  },
  residenceOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  residenceOptionActive: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    margin: 3,
  },
  residenceOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  residenceOptionTextActive: {
    color: Colors.textPrimary,
  },

  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    marginBottom: 28,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
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

  backButton: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    zIndex: 30,
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