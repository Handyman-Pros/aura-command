import { useQuery } from '@tanstack/react-query';
import { api, getApiConfig } from './api';
import { mockProperties, mockRegions, mockVendors, mockDispatchLogs } from './mock-data';
import { VendorFilters } from './types';

function isConnected() {
  const config = getApiConfig();
  return Boolean(config?.baseUrl);
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      if (!isConnected()) return mockProperties;
      return api.getProperties();
    },
    refetchInterval: 10000,
  });
}

export function useRegionHealth() {
  return useQuery({
    queryKey: ['regionHealth'],
    queryFn: async () => {
      if (!isConnected()) return mockRegions;
      return api.getRegionHealth();
    },
    refetchInterval: 15000,
  });
}

export function useVendors(filters?: VendorFilters) {
  return useQuery({
    queryKey: ['vendors', filters],
    queryFn: async () => {
      if (!isConnected()) {
        let results = [...mockVendors];
        if (filters?.state) results = results.filter(v => v.state === filters.state);
        if (filters?.zipCode) results = results.filter(v => v.zipCode.startsWith(filters.zipCode!));
        if (filters?.trade) results = results.filter(v => v.trade === filters.trade);
        if (filters?.complianceStatus) results = results.filter(v => v.complianceStatus === filters.complianceStatus);
        return results;
      }
      return api.getVendors(filters);
    },
  });
}

export function useDispatchLogs() {
  return useQuery({
    queryKey: ['dispatches'],
    queryFn: async () => {
      if (!isConnected()) return mockDispatchLogs;
      return api.getDispatchLogs();
    },
    refetchInterval: 5000,
  });
}
