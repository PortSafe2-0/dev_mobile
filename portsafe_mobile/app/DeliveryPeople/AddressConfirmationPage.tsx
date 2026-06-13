import React, { useState } from "react";
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
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "@/services/api";

const TOTAL_STEPS = 4;
const CURRENT_STEP = 2;

export default function RegisterDeliveryStep2Screen() {
  const { recipientName, unitType, cep, deliveryType } = useLocalSearchParams<{
    recipientName: string; unitType: string; cep: string; deliveryType: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isWeb = width > 768;
  const progress = (CURRENT_STEP / TOTAL_STEPS) * 100;

  const handleConfirm = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.deliveries.createAnonymous({ recipientName: recipientName ?? "" });
      router.push({
        pathname: '/DeliveryPeople/DeliveryInstructionsPage',
        params: {
          trackingCode: res.data.trackingCode,
          lockerCode: res.data.lockerCode,
          lockerLocation: res.data.lockerLocation,
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Não foi possível registrar a entrega.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRedigitar = () => { router.back(); };

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
              resizeMode="contain"
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

              {/* Dados Confirmados */}
              <View style={styles.validatedRow}>
                <View style={styles.validatedIcon}>
                  <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />
                </View>
                <Text style={styles.validatedText}>Dados Confirmados!</Text>
              </View>

              <View style={styles.divider} />

              {/* Seção: Dados da Entrega */}
              <Text style={styles.sectionTitle}>DADOS DA ENTREGA</Text>

              {/* Destinatário */}
              <Text style={styles.fieldLabel}>DESTINATÁRIO</Text>
              <Text style={styles.fieldValue}>{recipientName ?? "—"}</Text>

              {/* Tipo de unidade + Tipo de entrega */}
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.fieldLabel}>TIPO DE UNIDADE</Text>
                  <Text style={styles.fieldValue}>{unitType ?? "—"}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.fieldLabel}>TIPO DE ENTREGA</Text>
                  <Text style={[styles.fieldValue, { textTransform: "capitalize" }]}>{deliveryType ?? "—"}</Text>
                </View>
              </View>

              {/* CEP */}
              {!!cep && (
                <View style={styles.addressBox}>
                  <View style={styles.addressIconCol}>
                    <Ionicons name="location" size={18} color={Colors.primary} />
                  </View>
                  <View style={styles.addressTextCol}>
                    <Text style={styles.fieldLabel}>CEP</Text>
                    <Text style={styles.fieldValue}>{cep}</Text>
                  </View>
                </View>
              )}

            </View>

            {!!errorMsg && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color="#FF5252" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {/* Botão Confirmar e Continuar */}
            <TouchableOpacity style={[styles.confirmButton, loading && { opacity: 0.6 }]} onPress={handleConfirm} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Text style={styles.confirmButtonText}>Confirmar e Continuar</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Botão Redigitar Dados */}
            <TouchableOpacity style={styles.redigitarButton} onPress={handleRedigitar} disabled={loading}>
              <Ionicons name="create-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.redigitarText}>Redigitar Dados</Text>
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
  },

  // Validado
  validatedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  validatedIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(76,175,80,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  validatedText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 1,
    marginBottom: 14,
  },

  fieldLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 2,
  },

  row: {
    flexDirection: "row",
    gap: 32,
    marginTop: 12,
    marginBottom: 4,
  },
  rowItem: {
    flexDirection: "column",
  },

  // Caixa de endereço
  addressBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginTop: 14,
  },
  addressIconCol: {
    paddingTop: 2,
  },
  addressTextCol: {
    flex: 1,
    gap: 1,
  },

  // Erro
  errorBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "rgba(255,82,82,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,82,82,0.3)",
    padding: 12,
    width: "100%",
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#FF5252",
    lineHeight: 18,
  },

  // Botão Confirmar
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    width: "100%",
    marginBottom: 12,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Botão Redigitar
  redigitarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    height: 52,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  redigitarText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
});
