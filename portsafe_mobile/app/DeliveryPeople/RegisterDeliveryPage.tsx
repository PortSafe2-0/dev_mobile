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
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type UnitType = "Casa" | "Apartamento" | "Bloco";
type DeliveryType = "padrao" | "perecivel" | "volumosa";

const TOTAL_STEPS = 4;
const CURRENT_STEP = 1;

const UNIT_TYPES: UnitType[] = ["Casa", "Apartamento", "Bloco"];

const DELIVERY_TYPES: { id: DeliveryType; label: string; description: string; color: string }[] = [
  { id: "padrao", label: "Padrão", description: "Encomendas e documentos.", color: "#4CAF50" },
  { id: "perecivel", label: "Perecível", description: "Alimentos refrigerados.", color: "#2196F3" },
  { id: "volumosa", label: "Volumosa", description: "Pacotes grandes.", color: "#FFC107" },
];

export default function RegisterDeliveryStep1Screen() {
  const [recipientName, setRecipientName] = useState("");
  const [unitType, setUnitType] = useState<UnitType>("Casa");
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [cep, setCep] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("padrao");

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const handleConfirm = () => {
    console.log({ recipientName, unitType, cep, deliveryType });
    // router.push("/delivery/step2");
  };

  const progress = (CURRENT_STEP / TOTAL_STEPS) * 100;

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

            {/* Logo + Título */}
            <Image
              source={require("@/assets/images/logoslogan.png")}
              style={styles.logo}
            />

            {/* Barra de progresso */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>PASSO {CURRENT_STEP} DE {TOTAL_STEPS}</Text>
              <Text style={styles.progressPercent}>{progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
            </View>

            {/* Card do formulário */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Registrar Entrega</Text>
              <Text style={styles.cardSubtitle}>Preencha os dados do destinatário</Text>

              {/* Nome do Destinatário */}
              <Text style={styles.label}>Nome do Destinatário / Morador</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: João Silva"
                  placeholderTextColor={Colors.textSecondary}
                  value={recipientName}
                  onChangeText={setRecipientName}
                  autoCapitalize="words"
                />
              </View>

              {/* Tipo de Unidade */}
              <Text style={[styles.label, { marginTop: 16 }]}>Tipo de Unidade</Text>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => setShowUnitDropdown((v) => !v)}
                activeOpacity={0.8}
              >
                <Text style={[styles.input, { color: Colors.textPrimary }]}>{unitType}</Text>
                <Ionicons
                  name={showUnitDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
              {showUnitDropdown && (
                <View style={styles.dropdown}>
                  {UNIT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.dropdownItem,
                        unitType === type && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setUnitType(type);
                        setShowUnitDropdown(false);
                      }}
                    >
                      <Text style={[
                        styles.dropdownItemText,
                        unitType === type && styles.dropdownItemTextActive,
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* CEP */}
              <Text style={[styles.label, { marginTop: 16 }]}>CEP da Casa</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Digite o CEP"
                  placeholderTextColor={Colors.textSecondary}
                  value={cep}
                  onChangeText={setCep}
                  keyboardType="numeric"
                  maxLength={9}
                />
              </View>

              {/* Tipo de Entrega */}
              <Text style={[styles.label, { marginTop: 16 }]}>Tipo de Entrega</Text>
              <View style={styles.deliveryRow}>
                {DELIVERY_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.deliveryOption,
                      deliveryType === type.id && styles.deliveryOptionActive,
                    ]}
                    onPress={() => setDeliveryType(type.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.deliveryDot, { backgroundColor: type.color }]} />
                    <Text style={styles.deliveryLabel}>{type.label}</Text>
                    <Text style={styles.deliveryDescription}>{type.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Botão Confirmar */}
              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                <Text style={styles.confirmButtonText}>Confirmar e Continuar</Text>
              </TouchableOpacity>
            </View>

            {/* Voltar */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={14} color={Colors.textSecondary} />
              <Text style={styles.backText}>Voltar à Página Inicial</Text>
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
    paddingTop: 32,
    paddingBottom: 40,
  },
  scrollWeb: { alignItems: "center" },

  container: { width: "100%", alignItems: "center" },
  containerWeb: { maxWidth: 480 },

  // Logo e título do app
  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 4,
  },
  appNamePort: {
    color: Colors.textPrimary,
  },
  appNameSafe: {
    color: Colors.primary,
  },
  appSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 24,
  },

  // Progresso
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  progressBarBg: {
    width: "100%",
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 20,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "500",
    marginBottom: 8,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 48,
  },
  input: { flex: 1, color: Colors.textPrimary, fontSize: 15 },

  // Dropdown
  dropdown: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 4,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dropdownItemActive: {
    backgroundColor: Colors.surfaceElevated,
  },
  dropdownItemText: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  dropdownItemTextActive: {
    color: Colors.textPrimary,
    fontWeight: "600",
  },

  // Tipo de entrega
  deliveryRow: {
    flexDirection: "row",
    gap: 8,
  },
  deliveryOption: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 6,
  },
  deliveryOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceElevated,
  },
  deliveryDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  deliveryLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  deliveryDescription: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 13,
  },

  // Botão
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Voltar
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