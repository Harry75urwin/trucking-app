import type { AuthSession, UserType } from "@/lib/auth-session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const DEFAULT_TIMEOUT = 15000;

function getUserFriendlyMessage(status: number, fallback: string): string {
  if (status === 401) return "Session expired";
  if (status === 403) return "Access denied";
  if (status >= 500) return "Server error. Please try again later.";
  if (status === 0 || status === -1) return "No internet connection";
  return fallback;
}

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
  organizationName?: string;
  organizationEmail?: string;
  organizationPhoneNumber?: string;
  organizationWebsite?: string;
  organizationAddress?: string;
  organizationCity?: string;
  organizationState?: string;
  organizationPostalCode?: string;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      ...init,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

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
        getUserFriendlyMessage(
          response.status,
          Array.isArray(message) ? message.join(", ") : String(message)
        )
      );
    }

    return body as T;
  } catch (e) {
    clearTimeout(timeoutId);
    if (e instanceof Error) {
      if (e.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw e;
    }
    throw new Error("Unexpected API error");
  }
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
