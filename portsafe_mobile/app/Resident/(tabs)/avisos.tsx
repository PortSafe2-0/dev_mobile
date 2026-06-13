import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, DeliveryDto } from "@/services/api";

interface Aviso {
  id: string;
  tipo: "chegou" | "retirada";
  titulo: string;
  descricao: string;
  data: string;
  lido: boolean;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);

  if (diffH < 1) return "Agora há pouco";
  if (diffH < 24) return `Há ${diffH}h`;
  if (diffD === 1) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function deliveriesToAvisos(deliveries: DeliveryDto[]): Aviso[] {
  const avisos: Aviso[] = [];

  for (const d of deliveries) {
    avisos.push({
      id: `chegou-${d.id}`,
      tipo: "chegou",
      titulo: "Encomenda chegou",
      descricao: `Código #${d.trackingCode} está disponível na portaria para retirada.`,
      data: d.createdAt,
      lido: d.status === "Withdrawn",
    });

    if (d.status === "Withdrawn" && d.withdrawnAt) {
      avisos.push({
        id: `retirada-${d.id}`,
        tipo: "retirada",
        titulo: "Retirada confirmada",
        descricao: `Você retirou a encomenda #${d.trackingCode} com sucesso.`,
        data: d.withdrawnAt,
        lido: true,
      });
    }
  }

  return avisos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

const AVISO_CONFIG = {
  chegou: {
    icon: "cube-outline" as const,
    color: Colors.primary,
    bg: "rgba(33,150,243,0.12)",
    border: "rgba(33,150,243,0.2)",
  },
  retirada: {
    icon: "checkmark-circle-outline" as const,
    color: "#4CAF50",
    bg: "rgba(76,175,80,0.12)",
    border: "rgba(76,175,80,0.2)",
  },
};

export default function AvisosScreen() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAvisos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.deliveries.getMy();
      setAvisos(deliveriesToAvisos(res.data ?? []));
    } catch {
      // silencia — sem entregas = sem avisos
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAvisos();
  }, [fetchAvisos]);

  const naoLidos = avisos.filter((a) => !a.lido).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchAvisos(true)}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Avisos</Text>
            {naoLidos > 0 && (
              <Text style={styles.headerSub}>
                {naoLidos} {naoLidos === 1 ? "novo aviso" : "novos avisos"}
              </Text>
            )}
          </View>
          {naoLidos > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{naoLidos}</Text>
            </View>
          )}
        </View>

        {loading && (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 48 }} />
        )}

        {!loading && avisos.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={36} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Sem avisos por enquanto</Text>
            <Text style={styles.emptySubtitle}>
              Você será notificado quando uma encomenda chegar.
            </Text>
          </View>
        )}

        {!loading && avisos.length > 0 && (
          <View style={styles.list}>
            {avisos.map((aviso) => {
              const cfg = AVISO_CONFIG[aviso.tipo];
              return (
                <TouchableOpacity
                  key={aviso.id}
                  style={[styles.card, !aviso.lido && styles.cardUnread]}
                  activeOpacity={0.8}
                >
                  {!aviso.lido && <View style={styles.unreadDot} />}

                  <View style={[styles.iconBox, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                    <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                  </View>

                  <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                      <Text style={[styles.cardTitle, !aviso.lido && styles.cardTitleUnread]}>
                        {aviso.titulo}
                      </Text>
                      <Text style={styles.cardDate}>{formatDate(aviso.data)}</Text>
                    </View>
                    <Text style={styles.cardDesc}>{aviso.descricao}</Text>
                  </View>
                </TouchableOpacity>
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
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 13, fontWeight: "800", color: "#fff" },

  list: { paddingHorizontal: 16, paddingBottom: 32, gap: 10 },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 12,
    position: "relative",
  },
  cardUnread: {
    borderColor: "rgba(33,150,243,0.3)",
    backgroundColor: "rgba(33,150,243,0.04)",
  },
  unreadDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  cardContent: { flex: 1 },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  cardTitleUnread: { fontWeight: "800" },
  cardDate: { fontSize: 11, color: Colors.textSecondary, flexShrink: 0 },
  cardDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  emptyState: { alignItems: "center", paddingTop: 80, gap: 12, paddingHorizontal: 32 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  emptySubtitle: { fontSize: 13, color: Colors.textSecondary, textAlign: "center", lineHeight: 18 },
});
