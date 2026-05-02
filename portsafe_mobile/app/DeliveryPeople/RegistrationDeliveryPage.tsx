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

const DELIVERY_CODE = "L040UXQX";
const LOCKER_NUMBER = "115";

const SHARE_OPTIONS = [
  { id: "whatsapp", label: "WHATSAPP", sublabel: "Enviou", color: "#25D366", icon: "logo-whatsapp" },
  { id: "app", label: "APP", sublabel: "Notificou", color: Colors.primary ?? "#2196F3", icon: "notifications-outline" },
  { id: "qrcode", label: "QR CODE", sublabel: "Pronto", color: "#FFC107", icon: "qr-code-outline" },
] as const;

export default function RegisterDeliveryStep4Screen() {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const handleFinish = () => {
    // router.replace("/home");
    console.log("Finalizar e Voltar ao Início");
  };

  const handleNewDelivery = () => {
    // router.replace("/delivery/step1");
    console.log("Registrar Nova Entrega");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <ScrollView
        contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isWeb && styles.containerWeb]}>

          {/* Logo + Título */}
          <Image
            source={require("@/assets/images/icon_portsafee.png")}
            style={styles.logo}
          />
          <Text style={styles.appName}>
            <Text style={styles.appNamePort}>Port</Text>
            <Text style={styles.appNameSafe}>Safe</Text>
          </Text>
          <Text style={styles.appSubtitle}>SISTEMA DE ENTREGAS DO CONDOMÍNIO</Text>

          {/* Título da página */}
          <Text style={styles.pageTitle}>Entrega Registrada!</Text>
          <Text style={styles.pageSubtitle}>O morador foi notificado automaticamente</Text>

          {/* Card principal */}
          <View style={styles.card}>

            {/* Check de sucesso */}
            <View style={styles.successIconWrapper}>
              <Ionicons name="checkmark" size={32} color="#fff" />
            </View>

            <Text style={styles.successTitle}>Pacote Depositado com Sucesso!</Text>
            <Text style={styles.successSubtitle}>
              O sensor confirmou que a encomenda foi colocada no armário.
            </Text>

            {/* Código de entrega */}
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>CÓDIGO DE ENTREGA</Text>
              <Text style={styles.codeValue}>{DELIVERY_CODE}</Text>
            </View>

            {/* Detalhes */}
            <View style={styles.detailsBox}>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Armário:</Text>
                <Text style={styles.detailValue}>{LOCKER_NUMBER}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Código de Rastreio:</Text>
                <Text style={styles.detailValue}>{DELIVERY_CODE}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailKey}>Status:</Text>
                <Text style={styles.detailStatus}>Aguardando Retirada</Text>
              </View>
            </View>

            {/* Opções de compartilhamento */}
            <View style={styles.shareRow}>
              {SHARE_OPTIONS.map((option) => (
                <TouchableOpacity key={option.id} style={styles.shareOption} activeOpacity={0.8}>
                  <View style={[styles.shareIconWrapper, { backgroundColor: option.color }]}>
                    <Ionicons name={option.icon as any} size={20} color="#fff" />
                  </View>
                  <Text style={styles.shareLabel}>{option.label}</Text>
                  <Text style={styles.shareSublabel}>{option.sublabel}</Text>
                </TouchableOpacity>
              ))}
            </View>

          </View>

          {/* Botão Finalizar */}
          <TouchableOpacity style={styles.finishButton} onPress={() => router.push("/")}>
            <Text style={styles.finishButtonText}>Finalizar e Voltar ao Início</Text>
          </TouchableOpacity>

          {/* Botão Nova Entrega */}
          <TouchableOpacity style={styles.newDeliveryButton} onPress={() => router.push("/DeliveryPeople/RegisterDeliveryPage")}>
            <Text style={styles.newDeliveryText}>Registrar Nova Entrega</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },

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
    width: 80,
    height: 80,
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
    marginBottom: 20,
  },

  // Título da página
  pageTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },
  pageSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },

  // Sucesso
  successIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 6,
  },
  successSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  // Código
  codeBox: {
    width: "100%",
    backgroundColor: Colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  codeValue: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: 3,
  },

  // Detalhes
  detailsBox: {
    width: "100%",
    gap: 10,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailKey: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  detailStatus: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFC107",
  },

  // Share
  shareRow: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
  },
  shareOption: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 12,
  },
  shareIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  shareLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  shareSublabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },

  // Botão Finalizar
  finishButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 12,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  // Botão Nova Entrega
  newDeliveryButton: {
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  newDeliveryText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
});