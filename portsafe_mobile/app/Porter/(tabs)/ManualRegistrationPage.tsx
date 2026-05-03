import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Image,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManualRegistrationScreen() {
  const [delivererName, setDelivererName] = useState("");
  const [company, setCompany] = useState("");
  const [residentName, setResidentName] = useState("");
  const [apartment, setApartment] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const handleRegister = () => {
    console.log({ delivererName, company, residentName, apartment, phone, notes });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerLogoBox}>
              <Image
                source={require("@/assets/images/icon_portsafee.png")}
                style={styles.headerLogo}
              />
            </View>
            <Text style={styles.headerBrand}>
              <Text style={styles.headerBrandPort}>Port</Text>
              <Text style={styles.headerBrandSafe}>Safe</Text>
            </Text>
          </View>
          <Text style={styles.headerTitle}>REGISTRO MANUAL</Text>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={[styles.scroll, isWeb && styles.scrollWeb]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.container, isWeb && styles.containerWeb]}>

            {/* Dados do Entregador */}
            <Text style={styles.sectionLabel}>DADOS DO ENTREGADOR</Text>
            <View style={styles.fieldsGroup}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Nome do Entregador"
                  placeholderTextColor={Colors.textSecondary}
                  value={delivererName}
                  onChangeText={setDelivererName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Empresa (Ex: Mercado Livre, iFood)"
                  placeholderTextColor={Colors.textSecondary}
                  value={company}
                  onChangeText={setCompany}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Destinatário */}
            <Text style={styles.sectionLabel}>DESTINATÁRIO</Text>
            <View style={styles.fieldsGroup}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Nome do Morador"
                  placeholderTextColor={Colors.textSecondary}
                  value={residentName}
                  onChangeText={setResidentName}
                  autoCapitalize="words"
                />
                <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
              </View>
              <View style={styles.row}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Apartamento"
                    placeholderTextColor={Colors.textSecondary}
                    value={apartment}
                    onChangeText={setApartment}
                    keyboardType="numeric"
                  />
                </View>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Telefone"
                    placeholderTextColor={Colors.textSecondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </View>

            {/* Observações */}
            <Text style={styles.sectionLabel}>OBSERVAÇÕES</Text>
            <View style={styles.fieldsGroup}>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Detalhes adicionais sobre a entrega..."
                  placeholderTextColor={Colors.textSecondary}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* Info banner */}
            <View style={styles.infoBanner}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={Colors.primary}
                style={{ marginTop: 1 }}
              />
              <Text style={styles.infoBannerText}>
                Após o registro, um código e QR Code serão gerados para o morador retirar a encomenda na portaria.
              </Text>
            </View>

            {/* Botão */}
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Registrar Entrega</Text>
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

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerLogoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerLogo: { width: 26, height: 26, resizeMode: "contain" },
  headerBrand: { fontSize: 16, fontWeight: "800" },
  headerBrandPort: { color: Colors.textPrimary },
  headerBrandSafe: { color: Colors.primary },
  headerTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1,
  },
  headerIconBtn: { padding: 4 },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  scrollWeb: { alignItems: "center" },

  container: { width: "100%" },
  containerWeb: { maxWidth: 480 },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 4,
  },

  fieldsGroup: {
    gap: 10,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    height: 48,
  },
  textAreaWrapper: {
    height: 110,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  textArea: {
    height: 86,
    textAlignVertical: "top",
  },

  // Info banner
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(33,150,243,0.08)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(33,150,243,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  // Botão
  registerButton: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});