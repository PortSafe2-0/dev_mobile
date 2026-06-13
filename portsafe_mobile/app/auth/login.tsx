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
    ActivityIndicator,
    useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { RoleToggle } from "@/components/ui/RoleToggle";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";

type Role = "morador" | "porteiro";

export default function LoginScreen() {
    const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
    const [role, setRole] = useState<Role>(roleParam === "porteiro" ? "porteiro" : "morador");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email.trim() || !password) {
            setError("Preencha e-mail e senha");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await login(email.trim(), password);
            if (role === "morador") {
                router.replace("/Resident/(tabs)");
            } else {
                router.replace("/Porter/(tabs)");
            }
        } catch {
            setError("Credenciais inválidas. Verifique e-mail e senha.");
        } finally {
            setLoading(false);
        }
    };

    const { width } = useWindowDimensions();
    const isWeb = width > 768;

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

            <KeyboardAvoidingView
                style={styles.root}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo — agora dentro do scroll, no fluxo normal */}
                    <Image
                        source={require("@/assets/images/icon_portsafee.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <View style={[styles.container, isWeb && styles.containerWeb]}>
                        <Text style={styles.title}>Bem-vindo de volta</Text>
                        <Text style={styles.subtitle}>
                            Faça login para ter acesso a sua conta
                        </Text>

                        <View style={styles.toggleWrapper}>
                            <RoleToggle selected={role} onSelect={setRole} />
                        </View>

                        <View style={styles.form}>
                            <Text style={styles.label}>E-mail</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Insira aqui seu e-mail"
                                    placeholderTextColor={Colors.textSecondary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <Text style={[styles.label, { marginTop: 16 }]}>Senha</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Insira aqui sua senha"
                                    placeholderTextColor={Colors.textSecondary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={22}
                                        color={Colors.textSecondary}
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.forgotWrapper} onPress={() => router.push("/auth/ForgotPassword")}>
                                <Text style={styles.forgotText}>Esqueceu a senha?</Text>
                            </TouchableOpacity>

                            {error && (
                                <Text style={styles.errorText}>{error}</Text>
                            )}

                            <TouchableOpacity
                                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.loginButtonText}>Entrar</Text>
                                )}
                            </TouchableOpacity>

                            <View style={styles.registerRow}>
                                <Text style={styles.registerText}>Não tem uma conta? </Text>
                                <TouchableOpacity onPress={() => router.push({ pathname: "/auth/register", params: { role } })}>
                                    <Text style={styles.registerLink}>Cadastre-se aqui</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                        >
                            <Ionicons name="arrow-back" size={16} color={Colors.textSecondary} />
                            <Text style={styles.backText}>VOLTAR A PÁGINA INICIAL</Text>
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

    scroll: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 40,
        alignItems: "center",
    },

    logo: {
        width: 140,
        height: 140,
        marginTop: 40,
        marginBottom: 24,
    },

    container: { width: "100%", alignItems: "center" },
    containerWeb: { maxWidth: 500 },

    title: {
        fontSize: 26,
        fontWeight: "800",
        color: Colors.textPrimary,
        textAlign: "center",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        textAlign: "center",
        marginBottom: 32,
    },

    toggleWrapper: { marginBottom: 32, width: "100%" },
    form: { width: "100%" },
    label: {
        fontSize: 14,
        color: Colors.textPrimary,
        marginBottom: 8,
        fontWeight: "500",
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.surfaceElevated,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        paddingHorizontal: 16,
        height: 48,
    },
    input: { flex: 1, color: Colors.textPrimary, fontSize: 15 },

    forgotWrapper: { marginTop: 12, marginBottom: 24 },
    forgotText: { color: Colors.textSecondary, fontSize: 14 },

    loginButton: {
        backgroundColor: Colors.primary,
        borderRadius: 12,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 28,
    },
    loginButtonDisabled: { opacity: 0.6 },
    loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    errorText: {
        color: "#FF5252",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 12,
    },

    registerRow: { flexDirection: "row", justifyContent: "center" },
    registerText: { color: Colors.textSecondary, fontSize: 14 },
    registerLink: { color: Colors.accent, fontSize: 14, fontWeight: "600" },

    backButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 32,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    backText: {
        color: Colors.textSecondary,
        fontSize: 12,
        letterSpacing: 1,
        fontWeight: "600",
    },
});