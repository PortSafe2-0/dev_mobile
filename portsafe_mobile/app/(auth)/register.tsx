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

  // Campos comuns
  const [condominio, setCondominio] = useState("");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Campos exclusivos de Morador
  const [bloco, setBloco] = useState("");
  const [apto, setApto] = useState("");

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const isMorador = role === "morador";

  const handleRegister = () => {
    // TODO: integrar com serviço de autenticação
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
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("@/assets/images/icon_portsafee.png")}
          style={{
            position: "absolute",
            top: isWeb ? -20 : 0,
            left: "50%",
            transform: [{ translateX: -(isWeb ? 100 : 80) }],
            width: isWeb ? 200 : 160,
            height: isWeb ? 200 : 160,
            resizeMode: "contain",
            opacity: 0.8,
            zIndex: 0,
          }}
        />

        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

        <ScrollView
          contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, isWeb && styles.containerWeb]}>
            {/* Header */}
            <Text style={styles.title}>Criar Nova Conta</Text>
            <Text style={styles.subtitle}>
              Escolha seu tipo de usuário e complete o cadastro
            </Text>

            {/* Toggle Morador / Porteiro */}
            <View style={styles.toggleWrapper}>
              <RoleToggle selected={role} onSelect={setRole} />
            </View>

            {/* Form */}
            <View style={styles.form}>

              {/* Condomínio */}
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

              {/* Tipo de Residência — apenas Morador */}
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
                      <Text
                        style={[
                          styles.residenceOptionText,
                          residenceType === "apartamento" && styles.residenceOptionTextActive,
                        ]}
                      >
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
                      <Text
                        style={[
                          styles.residenceOptionText,
                          residenceType === "casa" && styles.residenceOptionTextActive,
                        ]}
                      >
                        CASA
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Nome Completo */}
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

              {/* E-mail */}
              <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  placeholderTextColor={Colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Senha */}
              <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Senha"
                  placeholderTextColor={Colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Confirmar Senha */}
              <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Confirmar Senha"
                  placeholderTextColor={Colors.textSecondary}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Telefone + CPF */}
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

              {/* Bloco + Apto — apenas Morador */}
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
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Apto"
                      placeholderTextColor={Colors.textSecondary}
                      value={apto}
                      onChangeText={setApto}
                      keyboardType="numeric"
                    />
                    <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
                  </View>
                </View>
              )}

              {/* CTA */}
              <TouchableOpacity
                style={[styles.registerButton, { marginTop: 28 }]}
                onPress={handleRegister}
                activeOpacity={0.85}
              >
                <Text style={styles.registerButtonText}>Cadastrar</Text>
              </TouchableOpacity>

              {/* Login */}
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                  <Text style={styles.loginLink}>Faça login aqui!</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Back */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
          <Text style={styles.backText}>VOLTAR A PÁGINA INICIAL</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 160,
    paddingBottom: 100,
    zIndex: 1,
  },
  scrollWeb: {
    alignItems: "center",
    paddingTop: 150,
  },
  container: {
    width: "100%",
  },
  containerWeb: {
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
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
    marginBottom: 32,
  },
  toggleWrapper: {
    marginBottom: 32,
  },
  form: {
    gap: 0,
  },
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
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
  },
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
    letterSpacing: 0.5,
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
    marginBottom: 28,
  },
  registerButtonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
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
  },
  backText: {
    color: Colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: "600",
  },
});