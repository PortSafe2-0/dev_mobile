import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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

const TOTAL_STEPS = 4;
const CURRENT_STEP = 3;
const LOCKER_NUMBER = "015";
const INITIAL_SECONDS = 4 * 60 + 48; // 4:48

const INSTRUCTIONS = [
  `Localize o armário ${LOCKER_NUMBER}`,
  "Abra a porta (já está destravada)",
  "Coloque a encomenda dentro",
  "Feche a porta completamente",
  'Clique em "Confirmar Depósito"',
];

export default function RegisterDeliveryStep3Screen() {
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);

  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const progress = (CURRENT_STEP / TOTAL_STEPS) * 100;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerDisplay = `${minutes}:${String(seconds).padStart(2, "0")}`;

  const handleConfirm = () => {
    // router.push("/delivery/step4");
    console.log("Depósito confirmado");
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

            {/* Card principal */}
            <View style={styles.card}>

              {/* Título */}
              <Text style={styles.cardTitle}>Armário Liberado!</Text>
              <Text style={styles.cardSubtitle}>Deposite a encomenda agora</Text>

              {/* Número do armário */}
              <Text style={styles.lockerSectionLabel}>ARMÁRIO DESTRAVADO</Text>
              <Text style={styles.lockerNumber}>{LOCKER_NUMBER}</Text>

              {/* Status badge */}
              <View style={styles.statusBadge}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>ABERTO · AGUARDANDO DEPÓSITO</Text>
              </View>

              {/* Timer */}
              <View style={styles.timerBox}>
                <View style={styles.timerLabelRow}>
                  <Ionicons name="time-outline" size={14} color="#FFC107" />
                  <Text style={styles.timerLabel}>TEMPO RESTANTE PARA DEPÓSITO</Text>
                </View>
                <Text style={[styles.timerValue, secondsLeft < 60 && styles.timerValueUrgent]}>
                  {timerDisplay}
                </Text>
              </View>

              {/* Instruções */}
              <Text style={styles.instructionsLabel}>INSTRUÇÕES:</Text>
              <View style={styles.instructionsList}>
                {INSTRUCTIONS.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>

              {/* Nota de foto automática */}
              <View style={styles.noteBox}>
                <Ionicons name="information-circle-outline" size={16} color={Colors.primary} style={{ marginTop: 1 }} />
                <Text style={styles.noteText}>
                  <Text style={styles.noteBold}>Foto automática: </Text>
                  Uma foto será tirada assim que você fechar a porta do armário para registro de segurança.
                </Text>
              </View>

            </View>

            {/* Botão Confirmar Depósito */}
            <TouchableOpacity style={styles.confirmButton} onPress={() => router.push("/DeliveryPeople/RegistrationDeliveryPage")}>
              <Text style={styles.confirmButtonText}>Confirmar Depósito</Text>
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

  // Logo
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
  appNamePort: { color: Colors.textPrimary },
  appNameSafe: { color: Colors.primary },
  appSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    letterSpacing: 1,
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
    color: "#FFC107",
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
    marginBottom: 16,
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 22,
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

  // Armário
  lockerSectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  lockerNumber: {
    fontSize: 72,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: 4,
    lineHeight: 80,
  },

  // Status badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(76,175,80,0.12)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.3)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4CAF50",
    letterSpacing: 0.5,
  },

  // Timer
  timerBox: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  timerLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  timerLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFC107",
    letterSpacing: 0.8,
  },
  timerValue: {
    fontSize: 40,
    fontWeight: "900",
    color: "#FFC107",
    letterSpacing: 2,
  },
  timerValueUrgent: {
    color: "#F44336",
  },

  // Instruções
  instructionsLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1.5,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  instructionsList: {
    width: "100%",
    gap: 10,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  instructionNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
    flexShrink: 0,
  },
  instructionNumberText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },

  // Nota
  noteBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(33,150,243,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    width: "100%",
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },
  noteBold: {
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  // Botão
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});