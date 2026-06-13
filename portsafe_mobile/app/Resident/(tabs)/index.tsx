import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { api, DeliveryDto } from "@/services/api";

type Tab = "atuais" | "historico";

function isSameDay(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isSameMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (isSameDay(dateStr)) {
    if (diffH < 1) return "Hoje, agora";
    return `Hoje, ${d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
  }
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function ResidentHomeScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("atuais");
  const [deliveries, setDeliveries] = useState<DeliveryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await api.deliveries.getMy();
      setDeliveries(res.data ?? []);
    } catch (e) {
      console.warn("Erro ao buscar entregas:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  useFocusEffect(
    useCallback(() => {
      fetchDeliveries();
    }, [fetchDeliveries])
  );

  const handleWithdraw = async (id: string) => {
    setWithdrawingId(id);
    setConfirmingId(null);
    try {
      await api.deliveries.withdraw(id);
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, status: "Withdrawn", withdrawnAt: new Date().toISOString() }
            : d
        )
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      Alert.alert("Erro na retirada", msg);
    } finally {
      setWithdrawingId(null);
    }
  };

  const activeDeliveries = deliveries.filter((d) => d.status !== "Withdrawn");
  const historyDeliveries = deliveries.filter((d) => d.status === "Withdrawn");

  const todayCount = deliveries.filter((d) => isSameDay(d.createdAt)).length;
  const awaitingCount = activeDeliveries.length;
  const monthCount = deliveries.filter((d) => isSameMonth(d.createdAt)).length;

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
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIconBtn}>
                <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
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
              <Text style={styles.userName}>{user?.name ?? "—"}</Text>
              <Text style={styles.userUnit}>{user?.email ?? ""}</Text>
              <Text style={styles.userCondo}>
                {user?.role === "Morador" ? "Morador" : user?.role ?? ""}
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{"ENTREGAS\nHOJE"}</Text>
              <Text style={styles.statValue}>{todayCount}</Text>
              <Text style={[styles.statNote, { color: "#4CAF50" }]}>esse mês</Text>
            </View>
            <View style={[styles.statCard, styles.statCardHighlight]}>
              <Text style={[styles.statLabel, styles.statLabelHighlight]}>AGUARDANDO</Text>
              <Text style={[styles.statValue, styles.statValueHighlight]}>{awaitingCount}</Text>
              <Text style={[styles.statNote, { color: Colors.textSecondary }]}>Na portaria</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>TOTAL MÊS</Text>
              <Text style={styles.statValue}>{monthCount}</Text>
              <Text style={[styles.statNote, { color: Colors.textSecondary }]}>Recebidas</Text>
            </View>
          </View>

          {/* Tabs */}
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
          </View>

          {loading && (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 32 }} />
          )}

          {/* Lista de entregas ativas */}
          {!loading && activeTab === "atuais" && (
            <View style={styles.deliveryList}>
              {activeDeliveries.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="cube-outline" size={40} color={Colors.textSecondary} />
                  <Text style={styles.emptyStateText}>Nenhuma entrega pendente</Text>
                </View>
              )}
              {activeDeliveries.map((delivery) => (
                <View key={delivery.id} style={styles.deliveryCard}>
                  <View style={styles.deliveryHeader}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>AGUARDANDO RETIRADA</Text>
                    </View>
                    <Text style={styles.deliveryDate}>{formatDate(delivery.createdAt)}</Text>
                  </View>

                  <View style={styles.deliveryInfo}>
                    <View style={styles.deliveryIconWrapper}>
                      <Ionicons name="cube-outline" size={22} color={Colors.primary} />
                    </View>
                    <View style={styles.deliveryText}>
                      <Text style={styles.deliverySender}>{delivery.recipientName}</Text>
                      <Text style={styles.deliveryDescription}>
                        {"Código "}
                        <Text style={styles.deliveryCode}>#{delivery.trackingCode}</Text>
                      </Text>
                    </View>
                  </View>

                  {confirmingId !== delivery.id ? (
                    <TouchableOpacity
                      style={[styles.confirmButton, withdrawingId === delivery.id && { opacity: 0.6 }]}
                      onPress={() => setConfirmingId(delivery.id)}
                      disabled={withdrawingId === delivery.id}
                    >
                      {withdrawingId === delivery.id ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text style={styles.confirmButtonText}>Confirmar Retirada</Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.inlineConfirm}>
                      <Text style={styles.inlineConfirmLabel}>Confirmar retirada?</Text>
                      <View style={styles.inlineConfirmBtns}>
                        <TouchableOpacity
                          style={styles.inlineCancelBtn}
                          onPress={() => setConfirmingId(null)}
                        >
                          <Text style={styles.inlineCancelText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.confirmButton, { flex: 1, marginBottom: 0 }, withdrawingId === delivery.id && { opacity: 0.6 }]}
                          onPress={() => handleWithdraw(delivery.id)}
                          disabled={withdrawingId === delivery.id}
                        >
                          {withdrawingId === delivery.id ? (
                            <ActivityIndicator color="#fff" />
                          ) : (
                            <Text style={styles.confirmButtonText}>Confirmar</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Histórico */}
          {!loading && activeTab === "historico" && (
            <View style={styles.deliveryList}>
              <Text style={styles.historyTitle}>HISTÓRICO DE ENTREGAS</Text>
              {historyDeliveries.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle-outline" size={40} color={Colors.textSecondary} />
                  <Text style={styles.emptyStateText}>Nenhuma entrega retirada</Text>
                </View>
              )}
              {historyDeliveries.map((item) => (
                <View key={item.id} style={styles.deliveryCard}>
                  <View style={styles.deliveryHeader}>
                    <View style={styles.historyBadge}>
                      <Text style={styles.historyBadgeText}>RETIRADO</Text>
                    </View>
                    <Text style={styles.deliveryDate}>
                      {item.withdrawnAt ? formatDate(item.withdrawnAt) : formatDate(item.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.deliveryInfo}>
                    <View style={styles.deliveryIconWrapper}>
                      <Ionicons name="mail-outline" size={22} color={Colors.textSecondary} />
                    </View>
                    <View style={styles.deliveryText}>
                      <Text style={styles.deliverySender}>{item.recipientName}</Text>
                      <Text style={styles.deliveryDescription}>
                        {"Código "}
                        <Text style={styles.deliveryCode}>#{item.trackingCode}</Text>
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

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerLogo: { width: 140, height: 80 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
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
  userName: { fontSize: 17, fontWeight: "800", color: Colors.textPrimary, marginBottom: 2 },
  userUnit: { fontSize: 13, color: Colors.textSecondary, marginBottom: 2 },
  userCondo: { fontSize: 12, fontWeight: "600", color: Colors.primary },

  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 16 },
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
  statValue: { fontSize: 28, fontWeight: "900", color: Colors.textPrimary, lineHeight: 34 },
  statValueHighlight: { color: Colors.primary },
  statNote: { fontSize: 10, fontWeight: "500" },

  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 3,
  },
  tab: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 16 },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 14, fontWeight: "600", color: Colors.textSecondary },
  tabTextActive: { color: "#fff" },

  deliveryList: { paddingHorizontal: 16, gap: 12 },
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
  statusBadgeText: { fontSize: 9, fontWeight: "800", color: "#FFC107", letterSpacing: 0.5 },
  deliveryDate: { fontSize: 12, color: Colors.textSecondary },
  deliveryInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
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
  deliverySender: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary, marginBottom: 2 },
  deliveryDescription: { fontSize: 12, color: Colors.textSecondary },
  deliveryCode: { color: Colors.primary, fontWeight: "600" },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },

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
  historyBadgeText: { fontSize: 9, fontWeight: "800", color: "#4CAF50", letterSpacing: 0.5 },

  emptyState: { alignItems: "center", paddingTop: 48, gap: 12 },
  emptyStateText: { fontSize: 14, color: Colors.textSecondary },

  inlineConfirm: { gap: 8 },
  inlineConfirmLabel: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary, textAlign: "center" },
  inlineConfirmBtns: { flexDirection: "row", gap: 8 },
  inlineCancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  inlineCancelText: { fontSize: 14, fontWeight: "600", color: Colors.textSecondary },
});
