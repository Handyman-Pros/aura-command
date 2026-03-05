import { Property, RegionHealth, Vendor, DispatchLog, SystemStatus } from './types';

// Mock data for demo mode (when no API is connected)

const statuses: SystemStatus[] = ['safe', 'warning', 'critical'];

export const mockProperties: Property[] = [
  { id: '1', name: 'The Aura Grand — Manhattan', lat: 40.758, lng: -73.985, state: 'NY', city: 'New York', status: 'safe', activeSystems: 142, totalSystems: 142, lastCheckin: '2s ago' },
  { id: '2', name: 'Aura Bel-Air Estate', lat: 34.078, lng: -118.442, state: 'CA', city: 'Los Angeles', status: 'warning', activeSystems: 87, totalSystems: 90, lastCheckin: '5s ago' },
  { id: '3', name: 'Aura Aspen Lodge', lat: 39.191, lng: -106.818, state: 'CO', city: 'Aspen', status: 'safe', activeSystems: 64, totalSystems: 64, lastCheckin: '1s ago' },
  { id: '4', name: 'Aura Miami Beach Resort', lat: 25.790, lng: -80.130, state: 'FL', city: 'Miami', status: 'critical', activeSystems: 108, totalSystems: 120, lastCheckin: '12s ago' },
  { id: '5', name: 'Aura Lake Tahoe Retreat', lat: 39.096, lng: -120.032, state: 'CA', city: 'Lake Tahoe', status: 'safe', activeSystems: 52, totalSystems: 52, lastCheckin: '3s ago' },
  { id: '6', name: 'Aura Hamptons Villa', lat: 40.928, lng: -72.319, state: 'NY', city: 'Southampton', status: 'safe', activeSystems: 38, totalSystems: 38, lastCheckin: '4s ago' },
  { id: '7', name: 'Aura Scottsdale Oasis', lat: 33.494, lng: -111.926, state: 'AZ', city: 'Scottsdale', status: 'warning', activeSystems: 71, totalSystems: 75, lastCheckin: '8s ago' },
  { id: '8', name: 'Aura Napa Valley Estate', lat: 38.297, lng: -122.286, state: 'CA', city: 'Napa', status: 'safe', activeSystems: 45, totalSystems: 45, lastCheckin: '2s ago' },
  { id: '9', name: 'Aura Chicago Penthouse', lat: 41.878, lng: -87.629, state: 'IL', city: 'Chicago', status: 'safe', activeSystems: 96, totalSystems: 96, lastCheckin: '1s ago' },
  { id: '10', name: 'Aura Maui Oceanfront', lat: 20.798, lng: -156.331, state: 'HI', city: 'Maui', status: 'warning', activeSystems: 55, totalSystems: 58, lastCheckin: '15s ago' },
];

export const mockRegions: RegionHealth[] = [
  { region: 'Northeast', states: ['NY', 'MA', 'CT', 'NJ'], propertiesCount: 4, status: 'safe', uptime: 99.97, activeAlerts: 0 },
  { region: 'Southeast', states: ['FL', 'GA', 'SC', 'NC'], propertiesCount: 3, status: 'critical', uptime: 94.2, activeAlerts: 3 },
  { region: 'West Coast', states: ['CA', 'OR', 'WA'], propertiesCount: 5, status: 'warning', uptime: 98.8, activeAlerts: 1 },
  { region: 'Mountain', states: ['CO', 'AZ', 'UT', 'NV'], propertiesCount: 3, status: 'warning', uptime: 97.5, activeAlerts: 2 },
  { region: 'Midwest', states: ['IL', 'MI', 'OH', 'MN'], propertiesCount: 2, status: 'safe', uptime: 99.99, activeAlerts: 0 },
  { region: 'Pacific', states: ['HI', 'AK'], propertiesCount: 1, status: 'warning', uptime: 96.1, activeAlerts: 1 },
];

const trades = ['HVAC', 'Electrical', 'Plumbing', 'Fire Safety', 'Elevator', 'Security Systems', 'Landscaping', 'Pool Maintenance'];
const complianceStatuses: Vendor['complianceStatus'][] = ['compliant', 'pending', 'expired', 'non-compliant'];

export const mockVendors: Vendor[] = Array.from({ length: 40 }, (_, i) => ({
  id: `v${i + 1}`,
  name: ['Apex Systems', 'Summit Mechanical', 'Elite Fire & Safety', 'Pacific HVAC Group', 'Sterling Electric', 'Precision Plumbing', 'Guardian Security', 'Pinnacle Maintenance', 'Atlas Controls', 'Vanguard Services'][i % 10] + (i >= 10 ? ` #${Math.floor(i / 10) + 1}` : ''),
  trade: trades[i % trades.length],
  state: ['CA', 'NY', 'FL', 'CO', 'AZ', 'IL', 'HI', 'TX'][i % 8],
  zipCode: String(10001 + i * 1111).slice(0, 5),
  complianceStatus: complianceStatuses[i % 4],
  rating: Number((3.5 + (i % 15) * 0.1).toFixed(1)),
  phone: `(${String(200 + i).slice(0, 3)}) 555-${String(1000 + i).slice(0, 4)}`,
  email: `contact@${['apex', 'summit', 'elite', 'pacific', 'sterling', 'precision', 'guardian', 'pinnacle', 'atlas', 'vanguard'][i % 10]}.com`,
  lastDispatch: `${Math.floor(Math.random() * 30) + 1}d ago`,
}));

const dispatchMessages = [
  'HVAC Zone 3 temperature deviation detected — +4.2°F above threshold',
  'Fire suppression system pressure drop in Wing B — maintenance required',
  'Elevator #2 encoder fault — service dispatch initiated',
  'Security perimeter breach sensor triggered — Zone 7 East',
  'Water main pressure anomaly detected — sub-basement level',
  'Emergency generator auto-test failure — switching to backup protocol',
  'Pool chemical balance alert — pH exceeding safe range',
  'Smart lock firmware update failure — Suite 1204',
  'Electrical panel thermal warning — Main distribution board',
  'Landscape irrigation valve stuck open — Water conservation alert',
];

export const mockDispatchLogs: DispatchLog[] = Array.from({ length: 20 }, (_, i) => ({
  id: `d${i + 1}`,
  timestamp: new Date(Date.now() - i * 300000 - Math.random() * 60000).toISOString(),
  propertyName: mockProperties[i % mockProperties.length].name,
  alertType: statuses[i % 3],
  system: trades[i % trades.length],
  message: dispatchMessages[i % dispatchMessages.length],
  vendorAssigned: i % 3 === 0 ? null : mockVendors[i % mockVendors.length].name,
  status: (['processing', 'dispatched', 'resolved', 'escalated'] as const)[i % 4],
}));
