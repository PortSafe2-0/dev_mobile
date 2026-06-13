import React, { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, DeliveryDto } from "@/services/api";

type Filter = "todas" | "aguardando" | "retiradas";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Agora";
  if (diffMin < 60) return `Há ${diffMin}min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Há ${diffH}h`;
  return `Há ${Math.floor(diffH / 24)}d`;
}

export default function PorterEntregasScreen() {
  const [deliveries, setDeliveries] = useState<DeliveryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("todas");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.deliveries.getAll();
      setDeliveries(res.data ?? []);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar as entregas.");
    } finally {
      setLoading(false);
      setRefreshing(false);
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
      Alert.alert("Erro ao dar baixa", msg);
    } finally {
      setWithdrawingId(null);
    }
  };

  const filtered = deliveries.filter((d) => {
    if (filter === "aguardando") return d.status !== "Withdrawn";
    if (filter === "retiradas") return d.status === "Withdrawn";
    return true;
  });

  const pendingCount = deliveries.filter((d) => d.status !== "Withdrawn").length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchDeliveries(true)}
            tintColor={Colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Entregas</Text>
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount} pendentes</Text>
            </View>
          )}
        </View>

        <View style={styles.filtersRow}>
          {(["todas", "aguardando", "retiradas"] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.countLabel}>
          {filtered.length} {filtered.length === 1 ? "entrega" : "entregas"}
        </Text>

        {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 48 }} />}

        {!loading && (
          <View style={styles.list}>
            {filtered.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>Nenhuma entrega encontrada</Text>
              </View>
            )}

            {filtered.map((d) => {
              const isPending = d.status !== "Withdrawn";
              return (
                <View key={d.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[
                      styles.statusBadge,
                      isPending
                        ? { backgroundColor: "rgba(255,193,7,0.12)", borderColor: "rgba(255,193,7,0.3)" }
                        : { backgroundColor: "rgba(76,175,80,0.12)", borderColor: "rgba(76,175,80,0.3)" }
                    ]}>
                      <Text style={[styles.statusText, { color: isPending ? "#FFC107" : "#4CAF50" }]}>
                        {isPending ? "AGUARDANDO" : "RETIRADO"}
                      </Text>
                    </View>
                    <Text style={styles.timeAgo}>{timeAgo(d.createdAt)}</Text>
                  </View>

                  <View style={styles.cardBody}>
                    <View style={[styles.iconBox, { backgroundColor: isPending ? "rgba(255,193,7,0.1)" : "rgba(76,175,80,0.1)" }]}>
                      <Ionicons
                        name={isPending ? "cube-outline" : "checkmark-circle-outline"}
                        size={22}
                        color={isPending ? "#FFC107" : "#4CAF50"}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.recipientName}>{d.recipientName}</Text>
                      <Text style={styles.trackingCode}>
                        Código: <Text style={styles.trackingValue}>#{d.trackingCode}</Text>
                      </Text>
                      <Text style={styles.dateText}>{formatDate(d.createdAt)}</Text>
                    </View>
                  </View>

                  {isPending && confirmingId !== d.id && (
                    <TouchableOpacity
                      style={[styles.withdrawBtn, withdrawingId === d.id && { opacity: 0.6 }]}
                      onPress={() => setConfirmingId(d.id)}
                      disabled={withdrawingId === d.id}
                    >
                      {withdrawingId === d.id ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Ionicons name="checkmark-outline" size={16} color="#fff" />
                          <Text style={styles.withdrawBtnText}>Dar Baixa</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}

                  {isPending && confirmingId === d.id && (
                    <View style={styles.confirmRow}>
                      <Text style={styles.confirmText}>Confirmar retirada?</Text>
                      <View style={styles.confirmBtns}>
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          onPress={() => setConfirmingId(null)}
                        >
                          <Text style={styles.cancelBtnText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.confirmBtn, withdrawingId === d.id && { opacity: 0.6 }]}
                          onPress={() => handleWithdraw(d.id)}
                          disabled={withdrawingId === d.id}
                        >
                          {withdrawingId === d.id ? (
                            <ActivityIndicator color="#fff" size="small" />
                          ) : (
                            <Text style={styles.confirmBtnText}>Confirmar</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
  badge: {
    backgroundColor: "rgba(255,193,7,0.15)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,193,7,0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#FFC107" },

  filtersRow: { flexDirection: "row", paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  filterTextActive: { color: "#fff" },

  countLabel: { paddingHorizontal: 16, fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },

  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },

  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  statusBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  timeAgo: { fontSize: 11, color: Colors.textSecondary },

  cardBody: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { width: 46, height: 46, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cardInfo: { flex: 1 },
  recipientName: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary, marginBottom: 2 },
  trackingCode: { fontSize: 12, color: Colors.textSecondary },
  trackingValue: { color: Colors.primary, fontWeight: "600" },
  dateText: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },

  withdrawBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    height: 42,
  },
  withdrawBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  confirmRow: { gap: 8 },
  confirmText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary, textAlign: "center" },
  confirmBtns: { flexDirection: "row", gap: 8 },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  cancelBtnText: { fontSize: 14, fontWeight: "600", color: Colors.textSecondary },
  confirmBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  emptyState: { alignItems: "center", paddingTop: 64, gap: 10 },
  emptyTitle: { fontSize: 15, color: Colors.textSecondary },
});
