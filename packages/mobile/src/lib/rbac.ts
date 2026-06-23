import type { UserRole } from '../types';

export type { UserRole } from '../types';

export type AccessModel =
  | 'dashboard'
  | 'loads'
  | 'tracking'
  | 'messaging'
  | 'fleet'
  | 'drivers'
  | 'customers'
  | 'activity'
  | 'settings'
  | 'profile'
  | 'load_assignments'
  | 'dispatches';

const ALL_ROLES: UserRole[] = ['admin', 'dispatcher', 'fleet_manager', 'driver', 'customer'];

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  dispatcher: 'Dispatcher',
  fleet_manager: 'Fleet Manager',
  driver: 'Driver',
  customer: 'Customer',
};

const MODEL_LABELS: Record<AccessModel, string> = {
  dashboard: 'Dashboard',
  loads: 'Loads',
  tracking: 'Tracking',
  messaging: 'Messaging',
  fleet: 'Fleet',
  drivers: 'Drivers',
  customers: 'Customers',
  activity: 'Activity',
  settings: 'Settings',
  profile: 'Profile',
  load_assignments: 'Load assignments',
  dispatches: 'Dispatches',
};

const MODEL_ACCESS: Record<AccessModel, UserRole[]> = {
  dashboard: ALL_ROLES,
  loads: ALL_ROLES,
  tracking: ALL_ROLES,
  messaging: ALL_ROLES,
  fleet: ['admin', 'dispatcher', 'fleet_manager'],
  drivers: ['admin', 'dispatcher', 'fleet_manager'],
  customers: ['admin', 'dispatcher'],
  activity: ALL_ROLES,
  settings: ALL_ROLES,
  profile: ALL_ROLES,
  load_assignments: ['admin', 'dispatcher', 'fleet_manager'],
  dispatches: ['admin', 'dispatcher', 'fleet_manager'],
};

export function canAccessModel(role: UserRole | undefined, model: AccessModel) {
  if (!role) return false;
  return MODEL_ACCESS[model].includes(role);
}

export function canAccessAnyModel(role: UserRole | undefined, models: AccessModel[]) {
  return models.some((model) => canAccessModel(role, model));
}

export function formatRole(role: UserRole | undefined) {
  return role ? ROLE_LABELS[role] : 'Unknown role';
}

export function formatModel(model: AccessModel) {
  return MODEL_LABELS[model];
}
