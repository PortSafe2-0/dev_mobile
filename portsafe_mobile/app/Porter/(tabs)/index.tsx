import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const PENDING_DELIVERIES = [
  {
    id: 1,
    status: "AGUARDANDO",
    time: "Há 2h",
    name: "Mateus Almeida",
    unit: "Bloco B - Apt 1205",
    description: "Pacote Amazon",
  },
  {
    id: 2,
    status: "AGUARDANDO",
    time: "Agora",
    name: "Ana Clara",
    unit: "Bloco A - Apt 402",
    description: "iFood Entrega",
  },
  {
    id: 3,
    status: "AGUARDANDO",
    time: "Há 45min",
    name: "Ricardo Santos",
    unit: "Bloco C - Apt 104",
    description: "Mercado Livre",
  },
];

export default function PorterHomeScreen() {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isWeb && styles.containerWeb]}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerLogoBox}>
                <Image
                  source={require("@/assets/images/icon_portsafee.png")}
                  style={styles.headerLogo}
                />
              </View>
              <Text style={styles.headerBrand}>PortSafe</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="menu-outline" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Saudação */}
          <View style={styles.greetingBox}>
            <Text style={styles.greetingLabel}>BEM-VINDO DE VOLTA,</Text>
            <Text style={styles.greetingName}>Olá, Carlos Ferreira</Text>
          </View>

          {/* Botão Registro Manual */}
          <TouchableOpacity style={styles.registerButton} onPress={() => router.push("/Porter/(tabs)/ManualRegistrationPage")}>
            <Ionicons name="reader-outline" size={20} color="#fff" />
            <Text style={styles.registerButtonText}>Registro Manual</Text>
          </TouchableOpacity>

          {/* Resumo de Hoje */}
          <Text style={styles.sectionLabel}>RESUMO DE HOJE</Text>

          {/* Card grande — Entregas Hoje */}
          <View style={styles.statCardLarge}>
            <View>
              <Text style={styles.statCardLabel}>ENTREGAS HOJE</Text>
              <Text style={styles.statCardValueLarge}>24</Text>
            </View>
            <View style={styles.statCardIconBox}>
              <Ionicons name="cube-outline" size={26} color={Colors.accent} />
            </View>
          </View>

          {/* Cards pequenos */}
          <View style={styles.statsRow}>
            <View style={[styles.statCardSmall, { flex: 1 }]}>
              <Text style={styles.statCardLabel}>NA PORTARIA</Text>
              <Text style={styles.statCardValue}>08</Text>
            </View>
            <View style={[styles.statCardSmall, { flex: 1 }]}>
              <Text style={styles.statCardLabel}>ÚLTIMA ENTREGA</Text>
              <Text style={styles.statCardValue}>14:25</Text>
            </View>
          </View>

          {/* Entregas Pendentes */}
          <View style={styles.pendingHeader}>
            <Text style={styles.sectionLabel}>ENTREGAS PENDENTES</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{PENDING_DELIVERIES.length} ITENS</Text>
            </View>
          </View>

          <View style={styles.deliveryList}>
            {PENDING_DELIVERIES.map((delivery) => (
              <View key={delivery.id} style={styles.deliveryCard}>

                {/* Status + tempo */}
                <View style={styles.deliveryCardHeader}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{delivery.status}</Text>
                  </View>
                  <Text style={styles.deliveryTime}>{delivery.time}</Text>
                </View>

                {/* Morador */}
                <View style={styles.residentRow}>
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={22} color={Colors.textSecondary} />
                  </View>
                  <View style={styles.residentInfo}>
                    <Text style={styles.residentName}>{delivery.name}</Text>
                    <Text style={styles.residentUnit}>{delivery.unit}</Text>
                    <Text style={styles.residentDescription}>{delivery.description}</Text>
                  </View>
                </View>

                {/* Ações */}
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.notifyButton}>
                    <Text style={styles.notifyButtonText}>Notificar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.checkInButton}>
                    <Text style={styles.checkInButtonText}>Dar Baixa</Text>
                  </TouchableOpacity>
                </View>

              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingBottom: 32 },
  scrollWeb: { alignItems: "center" },
  container: { width: "100%" },
  containerWeb: { maxWidth: 480 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogoBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerLogo: { width: 28, height: 28, resizeMode: "contain" },
  headerBrand: { fontSize: 20, fontWeight: "800", color: Colors.textPrimary },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerIconBtn: { padding: 6 },

  // Saudação
  greetingBox: { paddingHorizontal: 16, marginBottom: 16 },
  greetingLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  greetingName: { fontSize: 24, fontWeight: "900", color: Colors.textPrimary },

  // Registro Manual
  registerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.accent,
    marginHorizontal: 16,
    borderRadius: 14,
    height: 54,
    marginBottom: 24,
  },
  registerButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  // Labels de seção
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  // Card grande
  statCardLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 10,
  },
  statCardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statCardValueLarge: { fontSize: 36, fontWeight: "900", color: Colors.textPrimary },
  statCardIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,152,0,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,152,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Cards pequenos
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCardSmall: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 6,
  },
  statCardValue: { fontSize: 28, fontWeight: "900", color: Colors.textPrimary },

  // Pendentes header
  pendingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 16,
    marginBottom: 10,
  },
  pendingBadge: {
    backgroundColor: "rgba(33,150,243,0.12)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.primary,
    letterSpacing: 0.5,
  },

  // Lista
  deliveryList: { paddingHorizontal: 16, gap: 12 },
  deliveryCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
  },
  deliveryCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    backgroundColor: "rgba(255,193,7,0.12)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,193,7,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#FFC107",
    letterSpacing: 0.5,
  },
  deliveryTime: { fontSize: 12, color: Colors.textSecondary },

  // Morador
  residentRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  residentInfo: { flex: 1 },
  residentName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  residentUnit: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 2,
  },
  residentDescription: { fontSize: 12, color: Colors.textSecondary },

  // Ações
  actionRow: { flexDirection: "row", gap: 10 },
  notifyButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  notifyButtonText: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
  checkInButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});