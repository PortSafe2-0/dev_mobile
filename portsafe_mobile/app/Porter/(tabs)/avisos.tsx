import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
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
  tipo: "nova" | "retirada" | "pendente";
  titulo: string;
  descricao: string;
  data: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const diffMs = Date.now() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return "Agora há pouco";
  if (diffH < 24) return `Há ${diffH}h`;
  if (diffD === 1) return "Ontem";
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function deliveriesToAvisos(deliveries: DeliveryDto[]): Aviso[] {
  const avisos: Aviso[] = [];
  const now = Date.now();

  for (const d of deliveries) {
    avisos.push({
      id: `nova-${d.id}`,
      tipo: "nova",
      titulo: "Nova entrega registrada",
      descricao: `Encomenda #${d.trackingCode} para ${d.recipientName} foi depositada.`,
      data: d.createdAt,
    });

    if (d.status === "Withdrawn" && d.withdrawnAt) {
      avisos.push({
        id: `retirada-${d.id}`,
        tipo: "retirada",
        titulo: "Entrega retirada",
        descricao: `${d.recipientName} retirou a encomenda #${d.trackingCode}.`,
        data: d.withdrawnAt,
      });
    }

    const horasEsperando = (now - new Date(d.createdAt).getTime()) / 3600000;
    if (d.status !== "Withdrawn" && horasEsperando > 24) {
      avisos.push({
        id: `pendente-${d.id}`,
        tipo: "pendente",
        titulo: "Entrega aguardando há muito tempo",
        descricao: `A encomenda #${d.trackingCode} de ${d.recipientName} está há mais de 24h na portaria.`,
        data: d.createdAt,
      });
    }
  }

  return avisos.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
}

const AVISO_CONFIG = {
  nova: {
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
  pendente: {
    icon: "warning-outline" as const,
    color: "#FF9800",
    bg: "rgba(255,152,0,0.12)",
    border: "rgba(255,152,0,0.2)",
  },
};

export default function PorterAvisosScreen() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAvisos = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await api.deliveries.getAll();
      setAvisos(deliveriesToAvisos(res.data ?? []));
    } catch {
      // sem entregas = sem avisos
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAvisos();
  }, [fetchAvisos]);

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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Avisos</Text>
          <Text style={styles.headerSub}>{avisos.length} notificações</Text>
        </View>

        {loading && <ActivityIndicator color={Colors.primary} style={{ marginTop: 48 }} />}

        {!loading && avisos.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off-outline" size={36} color={Colors.textSecondary} />
            </View>
            <Text style={styles.emptyTitle}>Sem avisos</Text>
            <Text style={styles.emptySub}>Nenhuma atividade registrada ainda.</Text>
          </View>
        )}

        {!loading && avisos.length > 0 && (
          <View style={styles.list}>
            {avisos.map((aviso) => {
              const cfg = AVISO_CONFIG[aviso.tipo];
              return (
                <View key={aviso.id} style={styles.card}>
                  <View style={[styles.iconBox, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                    <Ionicons name={cfg.icon} size={22} color={cfg.color} />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.cardTop}>
                      <Text style={styles.cardTitle}>{aviso.titulo}</Text>
                      <Text style={styles.cardDate}>{formatDate(aviso.data)}</Text>
                    </View>
                    <Text style={styles.cardDesc}>{aviso.descricao}</Text>
                  </View>
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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },

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
  cardTitle: { fontSize: 14, fontWeight: "700", color: Colors.textPrimary, flex: 1, marginRight: 8 },
  cardDate: { fontSize: 11, color: Colors.textSecondary, flexShrink: 0 },
  cardDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  emptyState: { alignItems: "center", paddingTop: 80, gap: 12 },
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
  emptySub: { fontSize: 13, color: Colors.textSecondary },
});
