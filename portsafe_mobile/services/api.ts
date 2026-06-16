import { Platform } from 'react-native';

const DEV_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_BASE_URL =
    (process.env.EXPO_PUBLIC_API_URL as string | undefined) ?? `http://${DEV_HOST}:5063`;

let _token: string | null = null;
let _onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
    _token = token;
}

export function getAuthToken(): string | null {
    return _token;
}

export function setUnauthorizedHandler(handler: () => void) {
    _onUnauthorized = handler;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    if (_token) headers['Authorization'] = `Bearer ${_token}`;

    const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    if (!res.ok) {
        const body = await res.json().catch(() => ({})) as Record<string, unknown>;
        if (res.status === 401 && _token) {
            _onUnauthorized?.();
        }
        throw new Error((body.message as string | undefined) ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}

export interface UserDto {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    phone?: string;
    document?: string;
    block?: string;
    unitNumber?: string;
    street?: string;
    houseNumber?: string;
    zipCode?: string;
}

export interface DeliveryDto {
    id: string;
    userId: string;
    lockerId: string;
    recipientName: string;
    trackingCode: string;
    status: string;
    createdAt: string;
    deliveredAt?: string;
    withdrawnAt?: string;
}

export interface LockerDto {
    id: string;
    code: string;
    location: string;
    status: string;
    isActive: boolean;
    createdAt: string;
}

export interface AnonymousDeliveryResultDto {
    deliveryId: string;
    trackingCode: string;
    lockerCode: string;
    lockerLocation: string;
}

export const api = {
    auth: {
        login: (email: string, password: string) =>
            request<{ success: boolean; token: string; user: UserDto }>('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            }),
        register: (dto: {
            name: string;
            email: string;
            password: string;
            role?: string;
            phone?: string;
            document?: string;
            block?: string;
            unitNumber?: string;
            street?: string;
            houseNumber?: string;
            zipCode?: string;
        }) =>
            request<{ success: boolean; token: string; user: UserDto }>('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(dto),
            }),
        forgotPassword: (email: string) =>
            request<{ success: boolean; message: string }>('/api/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            }),
        resetPassword: (email: string, code: string, newPassword: string) =>
            request<{ success: boolean; message: string }>('/api/auth/reset-password', {
                method: 'POST',
                body: JSON.stringify({ email, code, newPassword }),
            }),
    },
    deliveries: {
        getAll: () =>
            request<{ success: boolean; data: DeliveryDto[] }>('/api/deliveries'),
        getMy: () =>
            request<{ success: boolean; data: DeliveryDto[] }>('/api/deliveries/my'),
        getById: (id: string) =>
            request<{ success: boolean; data: DeliveryDto }>(`/api/deliveries/${id}`),
        withdraw: (id: string) =>
            request<{ success: boolean }>(`/api/deliveries/${id}/withdraw`, { method: 'POST' }),
        notify: (id: string) =>
            request<{ success: boolean; message: string }>(`/api/deliveries/${id}/notify`, { method: 'POST' }),
        create: (dto: {
            userId: string;
            lockerId: string;
            recipientName: string;
            trackingCode: string;
        }) =>
            request<{ success: boolean; data: DeliveryDto }>('/api/deliveries', {
                method: 'POST',
                body: JSON.stringify(dto),
            }),
        createAnonymous: (dto: { recipientName: string; trackingCode?: string }) =>
            request<{ success: boolean; data: AnonymousDeliveryResultDto }>('/api/deliveries/anonymous', {
                method: 'POST',
                body: JSON.stringify(dto),
            }),
    },
    lockers: {
        getAll: () =>
            request<{ success: boolean; data: LockerDto[] }>('/api/lockers'),
        getById: (id: string) =>
            request<{ success: boolean; data: LockerDto }>(`/api/lockers/${id}`),
    },
    users: {
        me: () =>
            request<{ success: boolean; data: UserDto }>('/api/users/me'),
        getAll: () =>
            request<UserDto[]>('/api/users'),
        getById: (id: string) =>
            request<UserDto>(`/api/users/${id}`),
    },
    condominios: {
        getAll: () =>
            request<{ success: boolean; data: string[] }>('/api/condominios'),
    },
};
