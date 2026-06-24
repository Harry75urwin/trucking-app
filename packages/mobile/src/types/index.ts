export type UserRole = 'driver' | 'dispatcher' | 'fleet_manager' | 'admin' | 'customer';

export interface AuthResponse {
  accessToken: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    name?: string;
    role?: UserRole;
    organizationId?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
  };
  organization?: {
    id: number;
    name: string;
    email?: string;
    phoneNumber?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    description?: string;
    ownerUserId?: number;
  } | null;
}

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface SignupPayload {
  phone: string;
  password: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  name?: string;
  role?: UserRole;
  organizationId?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
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

export interface Driver {
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

export interface Vehicle {
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

export interface Load {
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
  status: 'pending' | 'dispatched' | 'in_transit' | 'delivered' | 'problem';
  created_at: string;
  updated_at: string;
}

export interface Dispatch {
  id: string;
  loadId: string;
  driverId: string;
  vehicleId: string;
  organizationId?: number;
  scheduledAt?: string;
  dispatchedAt?: string;
  status?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEvent {
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

export interface Message {
  id: string;
  conversationId: string;
  senderId: number;
  receiverId: number;
  body: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  loadId?: string;
  organizationId?: number;
  createdBy: number;
  receiverId?: number;
  lastMessageAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoadAssignment {
  id: string;
  load_id: string;
  driver_id?: string | null;
  truck_id?: string | null;
  created_at: string;
  updated_at: string;
}