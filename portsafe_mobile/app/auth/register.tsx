import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Modal,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

type Role = "morador" | "porteiro";
type ResidenceType = "apartamento" | "casa";

const CONDOMINIOS_FALLBACK = [
  "Residencial Porto Seguro",
  "Condomínio Solar das Flores",
  "Edifício Vila Nova",
  "Condomínio Jardim das Acácias",
  "Residencial Bella Vista",
  "Condomínio Park Avenue",
  "Edifício Horizonte Azul",
  "Residencial Green Park",
];

export default function RegisterScreen() {
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const [role, setRole] = useState<Role>(roleParam === "porteiro" ? "porteiro" : "morador");
  const [residenceType, setResidenceType] = useState<ResidenceType>("apartamento");

  const [condominio, setCondominio] = useState("");
  const [condominioModalVisible, setCondominioModalVisible] = useState(false);
  const [condominios, setCondominios] = useState<string[]>(CONDOMINIOS_FALLBACK);

  useEffect(() => {
    api.condominios.getAll()
      .then((res) => { if (res.data?.length) setCondominios(res.data); })
      .catch(() => {}); // usa fallback se API falhar
  }, []);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");

  // Morador - Apartamento
  const [bloco, setBloco] = useState("");
  const [apto, setApto] = useState("");

  // Morador - Casa
  const [rua, setRua] = useState("");
  const [numeroCasa, setNumeroCasa] = useState("");
  const [cep, setCep] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const isMorador = role === "morador";
  const isPorteiro = role === "porteiro";
  const isApartamento = residenceType === "apartamento";

  const handleRegister = async () => {
    if (!nomeCompleto.trim() || !email.trim() || !password) {
      setError("Preencha nome, e-mail e senha");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não conferem");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await register(nomeCompleto.trim(), email.trim(), password, {
        role,
        phone: telefone.trim() || undefined,
        document: cpf.trim() || undefined,
        block: bloco.trim() || undefined,
        unitNumber: apto.trim() || undefined,
        street: rua.trim() || undefined,
        houseNumber: numeroCasa.trim() || undefined,
        zipCode: cep.trim() || undefined,
      });
      if (role === "morador") {
        router.replace("/Resident/(tabs)");
      } else {
        router.replace("/Porter/(tabs)");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao cadastrar";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo — dentro do scroll para não sobrepor conteúdo */}
          <Image
            source={require("@/assets/images/icon_portsafee.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={[styles.container, isWeb && styles.containerWeb]}>
            <Text style={styles.title}>Criar Nova Conta</Text>
            <Text style={styles.subtitle}>
              Escolha seu tipo de usuário e complete o cadastro
            </Text>

            <View style={styles.toggleWrapper}>
              <RoleToggle selected={role} onSelect={setRole} />
            </View>

            <View style={styles.form}>

              {/* Condomínio — todos os roles */}
              <Text style={styles.label}>Condomínio</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setCondominioModalVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={[styles.input, { flex: 1, lineHeight: 48 }, !condominio && { color: Colors.textSecondary }]}>
                  {condominio || "Selecione o condomínio"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>

              {/* Modal de seleção de condomínio */}
              <Modal
                visible={condominioModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setCondominioModalVisible(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setCondominioModalVisible(false)}
                >
                  <View style={styles.modalBox}>
                    <Text style={styles.modalTitle}>Selecione o Condomínio</Text>
                    <FlatList
                      data={condominios}
                      keyExtractor={(item) => item}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[styles.modalOption, condominio === item && styles.modalOptionSelected]}
                          onPress={() => { setCondominio(item); setCondominioModalVisible(false); }}
                        >
                          <Text style={[styles.modalOptionText, condominio === item && styles.modalOptionTextSelected]}>
                            {item}
                          </Text>
                          {condominio === item && (
                            <Ionicons name="checkmark" size={18} color={Colors.primary} />
                          )}
                        </TouchableOpacity>
                      )}
                      ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>

              {/* Tipo de Residência — apenas Morador */}
              {isMorador && (
                <>
                  <Text style={[styles.label, { marginTop: 16 }]}>Tipo de Residência</Text>
                  <View style={styles.residenceToggle}>
                    <TouchableOpacity
                      style={[
                        styles.residenceOption,
                        isApartamento && styles.residenceOptionActive,
                      ]}
                      onPress={() => setResidenceType("apartamento")}
                    >
                      <Text style={[
                        styles.residenceOptionText,
                        isApartamento && styles.residenceOptionTextActive,
                      ]}>
                        APARTAMENTO
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.residenceOption,
                        !isApartamento && styles.residenceOptionActive,
                      ]}
                      onPress={() => setResidenceType("casa")}
                    >
                      <Text style={[
                        styles.residenceOptionText,
                        !isApartamento && styles.residenceOptionTextActive,
                      ]}>
                        CASA
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Nome Completo — todos os roles */}
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

              {/* E-mail — todos os roles */}
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

              {/* Telefone — todos os roles (porteiro: aparece antes da senha) */}
              {isPorteiro && (
                <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor={Colors.textSecondary}
                    value={telefone}
                    onChangeText={setTelefone}
                    keyboardType="phone-pad"
                  />
                </View>
              )}

              {/* Senha — todos os roles */}
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

              {/* Confirmar Senha — todos os roles */}
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

              {/* Telefone + CPF — apenas Morador */}
              {isMorador && (
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
              )}

              {/* Campos específicos de Apartamento */}
              {isMorador && isApartamento && (
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

              {/* Campos específicos de Casa */}
              {isMorador && !isApartamento && (
                <>
                  <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Rua"
                      placeholderTextColor={Colors.textSecondary}
                      value={rua}
                      onChangeText={setRua}
                      autoCapitalize="words"
                    />
                  </View>
                  <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="Número da Casa"
                      placeholderTextColor={Colors.textSecondary}
                      value={numeroCasa}
                      onChangeText={setNumeroCasa}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={[styles.inputWrapper, { marginTop: 12 }]}>
                    <TextInput
                      style={styles.input}
                      placeholder="CEP"
                      placeholderTextColor={Colors.textSecondary}
                      value={cep}
                      onChangeText={setCep}
                      keyboardType="numeric"
                    />
                  </View>
                </>
              )}

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <TouchableOpacity
                style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.registerButtonText}>Cadastrar</Text>
                )}
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Já tem uma conta? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                  <Text style={styles.loginLink} >Faça login aqui!</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Botão Voltar — dentro do scroll para não sobrepor conteúdo */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
              <Text style={styles.backText}>VOLTAR A PÁGINA INICIAL</Text>
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

  // Logo dentro do scroll — sem position absolute
  logo: {
    width: 160,
    height: 160,
    alignSelf: "center",
    marginTop: 40,
    marginBottom: 24,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
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
  registerButtonDisabled: { opacity: 0.6 },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  errorText: {
    color: "#FF5252",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 4,
  },
  loginText: { color: Colors.textSecondary, fontSize: 14 },
  loginLink: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: "600",
  },

  // Modal de seleção
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
    maxHeight: 420,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalOptionSelected: {
    backgroundColor: "rgba(33,150,243,0.08)",
  },
  modalOptionText: {
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
  },
  modalOptionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  modalSeparator: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },

  // Botão Voltar dentro do scroll — sem position absolute
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 24,
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