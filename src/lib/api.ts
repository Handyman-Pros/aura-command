import { ApiConfig, Property, RegionHealth, Vendor, VendorFilters, DispatchLog } from './types';

const CONFIG_KEY = 'auraops_api_config';

export function getApiConfig(): ApiConfig | null {
  const stored = localStorage.getItem(CONFIG_KEY);
  if (!stored) return null;
  try { return JSON.parse(stored); } catch { return null; }
}

export function setApiConfig(config: ApiConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearApiConfig(): void {
  localStorage.removeItem(CONFIG_KEY);
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const config = getApiConfig();
  if (!config?.baseUrl) throw new Error('API not configured. Set your Replit URL in Settings.');
  
  const url = `${config.baseUrl.replace(/\/$/, '')}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}),
      ...options?.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.text().catch(() => 'Unknown error');
    throw new Error(`API ${res.status}: ${error}`);
  }
  
  return res.json();
}

// API endpoints
export const api = {
  getProperties: () => apiFetch<Property[]>('/api/properties'),
  getRegionHealth: () => apiFetch<RegionHealth[]>('/api/regions/health'),
  getVendors: (filters?: VendorFilters) => {
    const params = new URLSearchParams();
    if (filters?.state) params.set('state', filters.state);
    if (filters?.zipCode) params.set('zip', filters.zipCode);
    if (filters?.trade) params.set('trade', filters.trade);
    if (filters?.complianceStatus) params.set('compliance', filters.complianceStatus);
    const qs = params.toString();
    return apiFetch<Vendor[]>(`/api/vendors${qs ? `?${qs}` : ''}`);
  },
  getDispatchLogs: () => apiFetch<DispatchLog[]>('/api/dispatches'),
  testConnection: () => apiFetch<{ status: string; version: string }>('/api/health'),
};
