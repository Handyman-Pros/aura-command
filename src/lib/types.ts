// AuraOps API Types

export type SystemStatus = 'safe' | 'warning' | 'critical';

export interface Property {
  id: string;
  name: string;
  lat: number;
  lng: number;
  state: string;
  city: string;
  status: SystemStatus;
  activeSystems: number;
  totalSystems: number;
  lastCheckin: string;
}

export interface RegionHealth {
  region: string;
  states: string[];
  propertiesCount: number;
  status: SystemStatus;
  uptime: number;
  activeAlerts: number;
}

export interface Vendor {
  id: string;
  name: string;
  trade: string;
  state: string;
  zipCode: string;
  complianceStatus: 'compliant' | 'pending' | 'expired' | 'non-compliant';
  rating: number;
  phone: string;
  email: string;
  lastDispatch: string;
}

export interface DispatchLog {
  id: string;
  timestamp: string;
  propertyName: string;
  alertType: SystemStatus;
  system: string;
  message: string;
  vendorAssigned: string | null;
  status: 'processing' | 'dispatched' | 'resolved' | 'escalated';
}

export interface VendorFilters {
  state?: string;
  zipCode?: string;
  trade?: string;
  complianceStatus?: string;
}

export interface ApiConfig {
  baseUrl: string;
  apiKey: string;
}
