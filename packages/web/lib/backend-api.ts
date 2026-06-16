import type { AuthSession, UserType } from "@/lib/auth-session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export interface BackendAuthUser {
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
}

export interface BackendAuthOrganization {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  description?: string;
  logoUrl?: string;
  primaryColor?: string;
  ownerUserId?: number;
}

export interface BackendAuthResponse {
  message: string;
  accessToken: string;
  user: BackendAuthUser;
  organization?: BackendAuthOrganization | null;
}

export interface BackendLoginPayload {
  phoneNumber: string;
  password: string;
}

export interface BackendSignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role?: string;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "string"
        ? body
        : (body?.message ?? `Request failed with status ${response.status}`);
    throw new Error(
      Array.isArray(message) ? message.join(", ") : String(message)
    );
  }

  return body as T;
}

export function mapBackendRoleToUserType(
  role?: string | null
): UserType | null {
  switch ((role ?? "").toLowerCase()) {
    case "admin":
      return "admin";
    case "driver":
      return "trucker";
    case "dispatcher":
    case "fleet_manager":
    case "company":
      return "company";
    case "customer":
      return "customer";
    default:
      return null;
  }
}

export async function loginWithBackend(payload: BackendLoginPayload): Promise<
  AuthSession & {
    accessToken: string;
    user: BackendAuthUser;
    backendRole: string | null;
  }
> {
  const response = await requestJson<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const userType = mapBackendRoleToUserType(response.user.role);

  if (!userType) {
    throw new Error(
      `Unsupported backend role: ${response.user.role ?? "unknown"}`
    );
  }

  return {
    isAuthenticated: true,
    userType,
    accessToken: response.accessToken,
    backendRole: response.user.role ?? null,
    user: response.user,
  };
}

export async function signupWithBackend(payload: BackendSignupPayload): Promise<
  AuthSession & {
    accessToken: string;
    user: BackendAuthUser;
    backendRole: string | null;
  }
> {
  const response = await requestJson<BackendAuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const userType = mapBackendRoleToUserType(response.user.role);

  if (!userType) {
    throw new Error(
      `Unsupported backend role: ${response.user.role ?? "unknown"}`
    );
  }

  return {
    isAuthenticated: true,
    userType,
    accessToken: response.accessToken,
    backendRole: response.user.role ?? null,
    user: response.user,
  };
}
