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
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; border: string }> = {
  Withdrawn: {
    label: "RETIRADO",
    color: "#4CAF50",
    bg: "rgba(76,175,80,0.12)",
    border: "rgba(76,175,80,0.3)",
  },
  Delivered: {
    label: "ENTREGUE",
    color: Colors.primary,
    bg: "rgba(33,150,243,0.1)",
    border: "rgba(33,150,243,0.2)",
  },
};

function getStatus(status: string) {
  return (
    STATUS_MAP[status] ?? {
      label: "AGUARDANDO",
      color: "#FFC107",
      bg: "rgba(255,193,7,0.12)",
      border: "rgba(255,193,7,0.3)",
    }
  );
}

export default function EntregasScreen() {
  const [deliveries, setDeliveries] = useState<DeliveryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<Filter>("todas");
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const fetchDeliveries = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.deliveries.getMy();
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
      Alert.alert("Erro na retirada", msg);
    } finally {
      setWithdrawingId(null);
    }
  };

  const filtered = deliveries.filter((d) => {
    if (filter === "aguardando") return d.status !== "Withdrawn";
    if (filter === "retiradas") return d.status === "Withdrawn";
    return true;
  });

  const awaitingCount = deliveries.filter((d) => d.status !== "Withdrawn").length;

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Minhas Entregas</Text>
          {awaitingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{awaitingCount} aguardando</Text>
            </View>
          )}
        </View>

        {/* Filtros */}
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

        {/* Contador */}
        <Text style={styles.countLabel}>
          {filtered.length} {filtered.length === 1 ? "entrega" : "entregas"}
        </Text>

        {/* Loading */}
        {loading && (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 48 }} />
        )}

        {/* Lista */}
        {!loading && (
          <View style={styles.list}>
            {filtered.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="cube-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyTitle}>Nenhuma entrega encontrada</Text>
                <Text style={styles.emptySubtitle}>
                  {filter === "aguardando"
                    ? "Não há entregas aguardando retirada."
                    : filter === "retiradas"
                    ? "Você ainda não retirou nenhuma entrega."
                    : "Suas entregas aparecerão aqui."}
                </Text>
              </View>
            )}

            {filtered.map((delivery) => {
              const st = getStatus(delivery.status);
              const isPending = delivery.status !== "Withdrawn";

              return (
                <View key={delivery.id} style={styles.card}>
                  {/* Topo do card */}
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: st.bg, borderColor: st.border }]}>
                      <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                    </View>
                    <Text style={styles.dateText}>{formatDate(delivery.createdAt)}</Text>
                  </View>

                  {/* Ícone + info */}
                  <View style={styles.cardBody}>
                    <View style={[styles.iconBox, isPending && styles.iconBoxPending]}>
                      <Ionicons
                        name={isPending ? "cube-outline" : "checkmark-circle-outline"}
                        size={24}
                        color={isPending ? Colors.primary : "#4CAF50"}
                      />
                    </View>
                    <View style={styles.cardInfo}>
                      <Text style={styles.recipientName}>{delivery.recipientName}</Text>
                      <Text style={styles.trackingCode}>
                        Código:{" "}
                        <Text style={styles.trackingCodeValue}>#{delivery.trackingCode}</Text>
                      </Text>
                      {delivery.withdrawnAt && (
                        <Text style={styles.withdrawnAt}>
                          Retirado em: {formatDate(delivery.withdrawnAt)}
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Botão de retirada */}
                  {isPending && confirmingId !== delivery.id && (
                    <TouchableOpacity
                      style={[styles.withdrawBtn, withdrawingId === delivery.id && { opacity: 0.6 }]}
                      onPress={() => setConfirmingId(delivery.id)}
                      disabled={withdrawingId === delivery.id}
                    >
                      {withdrawingId === delivery.id ? (
                        <ActivityIndicator color="#fff" size="small" />
                      ) : (
                        <>
                          <Ionicons name="checkmark-outline" size={18} color="#fff" />
                          <Text style={styles.withdrawBtnText}>Confirmar Retirada</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}

                  {isPending && confirmingId === delivery.id && (
                    <View style={styles.confirmBox}>
                      <Text style={styles.confirmLabel}>Confirmar retirada desta entrega?</Text>
                      <View style={styles.confirmBtns}>
                        <TouchableOpacity
                          style={styles.cancelBtn}
                          onPress={() => setConfirmingId(null)}
                        >
                          <Text style={styles.cancelBtnText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.confirmBtn, withdrawingId === delivery.id && { opacity: 0.6 }]}
                          onPress={() => handleWithdraw(delivery.id)}
                          disabled={withdrawingId === delivery.id}
                        >
                          {withdrawingId === delivery.id ? (
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

  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary },
  filterTextActive: { color: "#fff" },

  countLabel: {
    paddingHorizontal: 16,
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },

  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 12 },

  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusText: { fontSize: 9, fontWeight: "800", letterSpacing: 0.5 },
  dateText: { fontSize: 11, color: Colors.textSecondary },

  cardBody: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(33,150,243,0.1)",
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxPending: {
    backgroundColor: "rgba(33,150,243,0.1)",
    borderColor: "rgba(33,150,243,0.2)",
  },
  cardInfo: { flex: 1 },
  recipientName: { fontSize: 15, fontWeight: "700", color: Colors.textPrimary, marginBottom: 2 },
  trackingCode: { fontSize: 12, color: Colors.textSecondary },
  trackingCodeValue: { color: Colors.primary, fontWeight: "600" },
  withdrawnAt: { fontSize: 11, color: "#4CAF50", marginTop: 2 },

  withdrawBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 44,
  },
  withdrawBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  confirmBox: { gap: 8 },
  confirmLabel: { fontSize: 13, fontWeight: "600", color: Colors.textSecondary, textAlign: "center" },
  confirmBtns: { flexDirection: "row", gap: 8 },
  cancelBtn: {
    flex: 1,
    height: 44,
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
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  emptyState: { alignItems: "center", paddingTop: 64, gap: 10, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: "center", lineHeight: 18 },
});
