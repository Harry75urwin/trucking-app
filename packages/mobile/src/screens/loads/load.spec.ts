import type { Load } from '../../types';

const testLoad: Load = {
  id: 'load-1',
  load_number: 'L-12345',
  customer_id: 'cust-1',
  origin_city: 'Chicago',
  origin_state: 'IL',
  destination_city: 'Los Angeles',
  destination_state: 'CA',
  commodity: 'Electronics',
  weight_lbs: 45000,
  miles: 2000,
  rate: 2500,
  fuel_surcharge: 200,
  detention: 100,
  status: 'in_transit',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-16T14:30:00Z',
};

export function calculateTotalPrice(load: Load): number {
  return (load.rate || 0) + (load.fuel_surcharge || 0) + (load.detention || 0);
}

export const validStatuses = ['pending', 'dispatched', 'in_transit', 'delivered', 'problem'] as const;