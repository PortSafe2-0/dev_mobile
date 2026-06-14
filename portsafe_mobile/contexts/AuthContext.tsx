import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { api, setAuthToken, setUnauthorizedHandler, UserDto } from '@/services/api';

const TOKEN_KEY = '@portsafe_token';
const USER_KEY = '@portsafe_user';

interface AuthState {
    user: UserDto | null;
    token: string | null;
    isAuthenticated: boolean;
}

interface RegisterExtra {
    role?: string;
    phone?: string;
    document?: string;
    block?: string;
    unitNumber?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
}

interface AuthContextValue extends AuthState {
    isLoading: boolean;
    login: (email: string, password: string) => Promise<UserDto>;
    register: (name: string, email: string, password: string, extra?: RegisterExtra) => Promise<UserDto>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: null,
        isAuthenticated: false,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Restaura sessão salva ao iniciar o app
    useEffect(() => {
        (async () => {
            try {
                const [token, userJson] = await Promise.all([
                    AsyncStorage.getItem(TOKEN_KEY),
                    AsyncStorage.getItem(USER_KEY),
                ]);
                if (token && userJson) {
                    const user: UserDto = JSON.parse(userJson);
                    setAuthToken(token);
                    setState({ user, token, isAuthenticated: true });
                }
            } catch {
                // storage indisponível — inicia sem sessão
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const login = useCallback(async (email: string, password: string): Promise<UserDto> => {
        const res = await api.auth.login(email, password);
        setAuthToken(res.token);
        setState({ user: res.user, token: res.token, isAuthenticated: true });
        await AsyncStorage.setItem(TOKEN_KEY, res.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));
        return res.user;
    }, []);

    const register = useCallback(
        async (name: string, email: string, password: string, extra?: RegisterExtra): Promise<UserDto> => {
            const res = await api.auth.register({ name, email, password, ...extra });
            setAuthToken(res.token);
            setState({ user: res.user, token: res.token, isAuthenticated: true });
            await AsyncStorage.setItem(TOKEN_KEY, res.token);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));
            return res.user;
        },
        []
    );

    const logout = useCallback(async () => {
        setAuthToken(null);
        setState({ user: null, token: null, isAuthenticated: false });
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
        router.replace('/');
    }, []);

    useEffect(() => {
        setUnauthorizedHandler(logout);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ ...state, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
