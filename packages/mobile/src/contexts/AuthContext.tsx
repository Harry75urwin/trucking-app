import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../lib/api/client';
import { canAccessModel } from '../lib/rbac';
import type { AccessModel, UserRole } from '../lib/rbac';
import type { AuthResponse, Load, Vehicle, TrackingEvent, Conversation, Customer, Driver, Dispatch, LoadAssignment } from '../types';

interface AuthContextValue {
  signIn: (payload: { phone: string; password: string }) => Promise<void>;
  signUp: (payload: {
    phone: string;
    password: string;
    name?: string;
    email?: string;
    role?: UserRole;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  token: string | null;
  user: AuthResponse['user'] | null;
  loading: boolean;
  loads: Load[];
  vehicles: Vehicle[];
  trackingEvents: TrackingEvent[];
  conversations: Conversation[];
  drivers: Driver[];
  customers: Customer[];
  loadAssignments: LoadAssignment[];
  dispatches: Dispatch[];
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'truck-app-token';
const USER_STORAGE_KEY = 'truck-app-user';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthResponse['user'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [loads, setLoads] = useState<Load[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadAssignments, setLoadAssignments] = useState<LoadAssignment[]>([]);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (token && user) {
      refreshUserData();
    }
  }, [token, user?.id]);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);

      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
      console.error('Failed to load stored auth', e);
    } finally {
      setLoading(false);
    }
  };

  const saveAuth = async (accessToken: string, newUser: AuthContextValue['user']) => {
    setToken(accessToken);
    setUser(newUser);
    if (accessToken) {
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    }
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
  };

  const clearAuth = async () => {
    setToken(null);
    setUser(null);
    setLoads([]);
    setVehicles([]);
    setTrackingEvents([]);
    setConversations([]);
    setDrivers([]);
    setCustomers([]);
    setLoadAssignments([]);
    setDispatches([]);
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const signIn = async ({ phone, password }: { phone: string; password: string }) => {
    const data = await apiClient.post<AuthResponse>(
      '/auth/login',
      { phoneNumber: phone, password },
    );
    await saveAuth(data.accessToken, data.user);
  };

  const signUp = async (payload: {
    phone: string;
    password: string;
    name?: string;
    email?: string;
    role?: UserRole;
  }) => {
    const [firstName = '', lastName = ''] = (payload.name ?? '').split(' ');
    const data = await apiClient.post<AuthResponse>(
      '/auth/signup',
      {
        firstName,
        lastName,
        email: payload.email,
        phoneNumber: payload.phone,
        password: payload.password,
        role: payload.role,
      },
    );
    await saveAuth(data.accessToken, data.user);
  };

  const signOut = async () => {
    await clearAuth();
  };

  const fetchAuthorizedData = async <T,>(path: string, model: AccessModel) => {
    if (!token || !canAccessModel(user?.role, model)) {
      return [] as T[];
    }

    return apiClient.get<T[]>(path, token).catch(() => [] as T[]);
  };

  const refreshUserData = async () => {
    if (!token || !user) return;

    try {
      const [loadsData, vehiclesData, trackingData, convData, driversData, customersData, loadAssignmentsData, dispatchData] = await Promise.all([
        fetchAuthorizedData<Load>('/loads', 'loads'),
        fetchAuthorizedData<Vehicle>('/vehicles', 'fleet'),
        fetchAuthorizedData<TrackingEvent>('/tracking', 'tracking'),
        fetchAuthorizedData<Conversation>(`/messaging/conversations?userId=${user.id}`, 'messaging'),
        fetchAuthorizedData<Driver>('/drivers', 'drivers'),
        fetchAuthorizedData<Customer>('/customers', 'customers'),
        fetchAuthorizedData<LoadAssignment>('/load-assignments', 'load_assignments'),
        fetchAuthorizedData<Dispatch>('/dispatches', 'dispatches'),
      ]);

      setLoads(loadsData);
      setVehicles(vehiclesData);
      setTrackingEvents(trackingData);
      setConversations(convData);
      setDrivers(driversData);
      setCustomers(customersData);
      setLoadAssignments(loadAssignmentsData);
      setDispatches(dispatchData);
    } catch (e) {
      console.error('Failed to refresh user data', e);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, signUp, signOut, token, user, loading, loads, vehicles, trackingEvents, conversations, drivers, customers, loadAssignments, dispatches, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}
