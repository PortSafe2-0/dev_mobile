import React, { useState } from "react";
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
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

type Tab = "atuais" | "historico";

const STATS = [
  {
    id: "hoje",
    label: "ENTREGAS\nHOJE",
    value: "23",
    highlight: false,
    note: "+ 1 desde ontem",
    noteColor: "#4CAF50",
  },
  {
    id: "aguardando",
    label: "AGUARDANDO",
    value: "5",
    highlight: true,
    note: "Na portaria",
    noteColor: Colors.textSecondary,
  },
  {
    id: "total",
    label: "TOTAL MÊS",
    value: "15",
    highlight: false,
    note: "Entregas rece...",
    noteColor: Colors.textSecondary,
  },
];

const HISTORY = [
  {
    id: 1,
    date: "Ontem, 14:30",
    sender: "Correios",
    description: "Encomenda",
    retiradoEm: "Ontem 14:30",
    icon: "cube-outline",
  },
  {
    id: 2,
    date: "20 Out, 11:15",
    sender: "Shopee",
    description: "Pacote",
    retiradoEm: "20/10 às 11:15",
    icon: "mail-outline",
  },
  {
    id: 3,
    date: "18 Out, 09:40",
    sender: "Magalu",
    description: "Caixa Grande",
    retiradoEm: "18/10 às 09:40",
    icon: "cube-outline",
  },
];

const DELIVERIES = [
  {
    id: 1,
    status: "AGUARDANDO RETIRADA",
    date: "Hoje, 10:45",
    sender: "Amazon Brasil",
    description: "Pacote Médio",
    code: "#4429",
    icon: "cube-outline",
  },
  {
    id: 2,
    status: "AGUARDANDO RETIRADA",
    date: "Ontem, 16:20",
    sender: "Mercado Livre",
    description: "Envelope",
    code: "#1288",
    icon: "mail-outline",
  },
];

export default function ResidentHomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("atuais");
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
              <Image
                source={require("@/assets/images/horiz_icon.png")}
                style={styles.headerLogo}
              />
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={18} color={Colors.textPrimary} />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card do usuário */}
          <View style={styles.userCard}>
            <View style={styles.userIconWrapper}>
              <Ionicons name="business-outline" size={24} color={Colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>João Silva</Text>
              <Text style={styles.userUnit}>Bloco A - Apt. 1205</Text>
              <Text style={styles.userCondo}>Condomínio Residencial Jardins</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {STATS.map((stat) => (
              <View
                key={stat.id}
                style={[styles.statCard, stat.highlight && styles.statCardHighlight]}
              >
                <Text style={[styles.statLabel, stat.highlight && styles.statLabelHighlight]}>
                  {stat.label}
                </Text>
                <Text style={[styles.statValue, stat.highlight && styles.statValueHighlight]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statNote, { color: stat.noteColor }]}>
                  {stat.note}
                </Text>
              </View>
            ))}
          </View>

          {/* Tabs + busca */}
          <View style={styles.tabsRow}>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === "atuais" && styles.tabActive]}
                onPress={() => setActiveTab("atuais")}
              >
                <Text style={[styles.tabText, activeTab === "atuais" && styles.tabTextActive]}>
                  Atuais
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === "historico" && styles.tabActive]}
                onPress={() => setActiveTab("historico")}
              >
                <Text style={[styles.tabText, activeTab === "historico" && styles.tabTextActive]}>
                  Histórico
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.searchBtn}>
              <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Lista de entregas */}
          {activeTab === "atuais" && (
            <View style={styles.deliveryList}>
              {DELIVERIES.map((delivery) => (
                <View key={delivery.id} style={styles.deliveryCard}>
                  {/* Status + data */}
                  <View style={styles.deliveryHeader}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>{delivery.status}</Text>
                    </View>
                    <Text style={styles.deliveryDate}>{delivery.date}</Text>
                  </View>

                  {/* Info */}
                  <View style={styles.deliveryInfo}>
                    <View style={styles.deliveryIconWrapper}>
                      <Ionicons name={delivery.icon as any} size={22} color={Colors.primary} />
                    </View>
                    <View style={styles.deliveryText}>
                      <Text style={styles.deliverySender}>{delivery.sender}</Text>
                      <Text style={styles.deliveryDescription}>
                        {delivery.description}
                        {" • "}
                        <Text style={styles.deliveryCode}>Código {delivery.code}</Text>
                      </Text>
                    </View>
                  </View>

                  {/* Botão */}
                  <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Confirmar Retirada</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {activeTab === "historico" && (
            <View style={styles.deliveryList}>
              <Text style={styles.historyTitle}>HISTÓRICO DE ENTREGAS</Text>
              {HISTORY.map((item) => (
                <View key={item.id} style={styles.deliveryCard}>
                  <View style={styles.deliveryHeader}>
                    <View style={styles.historyBadge}>
                      <Text style={styles.historyBadgeText}>RETIRADO</Text>
                    </View>
                    <Text style={styles.deliveryDate}>{item.date}</Text>
                  </View>
                  <View style={styles.deliveryInfo}>
                    <View style={styles.deliveryIconWrapper}>
                      <Ionicons name={item.icon as any} size={22} color={Colors.textSecondary} />
                    </View>
                    <View style={styles.deliveryText}>
                      <Text style={styles.deliverySender}>{item.sender}</Text>
                      <Text style={styles.deliveryDescription}>
                        {item.description}
                        {" • "}
                        Retirado em {item.retiradoEm}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogo: {
    width: 140,
    height: 80,
    resizeMode: "contain",
  },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  headerTitlePort: { color: Colors.textPrimary },
  headerTitleSafe: { color: Colors.primary },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerIconBtn: { padding: 4 },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  // Card usuário
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginHorizontal: 16,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    marginBottom: 14,
  },
  userIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(33,150,243,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.2)",
  },
  userInfo: { flex: 1 },
  userName: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  userUnit: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  userCondo: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.primary,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    gap: 4,
  },
  statCardHighlight: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(33,150,243,0.08)",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 0.4,
    lineHeight: 13,
  },
  statLabelHighlight: { color: Colors.primary },
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.textPrimary,
    lineHeight: 34,
  },
  statValueHighlight: { color: Colors.primary },
  statNote: { fontSize: 10, fontWeight: "500" },

  // Tabs
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 3,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 16,
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  tabTextActive: { color: "#fff" },
  searchBtn: { marginLeft: "auto", padding: 6 },

  // Entregas
  deliveryList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  deliveryCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
  },
  deliveryHeader: {
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
  deliveryDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  deliveryIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(33,150,243,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.2)",
  },
  deliveryText: { flex: 1 },
  deliverySender: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  deliveryDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  deliveryCode: {
    color: Colors.primary,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  // History
  historyTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  historyBadge: {
    backgroundColor: "rgba(76,175,80,0.12)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(76,175,80,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  historyBadgeText: {
    fontSize: 9,
    fontWeight: "800",
    color: "#4CAF50",
    letterSpacing: 0.5,
  },

  // Empty
  emptyState: {
    alignItems: "center",
    paddingTop: 48,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});