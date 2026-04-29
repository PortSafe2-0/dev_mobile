import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";

export default function PortSafeScreen() {
  const { width } = useWindowDimensions();
  const isWeb = width > 768;

  const handleSelectRole = (role: string) => {
    if (role === "portaria") router.push("/portaria");
    else if (role === "morador") router.push("/morador");
    else if (role === "entregador") router.push("/entregador");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

        <View style={[styles.container, isWeb && styles.containerWeb]}>
          {/* Logo */}
          <Image
            source={require("@/assets/images/vert_icon.png")} 
            style={styles.logo}
            />

        <Text style={styles.system}>SISTEMA DE ENTREGAS DO CONDOMÍNIO</Text>

          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Selecione seu perfil:</Text>

          {/* Portaria */}
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => handleSelectRole("portaria")}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#10b981" }]}>
              <Ionicons name="grid-outline" size={24} color="#fff" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Portaria</Text>
              <Text style={styles.optionDesc}>Gestão de entradas e notificações</Text>
            </View>
            <View style={[styles.arrow, { backgroundColor: "#10b981" }]}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Morador */}
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => handleSelectRole("morador")}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#3b82f6" }]}>
              <Ionicons name="person-outline" size={24} color="#fff" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Morador</Text>
              <Text style={styles.optionDesc}>Minhas encomendas e avisos</Text>
            </View>
            <View style={[styles.arrow, { backgroundColor: "#3b82f6" }]}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>

          {/* Entregador */}
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => handleSelectRole("entregador")}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#f97316" }]}>
              <Ionicons name="car-outline" size={24} color="#fff" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Entregador</Text>
              <Text style={styles.optionDesc}>Realizar novas entregas</Text>
            </View>
            <View style={[styles.arrow, { backgroundColor: "#f97316" }]}>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2026 PortSafe. Todos os direitos reservados.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: "center",
  },
  containerWeb: {
    maxWidth: 500,
    alignSelf: "center",
  },
  logo: {
    width: 220,
    height: 220,
    resizeMode: "contain",
    },
  title: {
    fontSize: 40,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.textSecondary,
    marginBottom: 48,
  },
  system: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "800",
    marginBottom: 56,

  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  optionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});