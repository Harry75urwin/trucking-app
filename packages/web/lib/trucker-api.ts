import type { AuthSession } from "@/lib/auth-session";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

async function requestJson<T>(
  path: string,
  init?: RequestInit & { accessToken?: string | null },
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.accessToken
        ? { Authorization: `Bearer ${init.accessToken}` }
        : {}),
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
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  return body as T;
}

export function getAccessToken(session: AuthSession) {
  return session.accessToken ?? null;
}

export type UploadKind = 'load' | 'vehicle' | 'organization-logo';

export interface PresignedUploadResponse {
  url: string;
  key: string;
  publicUrl: string;
  contentType: string;
}

export async function createPresignedUpload(
  session: AuthSession,
  data: {
    kind: UploadKind;
    fileName: string;
    contentType?: string;
  },
): Promise<PresignedUploadResponse> {
  return requestJson<PresignedUploadResponse>('/uploads/presign', {
    method: 'POST',
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function uploadFileToR2(
  session: AuthSession,
  file: File,
  kind: UploadKind,
): Promise<string> {
  const presigned = await createPresignedUpload(session, {
    kind,
    fileName: file.name,
    contentType: file.type || undefined,
  });

  const response = await fetch(presigned.url, {
    method: 'PUT',
    headers: {
      'Content-Type': presigned.contentType || file.type || 'application/octet-stream',
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload file to R2: ${response.status}`);
  }

  return presigned.publicUrl;
}

export interface BackendLoad {
  id: string;
  load_number: string;
  customer_id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date?: string;
  delivery_date?: string;
  commodity: string;
  weight_lbs: number;
  miles: number;
  rate: number;
  fuel_surcharge: number;
  detention: number;
  total_revenue?: number;
  notes?: string;
  imageUrls?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BackendVehicle {
  id: string;
  unit_number: string;
  type: string;
  year: number;
  make: string;
  model: string;
  license_plate: string;
  mileage: number;
  next_service_miles: number;
  imageUrls?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BackendTrackingEvent {
  id: string;
  loadId: string;
  vehicleId?: string;
  driverId?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  status?: string;
  note?: string;
  recordedAt: string;
}

export interface BackendDispatch {
  id: string;
  loadId: string;
  driverId: string;
  vehicleId: string;
  organizationId?: string;
  scheduledAt?: string;
  dispatchedAt?: string;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchLoads(session: AuthSession): Promise<BackendLoad[]> {
  return requestJson<BackendLoad[]>("/loads", {
    accessToken: getAccessToken(session),
  });
}

export async function fetchLoad(
  session: AuthSession,
  id: string,
): Promise<BackendLoad> {
  return requestJson<BackendLoad>(`/loads/${id}`, {
    accessToken: getAccessToken(session),
  });
}

export async function createLoad(
  session: AuthSession,
  data: Omit<BackendLoad, 'id' | 'created_at' | 'updated_at'>,
): Promise<BackendLoad> {
  return requestJson<BackendLoad>('/loads', {
    method: 'POST',
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function updateLoad(
  session: AuthSession,
  id: string,
  data: Partial<Omit<BackendLoad, 'id' | 'created_at' | 'updated_at'>>,
): Promise<BackendLoad> {
  await requestJson<void>(`/loads/${id}`, {
    method: 'PATCH',
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
  return fetchLoad(session, id);
}

export async function fetchVehicles(
  session: AuthSession,
): Promise<BackendVehicle[]> {
  return requestJson<BackendVehicle[]>("/vehicles", {
    accessToken: getAccessToken(session),
  });
}

export async function fetchVehicle(
  session: AuthSession,
  id: string,
): Promise<BackendVehicle> {
  return requestJson<BackendVehicle>(`/vehicles/${id}`, {
    accessToken: getAccessToken(session),
  });
}

export async function updateVehicle(
  session: AuthSession,
  id: string,
  data: Partial<Omit<BackendVehicle, "id" | "created_at" | "updated_at">>,
): Promise<BackendVehicle> {
  await requestJson<void>(`/vehicles/${id}`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });

  return fetchVehicle(session, id);
}

export async function fetchTrackingEvents(
  session: AuthSession,
): Promise<BackendTrackingEvent[]> {
  return requestJson<BackendTrackingEvent[]>("/tracking", {
    accessToken: getAccessToken(session),
  });
}

export interface BackendUser {
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

export interface BackendOrganization {
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
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendLoadTemplate {
  id: string;
  name: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date?: string;
  delivery_date?: string;
  commodity: string;
  weight_lbs: number;
  miles: number;
  rate: number;
  fuel_surcharge: number;
  detention: number;
  notes?: string;
  usage_count: number;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export async function updateUser(
  session: AuthSession,
  id: number,
  data: Partial<BackendUser>,
): Promise<BackendUser> {
  return requestJson<BackendUser>(`/users/${id}`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function updateOrganization(
  session: AuthSession,
  id: number,
  data: Partial<BackendOrganization>,
): Promise<BackendOrganization> {
  return requestJson<BackendOrganization>(`/organizations/${id}`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function fetchOrganization(
  session: AuthSession,
  id: number,
): Promise<BackendOrganization> {
  return requestJson<BackendOrganization>(`/organizations/${id}`, {
    accessToken: getAccessToken(session),
  });
}

export async function fetchOrganizations(
  session: AuthSession,
): Promise<BackendOrganization[]> {
  return requestJson<BackendOrganization[]>("/organizations", {
    accessToken: getAccessToken(session),
  });
}

export async function createOrganization(
  session: AuthSession,
  data: Partial<BackendOrganization>,
): Promise<BackendOrganization> {
  return requestJson<BackendOrganization>("/organizations", {
    method: "POST",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function deleteOrganization(
  session: AuthSession,
  id: number,
): Promise<void> {
  return requestJson<void>(`/organizations/${id}`, {
    method: "DELETE",
    accessToken: getAccessToken(session),
  });
}

export async function fetchDrivers(
  session: AuthSession,
): Promise<BackendDriver[]> {
  return requestJson<BackendDriver[]>("/drivers", {
    accessToken: getAccessToken(session),
  });
}

export async function fetchDriver(
  session: AuthSession,
  id: string,
): Promise<BackendDriver> {
  return requestJson<BackendDriver>(`/drivers/${id}`, {
    accessToken: getAccessToken(session),
  });
}

export async function updateDriver(
  session: AuthSession,
  id: string,
  data: Partial<Omit<BackendDriver, "id" | "created_at" | "updated_at">>,
): Promise<BackendDriver> {
  await requestJson<void>(`/drivers/${id}`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });

  return fetchDriver(session, id);
}

export interface BackendDriver {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cdl_number: string;
  cdl_expiry?: string;
  medical_expiry?: string;
  home_city?: string;
  home_state?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function fetchLoadTemplates(
  session: AuthSession,
  organizationId?: string,
): Promise<BackendLoadTemplate[]> {
  const qs = organizationId
    ? `?organization_id=${encodeURIComponent(organizationId)}`
    : "";
  return requestJson<BackendLoadTemplate[]>(`/load-templates${qs}`, {
    accessToken: getAccessToken(session),
  });
}

export async function createLoadTemplate(
  session: AuthSession,
  data: BackendLoadTemplate,
): Promise<BackendLoadTemplate> {
  return requestJson<BackendLoadTemplate>("/load-templates", {
    method: "POST",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function deleteLoadTemplate(
  session: AuthSession,
  id: string,
): Promise<void> {
  return requestJson<void>(`/load-templates/${id}`, {
    method: "DELETE",
    accessToken: getAccessToken(session),
  });
}

export async function fetchLoadAssignments(
  session: AuthSession,
): Promise<BackendLoadAssignment[]> {
  return requestJson<BackendLoadAssignment[]>("/load_assignments", {
    accessToken: getAccessToken(session),
  });
}

export async function createLoadAssignment(
  session: AuthSession,
  data: {
    load_id: string;
    driver_id?: string;
    truck_id?: string;
    trailer_id?: string;
  },
): Promise<BackendLoadAssignment> {
  return requestJson<BackendLoadAssignment>("/load_assignments", {
    method: "POST",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function deleteLoadAssignment(
  session: AuthSession,
  id: string,
): Promise<void> {
  return requestJson<void>(`/load_assignments/${id}`, {
    method: "DELETE",
    accessToken: getAccessToken(session),
  });
}

export async function updateLoadAssignment(
  session: AuthSession,
  id: string,
  data: {
    load_id: string;
    driver_id?: string | null;
    truck_id?: string | null;
    trailer_id?: string | null;
  },
): Promise<BackendLoadAssignment> {
  return requestJson<BackendLoadAssignment>(`/load_assignments/${id}`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export interface BackendLoadAssignment {
  id: string;
  load_id: string;
  driver_id?: string | null;
  truck_id?: string | null;
  trailer_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface BackendConversation {
  id: string;
  loadId?: string;
  organizationId?: number;
  createdBy: number;
  receiverId?: number;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendMessage {
  id: string;
  conversationId: string;
  senderId: number;
  receiverId: number;
  body: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export async function fetchConversations(
  session: AuthSession,
  userId: number,
): Promise<BackendConversation[]> {
  return requestJson<BackendConversation[]>(
    `/messaging/conversations?userId=${encodeURIComponent(userId)}`,
    { accessToken: getAccessToken(session) },
  );
}

export async function createConversation(
  session: AuthSession,
  data: {
    loadId?: string;
    organizationId?: number;
    userId: number;
    receiverId: number;
  },
): Promise<BackendConversation> {
  return requestJson<BackendConversation>("/messaging/conversations", {
    method: "POST",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function fetchMessages(
  session: AuthSession,
  conversationId: string,
  limit = 50,
): Promise<BackendMessage[]> {
  return requestJson<BackendMessage[]>(
    `/messaging/conversations/${conversationId}/messages?limit=${limit}`,
    { accessToken: getAccessToken(session) },
  );
}

export async function sendMessage(
  session: AuthSession,
  data: {
    conversationId: string;
    senderId: number;
    receiverId: number;
    body: string;
    attachmentUrl?: string;
  },
): Promise<BackendMessage> {
  return requestJson<BackendMessage>("/messaging/messages", {
    method: "POST",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function markMessageRead(
  session: AuthSession,
  messageId: string,
): Promise<BackendMessage> {
  return requestJson<BackendMessage>(`/messaging/messages/${messageId}/read`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
  });
}

export async function fetchUsers(session: AuthSession): Promise<BackendUser[]> {
  return requestJson<BackendUser[]>("/users", {
    accessToken: getAccessToken(session),
  });
}

export async function fetchDispatches(
  session: AuthSession,
): Promise<BackendDispatch[]> {
  return requestJson<BackendDispatch[]>("/dispatches", {
    accessToken: getAccessToken(session),
  });
}

export async function createDispatch(
  session: AuthSession,
  data: Omit<BackendDispatch, "id" | "createdAt" | "updatedAt">,
): Promise<BackendDispatch> {
  return requestJson<BackendDispatch>("/dispatches", {
    method: "POST",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function updateDispatch(
  session: AuthSession,
  id: string,
  data: Partial<Omit<BackendDispatch, "id" | "createdAt" | "updatedAt">>,
): Promise<BackendDispatch> {
  return requestJson<BackendDispatch>(`/dispatches/${id}`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function deleteDispatch(
  session: AuthSession,
  id: string,
): Promise<void> {
  return requestJson<void>(`/dispatches/${id}`, {
    method: "DELETE",
    accessToken: getAccessToken(session),
  });
}

export interface BackendCustomer {
  id: string;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export async function fetchCustomers(
  session: AuthSession,
): Promise<BackendCustomer[]> {
  return requestJson<BackendCustomer[]>("/customers", {
    accessToken: getAccessToken(session),
  });
}

export async function createCustomer(
  session: AuthSession,
  data: Omit<BackendCustomer, "id" | "created_at" | "updated_at">,
): Promise<BackendCustomer> {
  return requestJson<BackendCustomer>("/customers", {
    method: "POST",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function updateCustomer(
  session: AuthSession,
  id: string,
  data: Partial<Omit<BackendCustomer, "id" | "created_at" | "updated_at">>,
): Promise<BackendCustomer> {
  return requestJson<BackendCustomer>(`/customers/${id}`, {
    method: "PATCH",
    accessToken: getAccessToken(session),
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(
  session: AuthSession,
  id: string,
): Promise<void> {
  return requestJson<void>(`/customers/${id}`, {
    method: "DELETE",
    accessToken: getAccessToken(session),
  });
}
