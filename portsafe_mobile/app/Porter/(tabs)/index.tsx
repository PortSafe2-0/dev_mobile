import React, { useEffect, useState, useCallback } from "react";
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
  Alert,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { api, DeliveryDto } from "@/services/api";

function isSameDay(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `Há ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  return `Há ${diffH}h`;
}

function lastDeliveryTime(deliveries: DeliveryDto[]): string {
  const today = deliveries.filter((d) => isSameDay(d.createdAt));
  if (today.length === 0) return "—";
  const latest = today.reduce((a, b) =>
    new Date(a.createdAt) > new Date(b.createdAt) ? a : b
  );
  const d = new Date(latest.createdAt);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function PorterHomeScreen() {
  const [deliveries, setDeliveries] = useState<DeliveryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [notifiedIds, setNotifiedIds] = useState<Set<string>>(new Set());
  const [notifyingId, setNotifyingId] = useState<string | null>(null);

  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await api.deliveries.getAll();
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

  const handleNotify = async (deliveryId: string) => {
    setNotifyingId(deliveryId);
    try {
      await api.deliveries.notify(deliveryId);
      setNotifiedIds((prev) => new Set(prev).add(deliveryId));
    } catch {
      Alert.alert("Erro", "Não foi possível enviar a notificação.");
    } finally {
      setNotifyingId(null);
    }
  };

  const handleWithdraw = async (delivery: DeliveryDto) => {
    setWithdrawingId(delivery.id);
    setConfirmingId(null);
    try {
      await api.deliveries.withdraw(delivery.id);
      setDeliveries((prev) =>
        prev.map((d) =>
          d.id === delivery.id
            ? { ...d, status: "Withdrawn", withdrawnAt: new Date().toISOString() }
            : d
        )
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      Alert.alert("Erro ao dar baixa", msg);
    } finally {
      setWithdrawingId(null);
    }
  };

  const pending = deliveries.filter((d) => d.status !== "Withdrawn");
  const todayCount = deliveries.filter((d) => isSameDay(d.createdAt)).length;
  const pendingCount = pending.length;

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
              <TouchableOpacity style={styles.headerIconBtn} onPress={logout}>
                <Ionicons name="log-out-outline" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Saudação */}
          <View style={styles.greetingBox}>
            <Text style={styles.greetingLabel}>BEM-VINDO DE VOLTA,</Text>
            <Text style={styles.greetingName}>Olá, {user?.name ?? "—"}</Text>
          </View>

          {/* Botão Registro Manual */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push("/Porter/(tabs)/ManualRegistrationPage")}
          >
            <Ionicons name="reader-outline" size={20} color="#fff" />
            <Text style={styles.registerButtonText}>Registro Manual</Text>
          </TouchableOpacity>

          <Text style={styles.sectionLabel}>RESUMO DE HOJE</Text>

          {/* Card grande */}
          <View style={styles.statCardLarge}>
            <View>
              <Text style={styles.statCardLabel}>ENTREGAS HOJE</Text>
              <Text style={styles.statCardValueLarge}>{todayCount}</Text>
            </View>
            <View style={styles.statCardIconBox}>
              <Ionicons name="cube-outline" size={26} color={Colors.accent} />
            </View>
          </View>

          {/* Cards pequenos */}
          <View style={styles.statsRow}>
            <View style={[styles.statCardSmall, { flex: 1 }]}>
              <Text style={styles.statCardLabel}>NA PORTARIA</Text>
              <Text style={styles.statCardValue}>{String(pendingCount).padStart(2, "0")}</Text>
            </View>
            <View style={[styles.statCardSmall, { flex: 1 }]}>
              <Text style={styles.statCardLabel}>ÚLTIMA ENTREGA</Text>
              <Text style={styles.statCardValue}>{lastDeliveryTime(deliveries)}</Text>
            </View>
          </View>

          {/* Pendentes */}
          <View style={styles.pendingHeader}>
            <Text style={styles.sectionLabel}>ENTREGAS PENDENTES</Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pending.length} ITENS</Text>
            </View>
          </View>

          {loading && (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 16 }} />
          )}

          {!loading && (
            <View style={styles.deliveryList}>
              {pending.length === 0 && (
                <View style={styles.emptyState}>
                  <Ionicons name="checkmark-circle-outline" size={40} color={Colors.textSecondary} />
                  <Text style={styles.emptyStateText}>Nenhuma entrega pendente</Text>
                </View>
              )}
              {pending.map((delivery) => (
                <View key={delivery.id} style={styles.deliveryCard}>
                  <View style={styles.deliveryCardHeader}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>AGUARDANDO</Text>
                    </View>
                    <Text style={styles.deliveryTime}>{timeAgo(delivery.createdAt)}</Text>
                  </View>

                  <View style={styles.residentRow}>
                    <View style={styles.avatarCircle}>
                      <Ionicons name="person" size={22} color={Colors.textSecondary} />
                    </View>
                    <View style={styles.residentInfo}>
                      <Text style={styles.residentName}>{delivery.recipientName}</Text>
                      <Text style={styles.residentUnit}>
                        Código #{delivery.trackingCode}
                      </Text>
                      <Text style={styles.residentDescription}>{delivery.status}</Text>
                    </View>
                  </View>

                  {confirmingId !== delivery.id ? (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[
                          styles.notifyButton,
                          notifiedIds.has(delivery.id) && styles.notifyButtonDone,
                          notifyingId === delivery.id && { opacity: 0.6 },
                        ]}
                        onPress={() => handleNotify(delivery.id)}
                        disabled={notifiedIds.has(delivery.id) || notifyingId === delivery.id}
                      >
                        {notifyingId === delivery.id ? (
                          <ActivityIndicator size="small" color={Colors.textPrimary} />
                        ) : notifiedIds.has(delivery.id) ? (
                          <Text style={styles.notifyButtonTextDone}>✓ Notificado</Text>
                        ) : (
                          <Text style={styles.notifyButtonText}>Notificar</Text>
                        )}
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.checkInButton, withdrawingId === delivery.id && { opacity: 0.6 }]}
                        onPress={() => setConfirmingId(delivery.id)}
                        disabled={withdrawingId === delivery.id}
                      >
                        {withdrawingId === delivery.id ? (
                          <ActivityIndicator color="#fff" size="small" />
                        ) : (
                          <Text style={styles.checkInButtonText}>Dar Baixa</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.confirmBox}>
                      <Text style={styles.confirmLabel}>Confirmar retirada?</Text>
                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          style={styles.notifyButton}
                          onPress={() => setConfirmingId(null)}
                        >
                          <Text style={styles.notifyButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.checkInButton, withdrawingId === delivery.id && { opacity: 0.6 }]}
                          onPress={() => handleWithdraw(delivery)}
                          disabled={withdrawingId === delivery.id}
                        >
                          {withdrawingId === delivery.id ? (
                            <ActivityIndicator color="#fff" size="small" />
                          ) : (
                            <Text style={styles.checkInButtonText}>Confirmar</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerLogo: { width: 180, height: 100 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  headerIconBtn: { padding: 6 },

  greetingBox: { paddingHorizontal: 16, marginBottom: 16 },
  greetingLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  greetingName: { fontSize: 24, fontWeight: "900", color: Colors.textPrimary },

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

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
  },

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

  statsRow: { flexDirection: "row", gap: 10, paddingHorizontal: 16, marginBottom: 24 },
  statCardSmall: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 6,
  },
  statCardValue: { fontSize: 28, fontWeight: "900", color: Colors.textPrimary },

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
  statusBadgeText: { fontSize: 9, fontWeight: "800", color: "#FFC107", letterSpacing: 0.5 },
  deliveryTime: { fontSize: 12, color: Colors.textSecondary },

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
  residentName: { fontSize: 16, fontWeight: "800", color: Colors.textPrimary, marginBottom: 2 },
  residentUnit: { fontSize: 13, fontWeight: "600", color: Colors.primary, marginBottom: 2 },
  residentDescription: { fontSize: 12, color: Colors.textSecondary },

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
  notifyButtonDone: {
    borderColor: "#4CAF50",
    backgroundColor: "rgba(76,175,80,0.08)",
  },
  notifyButtonText: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary },
  notifyButtonTextDone: { fontSize: 14, fontWeight: "700", color: "#4CAF50" },
  checkInButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInButtonText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  emptyState: { alignItems: "center", paddingTop: 32, gap: 12 },
  emptyStateText: { fontSize: 14, color: Colors.textSecondary },

  confirmBox: { gap: 8 },
  confirmLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: "600", textAlign: "center" },
});
