import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export type LoadStatus =
  | "pending"
  | "dispatched"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "problem";
export type DriverStatus = "available" | "on_load" | "off_duty";
export type VehicleStatus = "active" | "maintenance" | "out_of_service";
export type VehicleType = "truck" | "trailer";

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
  notes: string;
  created_at: string;
}

export interface Driver {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  cdl_number: string;
  cdl_expiry: string;
  medical_expiry: string;
  home_city: string;
  home_state: string;
  status: DriverStatus;
  created_at: string;
}

export interface Vehicle {
  id: string;
  unit_number: string;
  type: VehicleType;
  year: number;
  make: string;
  model: string;
  license_plate: string;
  mileage: number;
  next_service_miles: number;
  status: VehicleStatus;
  created_at: string;
}

export interface Load {
  id: string;
  load_number: string;
  customer_id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_date: string;
  delivery_date: string;
  commodity: string;
  weight_lbs: number;
  miles: number;
  rate: number;
  fuel_surcharge: number;
  detention: number;
  total_revenue: number;
  notes: string;
  status: LoadStatus;
  created_at: string;
  updated_at: string;
}

export interface LoadAssignment {
  id: string;
  load_id: string;
  driver_id: string | null;
  truck_id: string | null;
  trailer_id: string | null;
  created_at: string;
}
