import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export type UserType = "trucker" | "company" | "customer" | "admin";

export interface AuthSession {
  isAuthenticated: boolean;
  userType: UserType | null;
  accessToken?: string | null;
  backendRole?: string | null;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role?: string;
    organizationId?: number;
    avatarUrl?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  } | null;
}

const AUTH_SESSION_KEY = "truck-app-auth-session";

interface AuthSessionContextType {
  session: AuthSession;
  login: (session: AuthSession) => void;
  logout: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextType | undefined>(
  undefined
);

export function getStoredAuthSession(): AuthSession {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, userType: null };
  }

  try {
    const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) {
      return { isAuthenticated: false, userType: null };
    }

    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    const userTypes: UserType[] = ["trucker", "company", "customer", "admin"];
    const userType = userTypes.includes(parsed.userType as UserType)
      ? (parsed.userType as UserType)
      : null;

    return {
      isAuthenticated: parsed.isAuthenticated === true && userType !== null,
      userType,
      accessToken:
        typeof parsed.accessToken === "string" ? parsed.accessToken : null,
      backendRole:
        typeof parsed.backendRole === "string" ? parsed.backendRole : null,
      user: parsed.user ?? null,
    };
  } catch {
    return {
      isAuthenticated: false,
      userType: null,
      accessToken: null,
      backendRole: null,
      user: null,
    };
  }
}

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession>(() =>
    getStoredAuthSession()
  );

  useEffect(() => {
    saveAuthSession(session);
  }, [session]);

  const value = useMemo<AuthSessionContextType>(
    () => ({
      session,
      login: (nextSession: AuthSession) => setSession(nextSession),
      logout: () => {
        fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }).catch(() => void 0);
        clearAuthSession();
        setSession({
          isAuthenticated: false,
          userType: null,
          accessToken: null,
          backendRole: null,
          user: null,
        });
      },
    }),
    [session]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return context;
}
