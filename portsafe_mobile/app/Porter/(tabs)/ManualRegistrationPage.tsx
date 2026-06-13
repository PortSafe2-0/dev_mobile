import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, UserDto, LockerDto } from "@/services/api";

export default function ManualRegistrationScreen() {
  const [delivererName, setDelivererName] = useState("");
  const [company, setCompany] = useState("");
  const [notes, setNotes] = useState("");

  const [moradores, setMoradores] = useState<UserDto[]>([]);
  const [lockers, setLockers] = useState<LockerDto[]>([]);
  const [selectedMorador, setSelectedMorador] = useState<UserDto | null>(null);
  const [selectedLocker, setSelectedLocker] = useState<LockerDto | null>(null);
  const [showMoradorPicker, setShowMoradorPicker] = useState(false);
  const [showLockerPicker, setShowLockerPicker] = useState(false);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingLockers, setLoadingLockers] = useState(false);

  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  useEffect(() => {
    (async () => {
      try {
        const [users, lockersRes] = await Promise.all([
          api.users.getAll(),
          api.lockers.getAll(),
        ]);
        setMoradores(users.filter((u) => u.role.toLowerCase() === "morador"));
        setLockers((lockersRes.data ?? []).filter((l) => l.isActive));
      } catch {
        Alert.alert("Aviso", "Não foi possível carregar moradores/armários.");
      } finally {
        setLoadingData(false);
      }
    })();
  }, []);

  const filteredMoradores = moradores.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const refreshLockers = async () => {
    setLoadingLockers(true);
    try {
      const lockersRes = await api.lockers.getAll();
      const fresh = (lockersRes.data ?? []).filter((l) => l.isActive);
      setLockers(fresh);
      // Se o armário selecionado agora está Occupied, limpa a seleção
      setSelectedLocker((prev) => {
        if (!prev) return null;
        const updated = fresh.find((l) => l.id === prev.id);
        return updated?.status === "Available" ? prev : null;
      });
    } catch {
      // silencioso — mantém lista anterior
    } finally {
      setLoadingLockers(false);
    }
  };

  const handleRegister = async () => {
    if (!selectedMorador) {
      Alert.alert("Atenção", "Selecione o morador destinatário.");
      return;
    }
    if (!selectedLocker) {
      Alert.alert("Atenção", "Selecione um armário disponível.");
      return;
    }
    setLoading(true);
    try {
      const trackingCode = `PS${Date.now().toString(36).toUpperCase().slice(-6)}`;
      await api.deliveries.create({
        userId: selectedMorador.id,
        lockerId: selectedLocker.id,
        recipientName: selectedMorador.name,
        trackingCode,
      });
      const registeredMorador = selectedMorador.name;
      const registeredCode = trackingCode;
      const registeredLocker = selectedLocker.code;
      setSelectedMorador(null);
      setSelectedLocker(null);
      setDelivererName("");
      setCompany("");
      setNotes("");
      Alert.alert(
        "Entrega Registrada!",
        `Código: #${registeredCode}\nMorador: ${registeredMorador}\nArmário: ${registeredLocker}`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (e: unknown) {
      console.error("[ManualReg] erro ao criar entrega:", e);
      const msg = e instanceof Error ? e.message : "Não foi possível registrar a entrega.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
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
              <Image
                source={require("@/assets/images/horiz_icon.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
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
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => { setSearch(""); setShowMoradorPicker(true); }}
                disabled={loadingData}
              >
                <Text style={[styles.input, { flex: 1, color: selectedMorador ? Colors.textPrimary : Colors.textSecondary }]}>
                  {loadingData ? "Carregando..." : selectedMorador ? selectedMorador.name : "Selecionar morador"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              {selectedMorador && (
                <Text style={styles.selectedInfo}>{selectedMorador.email}</Text>
              )}
            </View>

            {/* Armário */}
            <Text style={styles.sectionLabel}>ARMÁRIO</Text>
            <View style={styles.fieldsGroup}>
              <TouchableOpacity
                style={styles.inputWrapper}
                onPress={() => { refreshLockers(); setShowLockerPicker(true); }}
                disabled={loadingData}
              >
                <Text style={[styles.input, { flex: 1, color: selectedLocker ? Colors.textPrimary : Colors.textSecondary }]}>
                  {loadingData ? "Carregando..." : selectedLocker ? `Armário ${selectedLocker.code} — ${selectedLocker.location}` : "Selecionar armário"}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
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
            <TouchableOpacity
              style={[styles.registerButton, loading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.registerButtonText}>Registrar Entrega</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal — Selecionar Morador */}
      <Modal visible={showMoradorPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Morador</Text>
              <TouchableOpacity onPress={() => setShowMoradorPicker(false)}>
                <Ionicons name="close" size={22} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchWrapper}>
              <Ionicons name="search-outline" size={18} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar morador..."
                placeholderTextColor={Colors.textSecondary}
                value={search}
                onChangeText={setSearch}
                autoFocus
              />
            </View>
            <FlatList
              data={filteredMoradores}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerItem, selectedMorador?.id === item.id && styles.pickerItemActive]}
                  onPress={() => { setSelectedMorador(item); setShowMoradorPicker(false); }}
                >
                  <View style={styles.pickerItemIcon}>
                    <Ionicons name="person-outline" size={18} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.pickerItemName}>{item.name}</Text>
                    <Text style={styles.pickerItemSub}>{item.email}</Text>
                  </View>
                  {selectedMorador?.id === item.id && (
                    <Ionicons name="checkmark" size={18} color={Colors.primary} style={{ marginLeft: "auto" }} />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.pickerEmpty}>Nenhum morador encontrado</Text>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Modal — Selecionar Armário */}
      <Modal visible={showLockerPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecionar Armário</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {loadingLockers && <ActivityIndicator size="small" color={Colors.primary} />}
                <TouchableOpacity onPress={() => setShowLockerPicker(false)}>
                  <Ionicons name="close" size={22} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
            </View>
            <FlatList
              data={lockers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isAvailable = item.status === "Available";
                const isSelected = selectedLocker?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.pickerItem,
                      isSelected && styles.pickerItemActive,
                      !isAvailable && styles.pickerItemDisabled,
                    ]}
                    onPress={() => {
                      if (!isAvailable) return;
                      setSelectedLocker(item);
                      setShowLockerPicker(false);
                    }}
                    activeOpacity={isAvailable ? 0.7 : 1}
                  >
                    <View style={[styles.pickerItemIcon, !isAvailable && { backgroundColor: "rgba(255,82,82,0.1)" }]}>
                      <Ionicons name="cube-outline" size={18} color={isAvailable ? Colors.primary : "#FF5252"} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.pickerItemName, !isAvailable && { color: Colors.textSecondary }]}>
                        Armário {item.code}
                      </Text>
                      <Text style={styles.pickerItemSub}>{item.location}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: isAvailable ? "rgba(76,175,80,0.12)" : "rgba(255,82,82,0.12)" }]}>
                      <Text style={[styles.statusBadgeText, { color: isAvailable ? "#4CAF50" : "#FF5252" }]}>
                        {isAvailable ? "Livre" : "Ocupado"}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={Colors.primary} style={{ marginLeft: 8 }} />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.pickerEmpty}>Nenhum armário cadastrado</Text>
              }
            />
          </View>
        </View>
      </Modal>
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
  headerLogo: { width: 180, height: 100, },
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

  selectedInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: -6,
    marginLeft: 4,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "75%",
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: { fontSize: 16, fontWeight: "800", color: Colors.textPrimary },

  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 12,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 14 },

  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pickerItemActive: { backgroundColor: "rgba(33,150,243,0.06)" },
  pickerItemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(33,150,243,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  pickerItemName: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  pickerItemSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  pickerItemDisabled: {
    opacity: 0.6,
  },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  pickerEmpty: {
    textAlign: "center",
    color: Colors.textSecondary,
    fontSize: 14,
    padding: 24,
  },
});